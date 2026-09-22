import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = thetaQuestions.filter(question => question.number >= 330 && question.number <= 359);

test("FAMAT State Convention 2021 contains all 30 sequential Theta questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, i) => 30330 + i));
  assert.equal(questions.map(question => question.answer).join(""), "BBADCBEACBEBDEABEDBABECAACDCEB");
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("source errors in the adjacency probability and rational inequality are corrected", () => {
  const probability = questions.find(question => question.number === 346);
  assert.equal(probability.answer, "E");
  assert.match(probability.solution, /2\\cdot8!-7!/);
  assert.match(probability.solution, /\\frac5\{12\}/);

  const inequality = questions.find(question => question.number === 356);
  assert.equal(inequality.answer, "D");
  assert.match(inequality.choices[3], /-\\infty,3/);
  assert.doesNotMatch(inequality.choices[3], /-\\infty,-3/);
});

test("high-risk answers agree with independent calculations", () => {
  let placements = 0;
  let adjacentPlacements = 0;
  for (let c = 0; c < 9; c += 1) {
    for (let firstA = 0; firstA < 9; firstA += 1) {
      for (let secondA = firstA + 1; secondA < 9; secondA += 1) {
        if (firstA === c || secondA === c) continue;
        placements += 1;
        if (Math.abs(c - firstA) === 1 || Math.abs(c - secondA) === 1) adjacentPlacements += 1;
      }
    }
  }
  assert.equal(adjacentPlacements / placements, 5 / 12);

  const decimalLog = Array.from({ length: 2020 }, (_, index) => Math.log10(index + 1))
    .reduce((sum, value) => sum + value, 0);
  assert.equal(Math.floor(decimalLog) + 1, 5802);
  assert.equal(Math.floor(decimalLog / Math.log10(100)) + 1, 2901);
});

test("NOTA results are explained by values absent from their choices", () => {
  const expected = new Map([[336, "23"], [340, "14"], [343, "64"], [346, "5"], [351, "6"], [358, "400"]]);
  for (const [number, value] of expected) {
    const question = questions.find(candidate => candidate.number === number);
    assert.equal(question.answer, "E");
    assert.match(question.solution, new RegExp(value));
  }
});

test("all formulas compile with KaTeX", () => {
  for (const question of questions) {
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
