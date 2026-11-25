# ChemHover

ChemHover is an Obsidian community plugin that looks up marked chemical names in
PubChem and displays a chemical structure and properties on hover. It prefers a
Wikipedia structure image when available and falls back to a local RDKit
rendering. Cached compounds remain available offline.

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
Expand **Details** below the image to view the compound name and properties,
cycle through Wikipedia structure matches with the buttons or left/right arrow
keys while hovering, or select **Use RDKit** to switch to the local rendering.

## Development

Requires Node.js and npm:

```sh
npm install
npm run typecheck
npm run build
```

The build embeds a gzip-compressed RDKit MinimalLib WebAssembly module in
`main.js`. For local testing, copy `manifest.json`, `main.js`, and `styles.css` to
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
- `src/wikipedia/` looks up Wikipedia structure images and their source pages.
- `src/database/` persists chemical records, aliases, and temporary failed lookups
  using Obsidian plugin data storage.
- `src/renderer/` uses RDKit MinimalLib to generate and cache fallback SVG structures.
- `src/hover/` displays the local structure and compound details.

PubChem lookups require an internet connection the first time a name is seen.
Wikipedia images require an internet connection. If no suitable image is found
or the image cannot be loaded, the molecule SVG is generated on-device from
cached SMILES; no structure image is downloaded from PubChem.
