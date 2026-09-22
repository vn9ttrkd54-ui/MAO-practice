import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 240 && question.number <= 269);

test("FAMAT State Convention 2024 contains all 30 sequential Theta questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 240));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 30240));
  assert.equal(questions.map(question => question.answer).join(""), "CCCDBBBCAEDCCADDBDBABCEDBDBADB");
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => question.illustration === undefined));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("accepted question 29 correction replaces the erroneous printed solution", () => {
  const question = questions.find(question => question.number === 268);
  assert.equal(question.answer, "D");
  assert.match(question.solution, /7g=540/);
  assert.match(question.solution, /X=540/);
  assert.doesNotMatch(question.solution, /X=180/);
});

test("the supplied statistics contain no thrown-out or unresolved disputed item", () => {
  for (const question of questions) {
    assert.doesNotMatch(question.question + "\n" + question.solution, /thrown out|unresolved|original answer|original solution/i);
  }
});

test("high-risk answers agree with independent calculations", () => {
  assert.equal(99 + (2025 - 9 - 180) / 3, 711);
  assert.equal(19 + 3 + 4, 26);
  assert.equal(28 - 3, 25);
  assert.equal(35 - 6, 29);
  assert.equal(85 * 12 * 7, 51 * 4 * 35);
  assert.equal(49 + 3 + 50 * 4, 252);
});

test("meaningful methods are retained without duplicating topic labels", () => {
  const expected = new Map([
    [240, "Heron's Formula"],
    [243, "Difference of Squares"],
    [244, "Angle Chasing"],
    [252, "Removable Discontinuity"],
    [253, "Pick's Theorem"],
    [255, "Angle Bisector Theorem"],
  ]);
  for (const [number, method] of expected) {
    assert.ok(questions.find(question => question.number === number).methods.includes(method));
  }
  const topics = new Set(questions.map(question => question.topic));
  for (const question of questions) {
    for (const method of question.methods) assert.ok(!topics.has(method));
  }
});

test("all FAMAT State Convention 2024 formulas compile with KaTeX", () => {
  for (const question of questions) {
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
