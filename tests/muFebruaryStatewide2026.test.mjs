import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(question => question.number >= 296 && question.number <= 325);

test("King February Statewide 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => 296 + index));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => 10296 + index));
  assert.equal(questions.map(question => question.answer).join(""), "ADACDABBACAACEBCDDDBBECCDABBAB");
  questions.forEach(question => assert.equal(question.choices.length, 5));
  assert.equal(new Set(muQuestions.map(question => question.id)).size, muQuestions.length);
});

test("shared setups are repeated and source corrections are retained", () => {
  const get = number => questions.find(question => question.number === number);

  for (const number of [305, 306]) assert.match(get(number).question, /x\(t\)=t\\cos t/);
  for (const number of [319, 320, 321]) assert.match(get(number).question, /is sadder than another function/);
  for (const number of [323, 324]) assert.match(get(number).question, /Hermite polynomials are defined/);
  assert.match(get(300).solution, /x=2\\pi k/);
  assert.ok(get(315).question.includes("t(\\ln t)^3"));
  assert.match(get(318).question, /Ai}'''\(1\).*Ai}\^\{\(4\)\}/);

  for (const question of questions) {
    assert.doesNotMatch(question.question, /previous question|same scenario|same situation/i);
    assert.doesNotMatch(`${question.question}\n${question.solution}`, /disput|thrown out|test bank|original version/i);
  }
});

test("all King February Statewide 2026 formulas compile with KaTeX", () => {
  for (const question of questions) {
    for (const text of [question.question, ...question.choices, question.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), `MU ${question.number}`);
      }
    }
  }
});

test("high-risk integral values agree with independent calculations", () => {
  const simpson = (fn, start, end, subdivisions = 20000) => {
    const width = (end - start) / subdivisions;
    let total = fn(start) + fn(end);
    for (let index = 1; index < subdivisions; index += 1) {
      total += (index % 2 === 0 ? 2 : 4) * fn(start + index * width);
    }
    return total * width / 3;
  };

  const epsilon = 1e-5;
  const logarithmicIntegral = simpson(theta => Math.log(2 + 2 * Math.sin(theta)), -Math.PI / 2 + epsilon, Math.PI / 2 - epsilon);
  assert.ok(Math.abs(logarithmicIntegral) < 0.001);

  const geometricArea = [...Array(20)].reduce((sum, _, index) => sum + 1 / 2 ** (2 * (index + 1) + 2), 0);
  assert.ok(Math.abs(geometricArea - 1 / 12) < 1e-12);
});
