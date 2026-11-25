import { App, requestUrl, SuggestModal } from "obsidian";
import { ChemicalCache, ChemicalRecord } from "../database/cache";

interface PubChemCidResponse {
  IdentifierList?: { CID?: number[] };
}

interface PubChemPropertiesResponse {
  PropertyTable?: { Properties?: PubChemProperty[] };
}

interface PubChemProperty {
  CID: number;
  IUPACName?: string;
  MolecularFormula?: string;
  MolecularWeight?: string | number;
  SMILES?: string;
  ConnectivitySMILES?: string;
  CanonicalSMILES?: string;
  IsomericSMILES?: string;
}

interface PubChemSynonymsResponse {
  InformationList?: { Information?: Array<{ Synonym?: string[] }> };
}

interface ChemicalCandidate {
  cid: number;
  name: string;
  formula: string;
}

const API_ROOT = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const REQUEST_TIMEOUT_MS = 15_000;

function chooseCandidate(
  app: App,
  searchName: string,
  candidates: ChemicalCandidate[],
): Promise<ChemicalCandidate | null> {
  return new Promise((resolve) => {
    let completed = false;
    const modal = new (class extends SuggestModal<ChemicalCandidate> {
      getSuggestions(query: string): ChemicalCandidate[] {
        const normalized = query.toLocaleLowerCase();
        return candidates.filter((candidate) =>
          `${candidate.name} ${candidate.formula} ${candidate.cid}`
            .toLocaleLowerCase()
            .includes(normalized),
        );
      }

      renderSuggestion(candidate: ChemicalCandidate, element: HTMLElement): void {
        element.createEl("div", { text: candidate.name });
        element.createEl("small", {
          text: `${candidate.formula || "Formula unavailable"} · CID ${candidate.cid}`,
        });
      }

      onChooseSuggestion(candidate: ChemicalCandidate): void {
        completed = true;
        resolve(candidate);
      }

      onClose(): void {
        if (!completed) resolve(null);
      }
    })(app);

    modal.setPlaceholder(`Choose the PubChem match for “${searchName}”`);
    modal.open();
  });
}

async function requestJson<T>(url: string): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(
      () => reject(new Error(`PubChem request timed out after ${REQUEST_TIMEOUT_MS} ms.`)),
      REQUEST_TIMEOUT_MS,
    );
  });
  const response = await Promise.race([
    requestUrl({
      url,
      throw: false,
      headers: { Accept: "application/json" },
    }),
    timeout,
  ]).finally(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`PubChem request failed (${response.status}).`);
  }
  return response.json as T;
}

function propertiesUrl(cids: number[], fields: string): string {
  return `${API_ROOT}/compound/cid/${cids.join(",")}/property/${fields}/JSON`;
}

export class ChemicalResolver {
  private pending = new Map<string, Promise<ChemicalRecord | null>>();

  constructor(
    private readonly app: App,
    private readonly cache: ChemicalCache,
  ) {}

  resolve(name: string): Promise<ChemicalRecord | null> {
    const key = name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
    const cached = this.cache.findByAlias(name);
    if (cached) return Promise.resolve(cached);
    if (this.cache.isNegativeCached(name)) return Promise.resolve(null);

    const ongoing = this.pending.get(key);
    if (ongoing) return ongoing;
    const request = this.resolveUncached(name);
    this.pending.set(key, request);
    void request.then(
      () => this.pending.delete(key),
      () => this.pending.delete(key),
    );
    return request;
  }

  async refreshAll(): Promise<number> {
    const records = this.cache.allChemicals();
    let refreshed = 0;
    for (const record of records) {
      const fresh = await this.fetchRecord(record.cid, record.name);
      await this.cache.replace({ ...fresh, synonyms: [...new Set([...fresh.synonyms, ...record.synonyms])] });
      refreshed += 1;
    }
    return refreshed;
  }

  private async resolveUncached(name: string): Promise<ChemicalRecord | null> {
    const cidsResponse = await requestJson<PubChemCidResponse>(
      `${API_ROOT}/compound/name/${encodeURIComponent(name)}/cids/JSON`,
    );
    const cids = [...new Set(cidsResponse.IdentifierList?.CID ?? [])]
      .filter((cid) => Number.isInteger(cid) && cid > 0);

    if (cids.length === 0) {
      await this.cache.rememberMissing(name);
      return null;
    }

    let selectedCid = cids[0];
    if (cids.length > 1) {
      const candidates = await this.getCandidates(cids);
      if (!candidates.length) {
        throw new Error("PubChem returned multiple matches but no selectable compound details.");
      }
      const selected = await chooseCandidate(this.app, name, candidates);
      if (!selected) return null;
      selectedCid = selected.cid;
    }

    const record = await this.fetchRecord(selectedCid, name);
    await this.cache.remember(name, record);
    return record;
  }

  private async getCandidates(cids: number[]): Promise<ChemicalCandidate[]> {
    const candidates: ChemicalCandidate[] = [];
    for (let offset = 0; offset < cids.length; offset += 20) {
      const batch = cids.slice(offset, offset + 20);
      const response = await requestJson<PubChemPropertiesResponse>(
        propertiesUrl(batch, "IUPACName,MolecularFormula,MolecularWeight"),
      );
      for (const property of response.PropertyTable?.Properties ?? []) {
        candidates.push({
          cid: property.CID,
          name: property.IUPACName ?? `PubChem compound ${property.CID}`,
          formula: property.MolecularFormula ?? "",
        });
      }
    }
    return candidates;
  }

  private async fetchRecord(cid: number, fallbackName: string): Promise<ChemicalRecord> {
    const propertyResponse = await requestJson<PubChemPropertiesResponse>(
      propertiesUrl(
        [cid],
        "IUPACName,SMILES,ConnectivitySMILES,MolecularFormula,MolecularWeight",
      ),
    );
    const property = propertyResponse.PropertyTable?.Properties?.[0];
    const molecularWeight = Number(property?.MolecularWeight ?? 0);
    if (property?.CID !== cid) {
      throw new Error(`PubChem did not return properties for CID ${cid}.`);
    }

    const smiles =
      property.SMILES ??
      property.IsomericSMILES ??
      property.CanonicalSMILES ??
      property.ConnectivitySMILES;
    if (!smiles) {
      throw new Error(
        `PubChem returned no SMILES for CID ${cid}. Available fields: ${Object.keys(property).join(", ")}.`,
      );
    }
    if (!Number.isFinite(molecularWeight)) {
      throw new Error(`PubChem returned an invalid molecular weight for CID ${cid}.`);
    }

    const synonymsResponse = await requestJson<PubChemSynonymsResponse>(
      `${API_ROOT}/compound/cid/${cid}/synonyms/JSON`,
    );
    const synonyms = [...new Set(synonymsResponse.InformationList?.Information?.[0]?.Synonym ?? [])]
      .filter((synonym) => synonym.toLocaleLowerCase() !== (property.IUPACName ?? "").toLocaleLowerCase())
      .slice(0, 30);

    return {
      cid,
      name: property.IUPACName || fallbackName,
      synonyms,
      formula: property.MolecularFormula ?? "",
      molecularWeight,
      smiles,
    };
  }
}
