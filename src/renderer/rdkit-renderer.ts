import initRDKitModule from "@rdkit/rdkit";
import wasmBase64 from "@rdkit/rdkit/RDKit_minimal.wasm";

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
    const binary = atob(wasmBase64);
    const compressed = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      compressed[index] = binary.charCodeAt(index);
    }
    const wasmStream = new Blob([compressed])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    const wasmBinary = await new Response(wasmStream).arrayBuffer();
    return (await initRDKitModule({ wasmBinary })) as RDKitModule;
  }
}
