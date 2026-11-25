import { ChemicalRecord } from "../database/cache";
import { ChemicalResolver } from "../pubchem/resolver";
import { RDKitRenderer } from "../renderer/rdkit-renderer";
import {
  WikipediaStructureImage,
  WikipediaStructureResolver,
} from "../wikipedia/structure-resolver";

type ChemicalArtwork =
  | {
      source: "wikipedia";
      images: WikipediaStructureImage[];
      index: number;
    }
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

    let images: WikipediaStructureImage[] = [];
    try {
      images = await this.wikipedia.resolve(name);
    } catch (error) {
      console.warn("ChemHover could not look up a Wikipedia structure image; using RDKit.", error);
    }
    if (!tooltip.isConnected) return;

    if (images.length) {
      this.showRecord(tooltip, record, { source: "wikipedia", images, index: 0 });
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
      const currentImage = artwork.images[artwork.index];
      const image = structure.createEl("img", {
        attr: {
          src: currentImage.imageUrl,
          alt: `${record.name} structure (${currentImage.fileTitle})`,
        },
      });
      image.addEventListener(
        "error",
        () => {
          if (!tooltip.isConnected) return;
          console.warn("ChemHover could not load the Wikipedia image; using RDKit.");
          const remaining = artwork.images.filter((_, index) => index !== artwork.index);
          if (remaining.length) {
            this.showRecord(tooltip, record, {
              source: "wikipedia",
              images: remaining,
              index: Math.min(artwork.index, remaining.length - 1),
            });
          } else {
            void this.showRdkitFallback(tooltip, record);
          }
        },
        { once: true },
      );
      this.addWikipediaControls(tooltip, record, structure, artwork, currentImage);
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

  private addWikipediaControls(
    tooltip: HTMLElement,
    record: ChemicalRecord,
    structure: HTMLElement,
    artwork: Extract<ChemicalArtwork, { source: "wikipedia" }>,
    currentImage: WikipediaStructureImage,
  ): void {
    const controls = structure.createDiv({ cls: "chemhover-image-controls" });
    const source = controls.createEl("a", {
      cls: "chemhover-image-source",
      text: currentImage.license
        ? `Image source · ${currentImage.license}`
        : "Image source & license",
      attr: {
        href: currentImage.pageUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        title: currentImage.fileTitle,
      },
    });
    source.setAttribute("aria-label", `Image source and license for ${currentImage.fileTitle}`);

    const navigation = controls.createDiv({ cls: "chemhover-image-navigation" });
    const previous = navigation.createEl("button", {
      text: "‹",
      attr: { type: "button", "aria-label": "Previous structure image" },
    });
    previous.disabled = artwork.images.length < 2;
    previous.addEventListener("click", () => {
      const index = (artwork.index - 1 + artwork.images.length) % artwork.images.length;
      this.showRecord(tooltip, record, { ...artwork, index });
    });

    navigation.createSpan({
      cls: "chemhover-image-count",
      text: `${artwork.index + 1} / ${artwork.images.length}`,
    });

    const next = navigation.createEl("button", {
      text: "›",
      attr: { type: "button", "aria-label": "Next structure image" },
    });
    next.disabled = artwork.images.length < 2;
    next.addEventListener("click", () => {
      const index = (artwork.index + 1) % artwork.images.length;
      this.showRecord(tooltip, record, { ...artwork, index });
    });

    const fallback = navigation.createEl("button", {
      cls: "chemhover-use-rdkit",
      text: "Use RDKit",
      attr: { type: "button", "aria-label": "Use the RDKit structure instead" },
    });
    fallback.addEventListener("click", () => {
      void this.showRdkitFallback(tooltip, record);
    });
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
