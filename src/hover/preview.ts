import { ChemicalRecord } from "../database/cache";
import { ChemicalResolver } from "../pubchem/resolver";
import { RDKitRenderer } from "../renderer/rdkit-renderer";
import {
  WikipediaStructureImage,
  WikipediaStructureResolver,
} from "../wikipedia/structure-resolver";

type ChemicalArtwork =
  | { source: "wikipedia"; image: WikipediaStructureImage }
  | { source: "rdkit"; svg: string };

export class ChemicalPreview {
  private tooltip?: HTMLElement;
  private hideTimer?: number;

  constructor(
    private readonly resolver: ChemicalResolver,
    private readonly renderer: RDKitRenderer,
    private readonly wikipedia = new WikipediaStructureResolver(),
  ) {}

  show(target: HTMLElement, name: string): void {
    window.clearTimeout(this.hideTimer);
    this.removeTooltip();
    const tooltip = document.createElement("div");
    tooltip.className = "chemhover-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.addEventListener("pointerenter", () => window.clearTimeout(this.hideTimer));
    tooltip.addEventListener("pointerleave", () => this.scheduleHide());
    tooltip.textContent = "Looking up chemical…";
    document.body.appendChild(tooltip);
    this.tooltip = tooltip;
    this.position(tooltip, target);
    void this.loadPreview(tooltip, name);
  }

  scheduleHide(): void {
    window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => this.removeTooltip(), 160);
  }

  private async loadPreview(tooltip: HTMLElement, name: string): Promise<void> {
    let record: ChemicalRecord | null;
    try {
      record = await this.resolver.resolve(name);
    } catch (error) {
      console.error("ChemHover could not resolve the chemical preview.", error);
      this.showMessage(
        tooltip,
        error instanceof Error ? error.message : "The chemical preview could not be loaded.",
      );
      return;
    }
    if (!record) {
      this.showMessage(tooltip, "No chemical selected or no PubChem match was found.");
      return;
    }

    let image: WikipediaStructureImage | null = null;
    try {
      image = await this.wikipedia.resolve(name);
    } catch (error) {
      console.warn("ChemHover could not look up a Wikipedia structure image; using RDKit.", error);
    }
    if (!tooltip.isConnected) return;

    if (image) {
      this.showRecord(tooltip, record, { source: "wikipedia", image });
      return;
    }
    await this.showRdkitFallback(tooltip, record);
  }

  private showRecord(
    tooltip: HTMLElement,
    record: ChemicalRecord,
    artwork: ChemicalArtwork,
  ): void {
    tooltip.replaceChildren();
    tooltip.createEl("div", { cls: "chemhover-title", text: record.name });
    const structure = tooltip.createDiv({ cls: "chemhover-structure" });
    if (artwork.source === "wikipedia") {
      const image = structure.createEl("img", {
        attr: {
          src: artwork.image.imageUrl,
          alt: `${record.name} chemical structure`,
        },
      });
      image.addEventListener(
        "error",
        () => {
          console.warn("ChemHover could not load the Wikipedia image; using RDKit.");
          void this.showRdkitFallback(tooltip, record);
        },
        { once: true },
      );
      structure.createEl("a", {
        cls: "chemhover-image-source",
        text: "Image source & license",
        attr: {
          href: artwork.image.pageUrl,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      });
    } else {
      structure.innerHTML = artwork.svg;
    }
    const details = tooltip.createDiv({ cls: "chemhover-details" });
    this.addDetail(details, "Formula", record.formula || "Not available");
    this.addDetail(
      details,
      "Molecular weight",
      record.molecularWeight ? `${record.molecularWeight.toFixed(2)} g/mol` : "Not available",
    );
    if (record.synonyms.length) {
      this.addDetail(details, "Synonyms", record.synonyms.slice(0, 5).join(", "));
    }
    this.addDetail(details, "PubChem CID", String(record.cid));
  }

  private async showRdkitFallback(
    tooltip: HTMLElement,
    record: ChemicalRecord,
  ): Promise<void> {
    try {
      const svg = await this.renderer.render(record.smiles);
      if (tooltip.isConnected) {
        this.showRecord(tooltip, record, { source: "rdkit", svg });
      }
    } catch (error) {
      console.error("ChemHover could not render the RDKit fallback.", error);
      this.showMessage(
        tooltip,
        error instanceof Error
          ? error.message
          : "The chemical structure image and RDKit fallback could not be loaded.",
      );
    }
  }

  private addDetail(container: HTMLElement, label: string, value: string): void {
    const row = container.createDiv({ cls: "chemhover-detail" });
    row.createEl("strong", { text: `${label}: ` });
    row.createSpan({ text: value });
  }

  private showMessage(tooltip: HTMLElement, message: string): void {
    if (tooltip.isConnected) tooltip.textContent = message;
  }

  private position(tooltip: HTMLElement, target: HTMLElement): void {
    const bounds = target.getBoundingClientRect();
    const left = Math.min(
      Math.max(12, bounds.left),
      window.innerWidth - Math.min(tooltip.offsetWidth || 360, window.innerWidth - 24) - 12,
    );
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.min(bounds.bottom + 8, window.innerHeight - 24)}px`;
  }

  private removeTooltip(): void {
    this.tooltip?.remove();
    this.tooltip = undefined;
  }
}
