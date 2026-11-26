import { App, Modal, requestUrl } from "obsidian";
import {
  ChemicalArtworkPreference,
  ChemicalCache,
  ChemicalRecord,
} from "../database/cache";

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

interface PubChemAutocompleteResponse {
  dictionary_terms?: { compound?: string[] };
}

interface WikidataSearchResponse {
  error?: { info?: string };
  search?: Array<{ id?: string }>;
}

interface WikidataEntitiesResponse {
  entities?: Record<
    string,
    {
      claims?: Record<
        string,
        Array<{ mainsnak?: { datavalue?: { value?: unknown } } }>
      >;
    }
  >;
}

interface ChemicalCandidate {
  cid: number;
  name: string;
  formula: string;
}

const API_ROOT = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const REQUEST_TIMEOUT_MS = 15_000;

class HttpRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HttpRequestError";
  }
}

function chooseCandidate(
  app: App,
  searchName: string,
  candidates: ChemicalCandidate[],
): Promise<ChemicalCandidate | null> {
  return new Promise((resolve) => {
    let completed = false;
    const modal = new (class extends Modal {
      onOpen(): void {
        this.setTitle(`Choose the PubChem match for “${searchName}”`);
        const options = this.contentEl.createDiv({ cls: "chemhover-candidate-options" });
        const buttons = candidates.map((candidate) => {
          const button = options.createEl("button", {
            cls: "chemhover-candidate-option",
            attr: { type: "button" },
          });
          button.createEl("div", { text: candidate.name });
          button.createEl("small", {
            text: `${candidate.formula || "Formula unavailable"} · CID ${candidate.cid}`,
          });
          button.addEventListener("click", () => {
            completed = true;
            resolve(candidate);
            this.close();
          });
          return button;
        });
        buttons[0]?.focus();
      }

      onClose(): void {
        if (!completed) resolve(null);
      }
    })(app);
    modal.open();
  });
}

async function requestJson<T>(url: string, service = "PubChem"): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(
      () => reject(new Error(`${service} request timed out after ${REQUEST_TIMEOUT_MS} ms.`)),
      REQUEST_TIMEOUT_MS,
    );
  });
  const response = await Promise.race([
    requestUrl({
      url,
      throw: false,
      headers: {
        Accept: "application/json",
        ...(service === "Wikidata"
          ? {
              "User-Agent":
                "ChemHover/0.1.6 (Obsidian plugin; +https://github.com/tiaguinho-code/ChemHover)",
            }
          : {}),
      },
    }),
    timeout,
  ]).finally(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  });
  if (response.status < 200 || response.status >= 300) {
    throw new HttpRequestError(`${service} request failed (${response.status}).`, response.status);
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

  setArtworkPreference(cid: number, preference: ChemicalArtworkPreference): Promise<void> {
    return this.cache.setArtworkPreference(cid, preference);
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
    let cids = await this.lookupPubChemCids(name);
    if (cids.length === 0) cids = await this.lookupWikidataCids(name);
    if (cids.length === 0) cids = await this.lookupPubChemAutocompleteCids(name);

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

  private async lookupPubChemCids(name: string): Promise<number[]> {
    try {
      const response = await requestJson<PubChemCidResponse>(
        `${API_ROOT}/compound/name/${encodeURIComponent(name)}/cids/JSON`,
      );
      return [...new Set(response.IdentifierList?.CID ?? [])]
        .filter((cid) => Number.isInteger(cid) && cid > 0);
    } catch (error) {
      if (error instanceof HttpRequestError && error.status === 404) return [];
      throw error;
    }
  }

  private async lookupPubChemAutocompleteCids(name: string): Promise<number[]> {
    const url = new URL(
      `${API_ROOT}/autocomplete/compound/${encodeURIComponent(name)}/json`,
    );
    url.searchParams.set("limit", "5");
    let response: PubChemAutocompleteResponse;
    try {
      response = await requestJson<PubChemAutocompleteResponse>(url.toString());
    } catch (error) {
      if (error instanceof HttpRequestError && error.status === 404) return [];
      throw error;
    }

    const suggestions = [...new Set(response.dictionary_terms?.compound ?? [])];
    const matches = await Promise.all(
      suggestions.map((suggestion) => this.lookupPubChemCids(suggestion)),
    );
    return [...new Set(matches.flat())];
  }

  private async lookupWikidataCids(name: string): Promise<number[]> {
    const languages = ["pt-br", "de"];
    const searchResponses = await Promise.all(
      languages.map((language) => {
        const url = new URL(WIKIDATA_API);
        url.search = new URLSearchParams({
          action: "wbsearchentities",
          search: name,
          language,
          uselang: language,
          type: "item",
          limit: "10",
          format: "json",
        }).toString();
        return requestJson<WikidataSearchResponse>(url.toString(), "Wikidata");
      }),
    );
    for (const response of searchResponses) {
      if (response.error) {
        throw new Error(`Wikidata search failed: ${response.error.info ?? "unknown error"}.`);
      }
    }

    const entityIds = [
      ...new Set(searchResponses.flatMap((response) =>
        (response.search ?? [])
          .map((result) => result.id)
          .filter((id): id is string => typeof id === "string" && /^Q\d+$/.test(id)),
      )),
    ];
    if (!entityIds.length) return [];

    const url = new URL(WIKIDATA_API);
    url.search = new URLSearchParams({
      action: "wbgetentities",
      ids: entityIds.join("|"),
      props: "claims",
      format: "json",
    }).toString();
    const entitiesResponse = await requestJson<WikidataEntitiesResponse>(
      url.toString(),
      "Wikidata",
    );
    const cids = entityIds.flatMap((id) =>
      (entitiesResponse.entities?.[id]?.claims?.P662 ?? [])
        .map((claim) => claim.mainsnak?.datavalue?.value)
        .map((value) => typeof value === "string" ? Number(value) : Number.NaN)
        .filter((cid) => Number.isInteger(cid) && cid > 0),
    );
    return [...new Set(cids)];
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
