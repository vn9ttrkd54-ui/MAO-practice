import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(q => q.number >= 236 && q.number <= 265);

test("January Regional 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(q => q.number), Array.from({ length: 30 }, (_, i) => 236 + i));
  assert.deepEqual(questions.map(q => q.id), Array.from({ length: 30 }, (_, i) => 10236 + i));
  assert.equal(questions.map(q => q.answer).join(""), "CDADCABCBECEBAABCBBECDDBECCCEA");
  questions.forEach(q => assert.equal(q.choices.length, 5));
  assert.equal(new Set(muQuestions.map(q => q.id)).size, muQuestions.length);
});

test("accepted wording and corrected choices are present without editorial notes", () => {
  const get = n => questions.find(q => q.number === n);
  assert.match(get(238).question, /not defined for/);
  assert.match(get(239).question, /vertical tangent/);
  assert.match(get(248).question, /relatively prime/);
  assert.notEqual(get(265).choices[0], get(265).choices[2]);
  for (const q of questions) {
    assert.doesNotMatch(`${q.question}\n${q.solution}`, /disput|thrown out|published|answer key|test bank|original version|youtube/i);
  }
});

test("all January Regional 2026 formulas compile with KaTeX", () => {
  for (const q of questions) for (const text of [q.question, ...q.choices, q.solution]) {
    for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
      assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
        throwOnError: true,
        displayMode: match[2] !== undefined,
      }), `MU ${q.number}`);
    }
  }
});

test("the two graph assets are local and assigned only where needed", () => {
  for (const file of ["mu-238-240-graph.svg", "mu-250-derivative-graphs.svg"]) {
    assert.match(readFileSync(new URL(`../public/questions/${file}`, import.meta.url), "utf8"), /<svg/);
  }
  for (const n of [238,239,240]) assert.equal(questions.find(q => q.number === n).illustration?.src, "/questions/mu-238-240-graph.svg");
  assert.equal(questions.find(q => q.number === 250).illustration?.src, "/questions/mu-250-derivative-graphs.svg");
});
