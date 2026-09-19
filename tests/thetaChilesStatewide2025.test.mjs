import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));

test("Chiles Statewide 2025 replaces the temporary Theta bank", () => {
  const expectedNumbers = [...Array.from({ length: 8 }, (_, index) => index + 1), ...Array.from({ length: 21 }, (_, index) => index + 10)];
  assert.equal(thetaQuestions.length, 29);
  assert.deepEqual(thetaQuestions.map(question => question.number), expectedNumbers);
  assert.deepEqual(thetaQuestions.map(question => question.id), expectedNumbers.map(number => 30000 + number));
  assert.equal(thetaQuestions.map(question => question.answer).join(""), "BAABDADCDDACBCBABBACCEBCABDCA");
  assert.ok(thetaQuestions.every(question => question.choices.length === 5));
  assert.ok(thetaQuestions.every(question => question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
  assert.ok(thetaQuestions.every(question => !question.question.startsWith("[Temporary]")));
  assert.equal(thetaQuestions.some(question => question.number === 9), false);
});

test("source-sensitive details and corrections are retained", () => {
  const get = number => thetaQuestions.find(question => question.number === number);
  assert.match(get(19).solution, /decreased by/);
  assert.match(get(23).solution, /Every real number is also a complex number/);
  assert.match(get(25).solution, /distinct integral solutions/);
  assert.match(get(30).solution, /x=2.*hole/);
  assert.equal(get(29).illustration.src, "/questions/theta-29-balloons.svg");
  assert.ok(existsSync(new URL("../public/questions/theta-29-balloons.svg", import.meta.url)));
  assert.doesNotMatch(source, /disput|thrown out and|original wording|modified to fix/i);
});

test("Theta methods are solving techniques from the established vocabulary", () => {
  const methods = [...new Set(thetaQuestions.flatMap(question => question.methods))].sort();
  assert.deepEqual(methods, ["Determinant", "Geometric Sequence", "Logarithms", "Modular Arithmetic", "Remainder Theorem", "Tangency"]);
});

test("all Chiles Statewide 2025 formulas compile with KaTeX", () => {
  for (const question of thetaQuestions) {
    for (const text of [question.question, ...question.choices, question.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), "Theta " + question.number);
      }
    }
  }
});
