import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 150 && question.number <= 179);

test("NSU March Statewide 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 150));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 30150));
  assert.equal(questions.map(question => question.answer).join(""), "BADDBBEECECBBBADACABCAEBBBBCBB");
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("source corrections and NOTA answers are incorporated without editorial notes", () => {
  const approximation = questions.find(question => question.number === 170);
  assert.match(approximation.question, /smallest positive integer/);
  assert.equal(approximation.answer, "C");
  assert.match(approximation.solution, /x>3/);

  for (const number of [156, 157, 159, 172]) {
    assert.equal(questions.find(question => question.number === number).answer, "E");
  }

  for (const question of questions) {
    assert.doesNotMatch(question.question + "\n" + question.solution, /thrown out|disput|original problem|original solution|original wording/i);
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

test("all NSU March Statewide 2026 formulas compile with KaTeX", () => {
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
