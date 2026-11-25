import esbuild from "esbuild";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const outdir = resolve(root);
const wasmSource = resolve(root, "node_modules/@rdkit/rdkit/dist/RDKit_minimal.wasm");
const wasmTarget = resolve(outdir, "RDKit_minimal.wasm");
const watch = process.argv.includes("--watch");

const options = {
  entryPoints: [resolve(root, "src/main.ts")],
  bundle: true,
  external: ["obsidian", "node:*", "@codemirror/*", "@lezer/*"],
  format: "cjs",
  target: "es2020",
  logLevel: "info",
  outfile: resolve(outdir, "main.js"),
  sourcemap: watch ? "inline" : false,
  plugins: [{
    name: "copy-rdkit-wasm",
    setup(build) {
      build.onEnd((result) => {
        if (result.errors.length) return;
        mkdirSync(outdir, { recursive: true });
        copyFileSync(wasmSource, wasmTarget);
      });
    },
  }],
};

if (watch) {
  const context = await esbuild.context(options);
  await context.watch();
} else {
  await esbuild.build(options);
}
