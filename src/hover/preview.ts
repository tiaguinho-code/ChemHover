import { ChemicalRecord } from "../database/cache";
import { ChemicalResolver } from "../pubchem/resolver";
import { RDKitRenderer } from "../renderer/rdkit-renderer";

export class ChemicalPreview {
  private tooltip?: HTMLElement;
  private hideTimer?: number;

  constructor(
    private readonly resolver: ChemicalResolver,
    private readonly renderer: RDKitRenderer,
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
    try {
      const record = await this.resolver.resolve(name);
      if (!record) {
        this.showMessage(tooltip, "No chemical selected or no PubChem match was found.");
        return;
      }
      const svg = await this.renderer.render(record.smiles);
      if (!tooltip.isConnected) return;
      this.showRecord(tooltip, record, svg);
    } catch (error) {
      console.error("ChemHover could not load a chemical preview.", error);
      this.showMessage(
        tooltip,
        error instanceof Error ? error.message : "The chemical preview could not be loaded.",
      );
    }
  }

  private showRecord(tooltip: HTMLElement, record: ChemicalRecord, svg: string): void {
    tooltip.replaceChildren();
    tooltip.createEl("div", { cls: "chemhover-title", text: record.name });
    const structure = tooltip.createDiv({ cls: "chemhover-structure" });
    structure.innerHTML = svg;
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
