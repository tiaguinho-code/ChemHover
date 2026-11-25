import esbuild from "esbuild";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = dirname(fileURLToPath(import.meta.url));
const outdir = resolve(root);
const rdkitLicense = readFileSync(resolve(root, "LICENSES/RDKit.txt"), "utf8");
const rdkitLicenseComment = `/*!\n${rdkitLicense.trimEnd().split("\n").map((line) => (line ? ` * ${line}` : " *")).join("\n")}\n */`;
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
    name: "gzip-rdkit-wasm",
    setup(build) {
      build.onLoad({ filter: /RDKit_minimal\.wasm$/ }, ({ path }) => {
        const compressed = gzipSync(readFileSync(path)).toString("base64");
        return {
          contents: `${rdkitLicenseComment}\nexport default ${JSON.stringify(compressed)};`,
          loader: "js",
        };
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
