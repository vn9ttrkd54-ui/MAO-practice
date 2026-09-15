import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(q => q.number >= 207 && q.number <= 235);

test("January Statewide set contains 29 usable questions and excludes thrown-out source question 28", () => {
  assert.equal(questions.length, 29);
  assert.deepEqual(questions.map(q => q.number), Array.from({ length: 29 }, (_, i) => 207 + i));
  assert.deepEqual(questions.map(q => q.id), Array.from({ length: 29 }, (_, i) => 10207 + i));
  assert.equal(questions.map(q => q.answer).join(""), "DABEDDABCECDACDDBCDBEBDADBBBD");
  questions.forEach(q => assert.equal(q.choices.length, 5));
  assert.equal(new Set(muQuestions.map(q => q.id)).size, muQuestions.length);
});

test("final accepted wording and choices are incorporated", () => {
  const get = number => questions.find(q => q.number === number);
  assert.match(get(222).question, /finite real number/);
  assert.equal(get(222).answer, "D");
  assert.doesNotMatch(get(232).question, /first degree/i);
  assert.equal(get(232).answer, "B");
  assert.equal(get(233).answer, "B");
  assert.notEqual(get(233).choices[1], get(233).choices[2]);
});

test("all January Statewide formulas compile with KaTeX", () => {
  for (const q of questions) {
    for (const text of [q.question, ...q.choices, q.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), `MU ${q.number}`);
      }
    }
  }
});

test("the shared graph is local and assigned to source questions 1 through 4", () => {
  const graph = readFileSync(new URL("../public/questions/mu-207-210-graphs.svg", import.meta.url), "utf8");
  assert.match(graph, /<svg/);
  for (const q of questions.slice(0, 4)) {
    assert.equal(q.illustration?.src, "/questions/mu-207-210-graphs.svg");
  }
  for (const q of questions.slice(4)) assert.equal(q.illustration, undefined);
});
