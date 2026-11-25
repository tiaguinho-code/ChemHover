declare module "@rdkit/rdkit" {
  interface RDKitInitOptions {
    wasmBinary?: ArrayBuffer | Uint8Array;
    locateFile?: (path: string, prefix: string) => string;
  }

  function initRDKitModule(options?: RDKitInitOptions): Promise<unknown>;
  export default initRDKitModule;
}

declare module "@rdkit/rdkit/RDKit_minimal.wasm" {
  const wasmBase64: string;
  export default wasmBase64;
}
