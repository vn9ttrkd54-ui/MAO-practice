import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 120 && question.number <= 149);

test("March Regional 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 120));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 30120));
  assert.equal(questions.map(question => question.answer).join(""), "BCEAAEBABCDCDBDCBCDECADCBACDAC");
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("accepted dispute corrections are incorporated without editorial notes", () => {
  const bisector = questions.find(question => question.number === 125);
  assert.equal(bisector.answer, "E");
  assert.match(bisector.question, /\(-3\\pi,-5\)/);
  assert.match(bisector.solution, /-\\pi-\\frac3\\pi/);

  const polynomial = questions.find(question => question.number === 127);
  assert.doesNotMatch(polynomial.question, /monic/i);
  assert.equal(polynomial.answer, "A");

  const processor = questions.find(question => question.number === 135);
  assert.equal(processor.answer, "C");
  assert.match(processor.solution, /no incorrectly processed bits is excluded/);

  for (const question of questions) {
    assert.doesNotMatch(question.question + "\n" + question.solution, /thrown out|disput|original solution|original wording|region 5/i);
  }
});

test("methods use canonical solving techniques rather than topic labels", () => {
  const topicLabels = new Set(questions.map(question => question.topic));
  for (const question of questions) {
    for (const method of question.methods) {
      assert.ok(!topicLabels.has(method), `Theta ${question.number} uses topic "${method}" as a method`);
    }
  }
});

test("all March Regional 2026 formulas compile with KaTeX", () => {
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
