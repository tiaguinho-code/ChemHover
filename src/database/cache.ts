import { normalizeChemicalName } from "../parser/chemical-parser";

export interface ChemicalRecord {
  cid: number;
  name: string;
  synonyms: string[];
  formula: string;
  molecularWeight: number;
  smiles: string;
  artworkPreference?: ChemicalArtworkPreference;
}

export type ChemicalArtworkPreference =
  | { source: "wikipedia"; fileTitle: string }
  | { source: "rdkit"; fileTitle?: string };

interface CacheData {
  version: 1;
  chemicals: Record<string, ChemicalRecord>;
  aliases: Record<string, number>;
  failed: Record<string, number>;
}

const NEGATIVE_CACHE_TTL = 24 * 60 * 60 * 1000;

function isChemicalArtworkPreference(value: unknown): value is ChemicalArtworkPreference {
  if (!value || typeof value !== "object") return false;
  const preference = value as { source?: unknown; fileTitle?: unknown };
  if (preference.source === "wikipedia") {
    return typeof preference.fileTitle === "string" && preference.fileTitle.length > 0;
  }
  return (
    preference.source === "rdkit" &&
    (preference.fileTitle === undefined ||
      (typeof preference.fileTitle === "string" && preference.fileTitle.length > 0))
  );
}

export class ChemicalCache {
  private chemicals = new Map<number, ChemicalRecord>();
  private aliases = new Map<string, number>();
  private failed = new Map<string, number>();

  constructor(private readonly persist: (data: CacheData) => Promise<void>) {}

  load(data: unknown): void {
    if (!data || typeof data !== "object") return;
    const saved = data as Partial<CacheData>;
    if (saved.version !== 1) return;

    for (const [key, record] of Object.entries(saved.chemicals ?? {})) {
      if (
        record &&
        Number.isInteger(record.cid) &&
        typeof record.name === "string" &&
        typeof record.smiles === "string" &&
        typeof record.formula === "string" &&
        Number.isFinite(record.molecularWeight)
      ) {
        const artworkPreference = record.artworkPreference;
        if (artworkPreference !== undefined && !isChemicalArtworkPreference(artworkPreference)) {
          console.warn(`ChemHover ignored invalid artwork preference for cached chemical "${key}".`);
        }
        this.chemicals.set(record.cid, {
          ...record,
          synonyms: Array.isArray(record.synonyms)
            ? record.synonyms.filter((value): value is string => typeof value === "string")
            : [],
          artworkPreference: isChemicalArtworkPreference(artworkPreference)
            ? artworkPreference
            : undefined,
        });
      } else {
        console.warn(`ChemHover ignored invalid cached chemical record "${key}".`);
      }
    }

    for (const [alias, cid] of Object.entries(saved.aliases ?? {})) {
      if (Number.isInteger(cid) && this.chemicals.has(cid)) {
        this.aliases.set(normalizeChemicalName(alias), cid);
      }
    }

    const now = Date.now();
    for (const [alias, expiresAt] of Object.entries(saved.failed ?? {})) {
      if (Number.isFinite(expiresAt) && expiresAt > now) {
        this.failed.set(normalizeChemicalName(alias), expiresAt);
      }
    }
  }

  findByAlias(name: string): ChemicalRecord | undefined {
    const cid = this.aliases.get(normalizeChemicalName(name));
    return cid === undefined ? undefined : this.chemicals.get(cid);
  }

  isNegativeCached(name: string): boolean {
    const key = normalizeChemicalName(name);
    const expiresAt = this.failed.get(key);
    if (expiresAt === undefined) return false;
    if (expiresAt > Date.now()) return true;
    this.failed.delete(key);
    return false;
  }

  async rememberMissing(name: string): Promise<void> {
    this.failed.set(normalizeChemicalName(name), Date.now() + NEGATIVE_CACHE_TTL);
    await this.save();
  }

  async remember(name: string, record: ChemicalRecord): Promise<void> {
    this.chemicals.set(record.cid, {
      ...record,
      artworkPreference:
        record.artworkPreference ?? this.chemicals.get(record.cid)?.artworkPreference,
    });
    const requestedAlias = normalizeChemicalName(name);
    this.aliases.set(requestedAlias, record.cid);
    this.aliases.set(normalizeChemicalName(record.name), record.cid);
    for (const synonym of record.synonyms) {
      this.aliases.set(normalizeChemicalName(synonym), record.cid);
    }
    this.failed.delete(requestedAlias);
    this.failed.delete(normalizeChemicalName(record.name));
    for (const synonym of record.synonyms) this.failed.delete(normalizeChemicalName(synonym));
    await this.save();
  }

  allChemicals(): ChemicalRecord[] {
    return [...this.chemicals.values()];
  }

  async replace(record: ChemicalRecord): Promise<void> {
    this.chemicals.set(record.cid, {
      ...record,
      artworkPreference:
        record.artworkPreference ?? this.chemicals.get(record.cid)?.artworkPreference,
    });
    this.aliases.set(normalizeChemicalName(record.name), record.cid);
    for (const synonym of record.synonyms) {
      this.aliases.set(normalizeChemicalName(synonym), record.cid);
    }
    await this.save();
  }

  async setArtworkPreference(cid: number, preference: ChemicalArtworkPreference): Promise<void> {
    const record = this.chemicals.get(cid);
    if (!record) throw new Error(`Cannot save artwork preference for uncached chemical CID ${cid}.`);
    this.chemicals.set(cid, { ...record, artworkPreference: preference });
    await this.save();
  }

  async clear(): Promise<void> {
    this.chemicals.clear();
    this.aliases.clear();
    this.failed.clear();
    await this.save();
  }

  private async save(): Promise<void> {
    const chemicals: Record<string, ChemicalRecord> = {};
    for (const [cid, record] of this.chemicals) chemicals[String(cid)] = record;
    const aliases: Record<string, number> = {};
    for (const [alias, cid] of this.aliases) aliases[alias] = cid;
    const failed: Record<string, number> = {};
    for (const [alias, expiresAt] of this.failed) failed[alias] = expiresAt;
    await this.persist({ version: 1, chemicals, aliases, failed });
  }
}
