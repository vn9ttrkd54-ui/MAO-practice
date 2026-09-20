import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 90 && question.number <= 119);

test("King Statewide February 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 90));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 30090));
  assert.equal(questions.map(question => question.answer).join(""), "BCCDCAAABCECBBCBCADCBCCCABCDBB");
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("shared setups are self-contained and source errors are corrected", () => {
  for (const number of [99, 100, 101]) {
    assert.match(questions.find(question => question.number === number).question, /f\(x\)=ax\^2\+bx\+c/);
  }
  for (const number of [107, 108]) {
    assert.match(questions.find(question => question.number === number).question, /x\^2-2x-35/);
  }

  const remainders = questions.find(question => question.number === 106);
  assert.equal(remainders.answer, "C");
  assert.match(remainders.solution, /same zero|have zero/);
  assert.doesNotMatch(remainders.solution, /smaller by a factor/i);

  const binomial = questions.find(question => question.number === 116);
  assert.equal(binomial.answer, "C");
  assert.match(binomial.solution, /difference between their coefficients is \\?\(4h\\?\)/);

  for (const question of questions) {
    assert.doesNotMatch(question.question + "\n" + question.solution, /thrown out|disput|printed solution|source error/i);
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

test("all King Statewide February 2026 formulas compile with KaTeX", () => {
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
