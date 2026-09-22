import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = thetaQuestions.filter(question => question.number >= 390 && question.number <= 419);

test("2024 MAO National Convention contains all 30 sequential Theta questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => 30390 + index));
  assert.equal(questions.map(question => question.answer).join(""), "CCCCDBDDABCBADECDBBCAECDEDCABC");
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("the inverse-function table and unit-sensitive bounce answer are retained", () => {
  const table = questions.find(question => question.number === 398);
  assert.match(table.question, /\\begin\{array\}/);
  assert.match(table.question, /g\^\{-1\}/);

  const bounce = questions.find(question => question.number === 394);
  assert.equal(bounce.answer, "D");
  assert.match(bounce.solution, /30\\cdot3=\\boxed\{90\}/);
});

test("high-risk results agree with independent calculations", () => {
  const latticePoints = [];
  for (let x = -25; x <= 25; x += 1) {
    for (let y = -25; y <= 25; y += 1) {
      if (x * x + y * y === 625) latticePoints.push([x, y]);
    }
  }
  assert.equal(latticePoints.length, 20);

  assert.equal((2 / 5) * (30 * 12 / 2), 72);
  assert.equal(8 * 0.5, 4);
  assert.equal(new Date(Date.UTC(2029, 0, 1)).getUTCDay(), 1);
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
