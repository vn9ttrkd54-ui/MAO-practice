type MathToken = { text: string; math: boolean; command: boolean };

function mathTokens(text: string): MathToken[] {
  const tokens: MathToken[] = [];
  const pattern = /\\[A-Za-z]+|\\[^\r\n]|[A-Za-z]+|\d+(?:\.\d+)?|\s+|[\s\S]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    let value = match[0];
    // Command arguments may contain nested braces or words (for example \text).
    if (value === "{") {
      let depth = 1;
      let end = pattern.lastIndex;
      for (; end < text.length && depth; end++) {
        if (text[end] === "\\") { end++; continue; }
        if (text[end] === "{") depth++;
        if (text[end] === "}") depth--;
      }
      if (!depth) {
        value = text.slice(match.index, end);
        pattern.lastIndex = end;
      }
    }
    const command = /^\\/.test(value);
    const math = command || value.startsWith("{") && value.endsWith("}")
      || /^(?:[A-Za-z]|d[xyzt]|sin|cos|tan|cot|sec|csc|log|ln|lim|pi)$/.test(value)
      || /^\d+(?:\.\d+)?$/.test(value)
      || /^[=+\-*/^_()[\],|<>!&%\u03b1-\u03c9\u221a\u221e\u2264\u2265]$/.test(value);
    tokens.push({ text: value, math, command });
  }
  return tokens;
}

function wrapBareLatex(text: string) {
  const tokens = mathTokens(text);
  let result = "";
  for (let index = 0; index < tokens.length;) {
    if (!tokens[index].math) { result += tokens[index++].text; continue; }
    let end = index;
    while (end < tokens.length && (tokens[end].math || /^\s+$/.test(tokens[end].text))) end++;
    let mathEnd = end;
    while (mathEnd > index && /^(?:\s+|,|[=+\-*/^_])$/.test(tokens[mathEnd - 1].text)) mathEnd--;
    const command = tokens.slice(index, mathEnd).findIndex(token => token.command);
    if (command < 0) {
      result += tokens.slice(index, end).map(token => token.text).join("");
    } else {
      // Keep articles like "a" out of math, but retain a prefix such as x= or 14.
      const prefix = tokens.slice(index, index + command).map(token => token.text).join("");
      const start = /[\d=+\-*/^_()[\]|<>]/.test(prefix) ? index : index + command;
      result += tokens.slice(index, start).map(token => token.text).join("");
      const formula = tokens.slice(start, mathEnd).map(token => token.text).join("");
      // Display math already scrolls horizontally inside the narrow tutor bubble.
      result += formula.length > 80 || formula.includes("\n") ? `\\[${formula}\\]` : `\\(${formula}\\)`;
      result += tokens.slice(mathEnd, end).map(token => token.text).join("");
    }
    index = end;
  }
  return result;
}

export function normalizeTutorMath(text: string) {
  // Valid JSON can still misinterpret a LaTeX \f, \b, \t, \r or \n escape.
  const repaired = text
    .replace(/\u000c(?=(?:rac|orall|box)\b)/g, "\\f")
    .replace(/\u0008(?=(?:ig(?:l|r)?|egin|ar|eta|inom|oldsymbol|oxed|mod|m)\b)/g, "\\b")
    .replace(/\t(?=(?:ext(?:bf|it|rm|normal|color)?|an)\s*[{(])/g, "\\t")
    .replace(/\t(?=(?:heta|imes|au)\b)/g, "\\t")
    .replace(/\r(?=(?:ight|ho)\b)/g, "\\r")
    .replace(/\n(?=(?:abla|eq)\b)/g, "\\n")
    .replace(/\\+u03c0\b/gi, "\\pi")
    .replace(/\\{2,}(?=[()[\]])/g, "\\");

  return repaired.split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g).map(part => {
    if (part.startsWith("\\(") && part.endsWith("\\)") || part.startsWith("\\[") && part.endsWith("\\]")) return part;
    if (part.startsWith("$$") && part.endsWith("$$")) return `\\[${part.slice(2, -2)}\\]`;
    if (part.startsWith("$") && part.endsWith("$")) {
      const body = part.slice(1, -1);
      if (mathTokens(body).every(token => token.math || /^\s+$/.test(token.text))) return `\\(${body}\\)`;
    }
    return wrapBareLatex(part);
  }).join("");
}
