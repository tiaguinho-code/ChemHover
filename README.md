# ChemHover

ChemHover is an Obsidian community plugin that looks up marked chemical names in
PubChem and displays a locally rendered 2D structure and chemical properties on
hover. Cached compounds remain available offline.

## Use

Write a single-word name with shorthand syntax:

```text
\ch Aspirin
```

Use braces for names containing spaces:

```text
\ch{Acetylsalicylic acid}
```

The source Markdown is not changed. Tokens are recognized in Reading view and
Live Preview, outside code spans/blocks and math. When PubChem returns multiple
compounds, choose the intended result from the selection list; that association
is saved for subsequent uses.

## Development

Requires Node.js and npm:

```sh
npm install
npm run typecheck
npm run build
```

The build produces `main.js` and copies RDKit MinimalLib's WebAssembly module
(`RDKit_minimal.wasm`) beside the plugin manifest. For local testing, copy
`manifest.json`, `main.js`, `styles.css`, and `RDKit_minimal.wasm` to
`<vault>/.obsidian/plugins/chemhover/`, then enable ChemHover in Obsidian.
`npm run dev` rebuilds the plugin when source files change.
CodeMirror and Lezer packages are kept external so the editor extension uses
Obsidian's runtime instances instead of bundling duplicates.

Use the **Refresh chemical cache from PubChem** command to update saved data, or
**Clear chemical cache** to remove cached records and aliases. Failed name
lookups are cached for 24 hours; transient request failures are not.

## Implementation

- `src/parser/` recognizes the explicit `\ch` syntax.
- `src/pubchem/` resolves names and asks the user to disambiguate PubChem matches.
- `src/database/` persists chemical records, aliases, and temporary failed lookups
  using Obsidian plugin data storage.
- `src/renderer/` uses RDKit MinimalLib to generate and cache SVG structures.
- `src/hover/` displays the local structure and compound details.

PubChem lookups require an internet connection the first time a name is seen.
The molecule SVG is generated on-device from cached SMILES; no PubChem structure
image is downloaded.
