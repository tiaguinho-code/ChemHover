import initRDKitModule from "@rdkit/rdkit";

interface RDKitMolecule {
  get_svg(): string;
  delete(): void;
}

interface RDKitModule {
  get_mol(smiles: string): RDKitMolecule | null;
}

export class RDKitRenderer {
  private module?: Promise<RDKitModule>;
  private svgCache = new Map<string, string>();

  constructor(private readonly wasmUrl: string) {}

  async render(smiles: string): Promise<string> {
    const cached = this.svgCache.get(smiles);
    if (cached) return cached;

    this.module ??= this.initialize();
    const rdkit = await this.module;
    const molecule = rdkit.get_mol(smiles);
    if (!molecule) throw new Error("RDKit could not parse the returned SMILES.");

    try {
      const svg = molecule.get_svg();
      this.svgCache.set(smiles, svg);
      return svg;
    } finally {
      molecule.delete();
    }
  }

  private async initialize(): Promise<RDKitModule> {
    const response = await fetch(this.wasmUrl);
    if (!response.ok) {
      throw new Error(`Could not load the local RDKit WebAssembly module (${response.status}).`);
    }
    const wasmBinary = await response.arrayBuffer();
    return (await initRDKitModule({
      wasmBinary,
      locateFile: () => this.wasmUrl,
    })) as RDKitModule;
  }
}
