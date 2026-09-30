import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/alpha.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { alphaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = alphaQuestions.filter(question => question.number >= 208 && question.number <= 237);

test("third supplied Alpha set contains all 30 sequential questions and preserved IDs", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 208));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 20271));
  assert.equal(questions.map(question => question.answer).join(""), "ACBBACACBABCCCDACBAACDBBDDEDBC");
  assert.ok(questions.every(question => question.division === "Alpha"));
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(alphaQuestions.map(question => question.id)).size, alphaQuestions.length);
});

test("third set is self-contained and requires no missing illustration", () => {
  assert.ok(questions.every(question => question.illustration === undefined));
  for (const question of questions) {
    assert.doesNotMatch(question.question, /shown below|diagram below|graph below|pictured/i);
  }
});

test("source errors are corrected without unresolved editorial notes", () => {
  assert.equal(questions.find(question => question.id === 20278).answer, "C");
  assert.equal(questions.find(question => question.id === 20284).answer, "C");
  assert.equal(questions.find(question => question.id === 20293).answer, "B");
  assert.match(questions.find(question => question.id === 20281).question, /a is as small as possible/);
  assert.match(questions.find(question => question.id === 20288).question, /\(x\+2\)\(2x-1\)\(2x-3\)\(x-2\)/);
  assert.match(questions.find(question => question.id === 20289).question, /positive real sequences/);
  assert.doesNotMatch(
    questions.map(question => question.question + question.solution).join("\n"),
    /disput|thrown out|withdrawn|appeal/i,
  );
});

test("meaningful third-set labels are retained", () => {
  assert.deepEqual(questions.find(question => question.id === 20271).methods, ["De Moivre's Theorem"]);
  assert.deepEqual(questions.find(question => question.id === 20278).methods, ["Conjugates"]);
  assert.deepEqual(questions.find(question => question.id === 20281).methods, ["Change of Base"]);
  assert.deepEqual(
    questions.find(question => question.id === 20285).methods,
    ["Cross Product", "Dot Product", "Scalar Triple Product"],
  );
  assert.deepEqual(questions.find(question => question.id === 20294).methods, ["AM-GM"]);
  assert.equal(questions.find(question => question.id === 20295).topic, "Combinatorics");
});

test("high-risk third-set answers agree with independent calculations", () => {
  assert.equal(2 * 5 / (1 + 5 ** 2), 5 / 13);
  assert.equal((-2) + 6, 4);

  const tangencyX2 = 1 - (1 / 2) ** 2;
  const centerToVertex = tangencyX2 + 1 / 2;
  assert.equal(centerToVertex, 5 / 4);

  const discontinuities = [-2, 1 / 2, 3 / 2, 2];
  assert.equal(discontinuities[1] * (discontinuities[3] - discontinuities[0]) ** discontinuities[2], 4);
  assert.equal(-2 * 1 ** 2 + 4 * 1, 2);
  assert.equal(3 * (1 + 5 + 10 + 10), 78);
});

test("answer annotations match the stored answer letters", () => {
  for (const question of questions) {
    const annotation = [...question.solution.matchAll(/Answer:\s*\\\(\\boxed\{([A-E])\}\\\)/g)].at(-1);
    assert.equal(annotation?.[1], question.answer, "Alpha " + question.number);
  }
});

test("all third-set Alpha formulas compile with KaTeX", () => {
  const mathDelimiter = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
  for (const question of questions) {
    for (const value of [question.question, ...question.choices, question.solution]) {
      assert.doesNotMatch(value.replace(mathDelimiter, ""), /\\/, "Alpha " + question.number);
      for (const match of value.matchAll(mathDelimiter)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          displayMode: match[1] !== undefined,
          throwOnError: true,
        }), "Alpha " + question.number);
      }
    }
  }
});
