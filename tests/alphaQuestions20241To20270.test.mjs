import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/alpha.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { alphaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = alphaQuestions.filter(question => question.number >= 178 && question.number <= 207);

test("second supplied Alpha set contains all 30 sequential questions and preserved IDs", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 178));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 20241));
  assert.equal(questions.map(question => question.answer).join(""), "ECEACCECCDBEABD CDBAABACDCADDBB".replace(" ", ""));
  assert.ok(questions.every(question => question.division === "Alpha"));
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(alphaQuestions.map(question => question.id)).size, alphaQuestions.length);
});

test("the second set is self-contained and requires no missing illustration", () => {
  assert.ok(questions.every(question => question.illustration === undefined));
  for (const question of questions) {
    assert.doesNotMatch(question.question, /shown below|diagram below|graph below|pictured/i);
  }
});

test("the supplied data has no unresolved editorial status", () => {
  for (const question of questions) {
    assert.doesNotMatch(question.question + question.solution, /disput|thrown out|withdrawn|appeal/i);
  }
});

test("meaningful supplied labels are retained", () => {
  assert.deepEqual(questions.find(question => question.id === 20241).methods, ["Parity"]);
  assert.deepEqual(questions.find(question => question.id === 20245).methods, ["Reflection"]);
  assert.deepEqual(questions.find(question => question.id === 20260).methods, ["Eigenvalues"]);
  assert.deepEqual(questions.find(question => question.id === 20261).methods, ["Base Conversion"]);
  assert.deepEqual(
    questions.find(question => question.id === 20263).methods,
    ["Cross Product", "Scalar Triple Product"],
  );
  assert.equal(questions.find(question => question.id === 20268).topic, "Hyperbolic Functions");
});

test("high-risk answers agree with independent calculations", () => {
  const bowTieArea = Math.abs((-6) * 10 - 4 * 2) / 2
    + Math.abs(9 * (-15) - (-6) * (-3)) / 2;
  assert.equal(bowTieArea, 221 / 2);
  assert.equal(questions.find(question => question.id === 20247).answer, "E");

  const matrix = [
    [7, 5, 0, -10],
    [6, -1, 4, 7],
    [13, 8, -2, -4],
    [4, 3, 0, -6],
  ];
  const determinant = values => values.length === 1
    ? values[0][0]
    : values[0].reduce((sum, value, column) => sum + (column % 2 ? -1 : 1) * value
      * determinant(values.slice(1).map(row => row.filter((_, index) => index !== column))), 0);
  assert.equal(determinant(matrix), 58);

  const scalarTripleProduct = 5 * (3 * -1 - 5 * 5)
    - 1 * (-2 * -1 - 5 * 4)
    + 2 * (-2 * 5 - 3 * 4);
  assert.equal(Math.abs(scalarTripleProduct) / 6, 83 / 3);
  assert.equal(20 * 17 / 2 - Math.hypot(65, 72) + 112 - "Euclid".length, 179);
  assert.equal(2 * 187 + 3 * 188, 938);
});

test("difficulty ratings keep paired direct-identity questions aligned", () => {
  assert.deepEqual(
    questions.filter(question => [20256, 20257, 20258].includes(question.id)).map(question => question.difficulty),
    [2, 2, 2],
  );
  assert.deepEqual(
    questions.filter(question => [20266, 20267, 20268].includes(question.id)).map(question => question.difficulty),
    [2, 2, 2],
  );
});

test("all second-set Alpha formulas compile with KaTeX", () => {
  const mathCommands = /\\(?:frac|sqrt|sum|det|begin|vec|sin|cos|tan|ln|pi|lambda|operatorname|boxed|text|triangle|overline|cdot|pm|ge|le|in|perp|parallel|displaystyle|sinh|cosh)/;
  for (const question of questions) {
    for (const value of [question.question, ...question.choices, question.solution]) {
      if (mathCommands.test(value)) {
        assert.doesNotThrow(() => katex.renderToString(value, { throwOnError: true }), "Alpha " + question.number);
      }
    }
  }
});
