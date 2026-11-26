declare module "@rdkit/rdkit" {
  interface RDKitInitOptions {
    instantiateWasm?: (
      imports: WebAssembly.Imports,
      receiveInstance: (instance: WebAssembly.Instance) => void,
    ) => Record<string, unknown>;
    locateFile?: (path: string, prefix: string) => string;
  }

  function initRDKitModule(options?: RDKitInitOptions): Promise<unknown>;
  export default initRDKitModule;
}

declare module "@rdkit/rdkit/RDKit_minimal.wasm" {
  const wasmBase64: string;
  export default wasmBase64;
}
