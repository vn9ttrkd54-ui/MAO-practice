import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = thetaQuestions.filter(question => question.number >= 360 && question.number <= 389);

test("2025 MAO National Convention contains all 30 sequential Theta questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => 30360 + index));
  assert.equal(questions.map(question => question.answer).join(""), "CADABABBDDEACADCEDBCBBAABBDBEC");
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("the two incorrect printed answer keys are repaired", () => {
  const lens = questions.find(question => question.number === 371);
  assert.equal(lens.answer, "A");
  assert.match(lens.solution, /\\pi-2/);

  const cards = questions.find(question => question.number === 388);
  assert.equal(cards.answer, "E");
  assert.match(cards.solution, /55\/221/);
  assert.ok(!cards.choices.includes(String.raw`\frac{55}{221}`));
});

test("high-risk results agree with independent calculations", () => {
  assert.equal(Math.sqrt(144 / 24), Math.sqrt(6));
  assert.ok(Math.abs(30 / Math.sqrt(3) - 10 * Math.sqrt(3)) < 1e-12);

  const maximum = Math.max(...Array.from({ length: 401 }, (_, index) => {
    const sum = index / 100;
    return (sum + 6 * Math.sqrt(sum)) / 2;
  }));
  assert.equal(maximum, 8);

  const favorableCardPairs = 26 * 25 / 2 + 4 * 3 / 2 - 1;
  assert.equal(favorableCardPairs, 330);
  assert.equal(favorableCardPairs / (52 * 51 / 2), 55 / 221);
});

test("all explanations are substantive and all formulas compile with KaTeX", () => {
  for (const question of questions) {
    assert.ok(question.solution.length >= 120, `Theta ${question.number} explanation is too terse`);
    for (const text of [question.question, ...question.choices, question.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(
          () => katex.renderToString(match[1] ?? match[2], { throwOnError: true, displayMode: match[2] !== undefined }),
          `Theta ${question.number}`,
        );
      }
    }
  }
});
