export interface ChemicalExpression {
  name: string;
  start: number;
  end: number;
}

const expressionPattern = /\\ch(?:\{([^{}\r\n]+)\}|[ \t]+([^\s\\{}]+))/g;

export function normalizeChemicalName(name: string): string {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function isInInlineCodeOrMath(text: string, position: number): boolean {
  let codeTicks = 0;
  let mathDelimiter = "";

  for (let index = 0; index < position; index += 1) {
    const character = text[index];
    if (character === "\\" && ["(", "["].includes(text[index + 1] ?? "")) {
      mathDelimiter = text[index + 1] === "(" ? "\\)" : "\\]";
      index += 1;
      continue;
    }
    if (
      character === "\\" &&
      mathDelimiter &&
      ["\\)", "\\]"].includes(text.slice(index, index + 2))
    ) {
      if (text.slice(index, index + 2) === mathDelimiter) mathDelimiter = "";
      index += 1;
      continue;
    }
    if (character === "`") {
      let end = index + 1;
      while (text[end] === "`") end += 1;
      const tickCount = end - index;
      if (codeTicks === 0) codeTicks = tickCount;
      else if (codeTicks === tickCount) codeTicks = 0;
      index = end - 1;
      continue;
    }

    if (codeTicks > 0 || mathDelimiter.startsWith("\\") || character !== "$" || text[index - 1] === "\\") continue;
    const delimiter = text[index + 1] === "$" ? "$$" : "$";
    if (!mathDelimiter) {
      mathDelimiter = delimiter;
    } else if (mathDelimiter === delimiter) {
      mathDelimiter = "";
    }
    if (delimiter === "$$") index += 1;
  }

  return codeTicks > 0 || mathDelimiter.length > 0;
}

export function findChemicalExpressions(text: string): ChemicalExpression[] {
  const expressions: ChemicalExpression[] = [];
  expressionPattern.lastIndex = 0;

  for (let match = expressionPattern.exec(text); match; match = expressionPattern.exec(text)) {
    let precedingSlashes = 0;
    for (let index = match.index - 1; text[index] === "\\"; index -= 1) precedingSlashes += 1;
    if (precedingSlashes % 2 === 1) continue;

    const rawName = match[1] ?? match[2] ?? "";
    const name = match[1] ? rawName.trim() : rawName.replace(/[.,;:!?)}\]]+$/, "");
    if (!name || isInInlineCodeOrMath(text, match.index)) continue;
    expressions.push({
      name,
      start: match.index,
      end: match.index + match[0].length - (rawName.length - name.length),
    });
  }

  return expressions;
}
