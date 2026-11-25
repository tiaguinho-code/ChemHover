import {
  MarkdownPostProcessorContext,
  Notice,
  Plugin,
} from "obsidian";
import { syntaxTree } from "@codemirror/language";
import {
  EditorView,
  ViewPlugin,
  Decoration,
  DecorationSet,
  WidgetType,
} from "@codemirror/view";
import { ChemicalCache } from "./database/cache";
import { ChemicalPreview } from "./hover/preview";
import { findChemicalExpressions } from "./parser/chemical-parser";
import { ChemicalResolver } from "./pubchem/resolver";
import { RDKitRenderer } from "./renderer/rdkit-renderer";

const TOKEN_SELECTOR = "[data-chemhover]";

class ChemicalNameWidget extends WidgetType {
  constructor(private readonly name: string) {
    super();
  }

  eq(other: WidgetType): boolean {
    return other instanceof ChemicalNameWidget && other.name === this.name;
  }

  toDOM(): HTMLElement {
    return createSpan({
      cls: "chemhover-token",
      text: this.name,
      attr: { "data-chemhover": this.name },
    });
  }

  ignoreEvent(event: Event): boolean {
    return event.type !== "pointerover" && event.type !== "pointerout";
  }
}

export default class ChemHoverPlugin extends Plugin {
  private cache!: ChemicalCache;
  private resolver!: ChemicalResolver;
  private preview!: ChemicalPreview;
  private persistQueue: Promise<void> = Promise.resolve();

  async onload(): Promise<void> {
    this.cache = new ChemicalCache((data) => this.persist(data));
    this.cache.load(await this.loadData());
    this.resolver = new ChemicalResolver(this.app, this.cache);

    const renderer = new RDKitRenderer();
    this.preview = new ChemicalPreview(this.resolver, renderer);
    this.register(() => this.preview.destroy());

    this.registerMarkdownPostProcessor((element, context) =>
      this.processReadingView(element, context),
    );
    this.registerEditorExtension([
      this.createChemicalDecorations(),
      EditorView.domEventHandlers({
        pointerover: (event) => this.handlePointerOver(event),
        pointerout: (event) => this.handlePointerOut(event),
      }),
    ]);

    this.addCommand({
      id: "refresh-chemical-cache",
      name: "Refresh chemical cache from PubChem",
      callback: () => void this.refreshCache(),
    });
    this.addCommand({
      id: "clear-chemical-cache",
      name: "Clear chemical cache",
      callback: () => void this.clearCache(),
    });
  }

  private processReadingView(
    element: HTMLElement,
    _context: MarkdownPostProcessorContext,
  ): void {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent || !parent.textContent?.includes("\\ch")) return NodeFilter.FILTER_REJECT;
        if (
          parent.closest(
            "code, pre, a, script, style, .math, .math-block, .inline-math, .math-inline, .math-block-rendered, .chemhover-token",
          )
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes: Text[] = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
    for (const textNode of textNodes) {
      const source = textNode.nodeValue ?? "";
      const expressions = findChemicalExpressions(source);
      if (!expressions.length) continue;

      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const expression of expressions) {
        fragment.append(source.slice(cursor, expression.start));
        const token = createSpan({
          cls: "chemhover-token",
          text: expression.name,
          attr: { "data-chemhover": expression.name },
        });
        token.addEventListener("pointerenter", () => this.preview.show(token, expression.name));
        token.addEventListener("pointerleave", () => this.preview.scheduleHide());
        fragment.append(token);
        cursor = expression.end;
      }
      fragment.append(source.slice(cursor));
      textNode.replaceWith(fragment);
    }
  }

  private createChemicalDecorations() {
    return ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;

        constructor(private readonly view: EditorView) {
          this.decorations = this.buildDecorations();
        }

        update(): void {
          this.decorations = this.buildDecorations();
        }

        private buildDecorations(): DecorationSet {
          const ranges: Array<{ from: number; to: number; name: string }> = [];
          const visitedLines = new Set<number>();
          for (const visibleRange of this.view.visibleRanges) {
            let line = this.view.state.doc.lineAt(visibleRange.from);
            const lastLine = this.view.state.doc.lineAt(visibleRange.to).number;
            while (line.number <= lastLine) {
              if (!visitedLines.has(line.number)) {
                visitedLines.add(line.number);
                const ignored: Array<{ from: number; to: number }> = [];
                syntaxTree(this.view.state).iterate({
                  from: line.from,
                  to: line.to,
                  enter: (node) => {
                    if (/code|math/i.test(node.name)) {
                      ignored.push({ from: node.from, to: node.to });
                    }
                  },
                });
                for (const expression of findChemicalExpressions(line.text)) {
                  const from = line.from + expression.start;
                  const to = line.from + expression.end;
                  if (ignored.some((range) => from < range.to && to > range.from)) continue;
                  ranges.push({ from, to, name: expression.name });
                }
              }
              if (line.number === lastLine) break;
              line = this.view.state.doc.line(line.number + 1);
            }
          }

          return Decoration.set(
            ranges.map(({ from, to, name }) =>
              Decoration.replace({ widget: new ChemicalNameWidget(name) }).range(from, to),
            ),
          );
        }
      },
      { decorations: (plugin) => plugin.decorations },
    );
  }

  private handlePointerOver(event: Event): boolean {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return false;
    const token = target.closest<HTMLElement>(TOKEN_SELECTOR);
    const name = token?.dataset.chemhover;
    if (token && name) this.preview.show(token, name);
    return false;
  }

  private handlePointerOut(event: Event): boolean {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return false;
    if (target.closest(TOKEN_SELECTOR)) this.preview.scheduleHide();
    return false;
  }

  private async refreshCache(): Promise<void> {
    try {
      const count = await this.resolver.refreshAll();
      new Notice(`ChemHover refreshed ${count} cached chemical${count === 1 ? "" : "s"}.`);
    } catch (error) {
      console.error("ChemHover could not refresh the chemical cache.", error);
      new Notice(
        `ChemHover cache refresh failed: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
  }

  private async clearCache(): Promise<void> {
    try {
      await this.cache.clear();
      new Notice("ChemHover chemical cache cleared.");
    } catch (error) {
      console.error("ChemHover could not clear the chemical cache.", error);
      new Notice("ChemHover could not clear the chemical cache. See the developer console.");
    }
  }

  private persist(data: unknown): Promise<void> {
    const write = this.persistQueue.then(() => this.saveData(data));
    this.persistQueue = write.catch((error: unknown) => {
      console.error("ChemHover could not save its local cache.", error);
      new Notice("ChemHover could not save its local cache. See the developer console.");
    });
    return write;
  }
}
