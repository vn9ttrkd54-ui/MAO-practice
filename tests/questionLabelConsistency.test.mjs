import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const questionFiles = ["alpha.ts", "mu.ts", "theta.ts"];
const sources = questionFiles.map(file => ({
  file,
  source: readFileSync(new URL(`../data/questions/${file}`, import.meta.url), "utf8"),
}));

test("question-bank labels use canonical names", () => {
  const canonicalLabels = [
    "Function Analysis",
    "Law of Cosines",
    "Trigonometric Identities",
  ];
  const aliases = new Map([
    ["Functions Analysis", "Function Analysis"],
    ["Law of Cosine", "Law of Cosines"],
    ["Trig Identity", "Trigonometric Identities"],
  ]);

  for (const { file, source } of sources) {
    for (const [alias, canonical] of aliases) {
      assert.doesNotMatch(source, new RegExp(`(?:topic:|methods:.*)\\s*[^\\n]*[\"']${alias}[\"']`), `${file}: use ${canonical}`);
    }
  }

  const allSources = sources.map(item => item.source).join("\n");
  for (const label of canonicalLabels) assert.match(allSources, new RegExp(`[\"']${label}[\"']`));
});
