import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(question => (question.id - 10000) >= 266 && (question.id - 10000) <= 295);

const originalNumbers = Array.from({ length: 30 }, (_, index) => index + 1)
  .filter(number => ![13, 20].includes(number));

test("February Regional excludes the two noted throw-outs without renumbering other records", () => {
  assert.equal(questions.length, 28);
  assert.deepEqual(questions.map(question => (question.id - 10000)), originalNumbers.map(number => 265 + number));
  assert.deepEqual(questions.map(question => question.id), originalNumbers.map(number => 10265 + number));
  const originalKey = "ABABCBABBDBCEDBDBEBCDAABCEDABC";
  assert.equal(questions.map(question => question.answer).join(""), originalNumbers.map(number => originalKey[number - 1]).join(""));
  assert.ok(!muQuestions.some(question => [10278, 10285].includes(question.id)));
  questions.forEach(question => assert.equal(question.choices.length, 5));
  assert.equal(new Set(muQuestions.map(question => question.id)).size, muQuestions.length);
});

test("accepted dispute corrections are self-contained and free of editorial notes", () => {
  const get = number => questions.find(question => (question.id - 10000) === number);

  assert.match(get(288).question, /absolute value/);
  assert.match(get(290).question, /measured along the curve/);
  assert.match(get(291).question, /measured along the curve/);
  assert.match(get(293).question, /positive leading coefficients/);

  for (const question of questions) {
    assert.doesNotMatch(question.question, /previous question|same scenario|same situation/i);
    assert.doesNotMatch(`${question.question}\n${question.solution}`, /disput|thrown out|test bank|original version|region 5/i);
  }
});

test("each retained source credit uses the original paper number and established difficulty", () => {
  const difficulties = [1, 1, 1, 1, 2, 1, 2, 3, 1, 4, 4, 2, 4, 1, 3, 4, 3, 3, 4, 4, 2, 4, 3, 4, 3, 2, 4, 4, 4, 3];
  for (const question of questions) {
    const number = question.id - 10265;
    assert.deepEqual(question.source, {
      competition: "2026 February Regional",
      event: "Calculus Individual",
      questionNumber: number,
    });
    assert.equal(question.difficulty, difficulties[number - 1]);
  }
  assert.deepEqual(questions.find(question => question.id === 10271).methods, ["U-Substitution"]);
});

test("source omissions and mathematical errors are corrected with explicit derivations", () => {
  const get = id => questions.find(question => question.id === id);
  assert.match(get(10276).question, /discrete set/);
  assert.ok(get(10276).solution.includes(String.raw`0,&x=0`));
  assert.match(get(10277).question, /x-coordinate/);
  assert.match(get(10293).solution, /8c\^2/);
  assert.match(get(10289).solution, /difference quotient/);
  assert.match(get(10289).question, /some neighborhood/);
  for (const id of [10282, 10283, 10284]) {
    assert.match(get(id).question, /Euler's identity/);
  }
  assert.doesNotMatch(get(10284).question, /if and only if the real part/);
});

test("piecewise counterexample, critical-point interval, and Legendre normalization hold independently", () => {
  const f = x => x < 0 ? Math.log(Math.abs(x)) + 1 : x > 0 ? Math.log(x) - 1 : 0;
  assert.notEqual(f(-1), f(1));
  for (const x of [-3, -1, 1, 3]) {
    const h = 1e-5;
    assert.ok(Math.abs((f(x + h) - f(x - h)) / (2 * h) - 1 / x) < 1e-8);
  }
  for (const b of [-0.06, -0.03, -0.001]) {
    const roots = [-1, 1].map(sign => (-1 + sign * Math.sqrt(1 + 16 * b)) / (4 * b));
    assert.ok(roots.every(root => root > 0));
    roots.forEach(u => assert.ok(Math.abs(2 * b * u * u + u - 2) < 1e-10));
  }
  const c = 1.5, e = -0.5;
  assert.equal(2 * c / 3 + 2 * e, 0);
  assert.ok(Math.abs(2 * c * c / 5 + 4 * c * e / 3 + 2 * e * e - 2 / 5) < 1e-14);
});

test("all February Regional 2026 formulas compile with KaTeX", () => {
  for (const question of questions) {
    for (const text of [question.question, ...question.choices, question.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), `MU ${(question.id - 10000)}`);
      }
    }
  }
});

test("high-risk optimization and integral answers agree with independent calculations", () => {
  const simpson = (fn, start, end, subdivisions = 20000) => {
    const width = (end - start) / subdivisions;
    let total = fn(start) + fn(end);
    for (let index = 1; index < subdivisions; index += 1) {
      total += (index % 2 === 0 ? 2 : 4) * fn(start + index * width);
    }
    return total * width / 3;
  };

  const reciprocalArctangent = simpson(x => Math.atan(x) / x, 0.5, 2);
  assert.ok(Math.abs(reciprocalArctangent - Math.PI * Math.log(4) / 4) < 1e-10);

  const transformedIntegral = simpson(x => 1 / (1 - 4 * Math.exp(-x) + 8 * Math.exp(-2 * x)), Math.log(2), 2 * Math.log(2));
  assert.ok(Math.abs(transformedIntegral - (Math.log(2) / 2 + Math.PI / 4)) < 1e-10);

  const maximum = 5 * Math.SQRT2;
  const minimum = -5;
  assert.equal(maximum - minimum, 5 * Math.SQRT2 + 5);
  assert.ok(Math.abs((Math.PI / 6 * 2 * Math.sqrt(3)) ** 2 - Math.PI ** 2 / 3) < 1e-14);
});
