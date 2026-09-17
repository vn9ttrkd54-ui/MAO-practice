import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(question => question.number >= 266 && question.number <= 295);

test("February Regional 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => 266 + index));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => 10266 + index));
  assert.equal(questions.map(question => question.answer).join(""), "ABABCBABBDBCEDBDBEBCDAABCEDABC");
  questions.forEach(question => assert.equal(question.choices.length, 5));
  assert.equal(new Set(muQuestions.map(question => question.id)).size, muQuestions.length);
});

test("accepted dispute corrections are self-contained and free of editorial notes", () => {
  const get = number => questions.find(question => question.number === number);

  assert.match(get(278).question, /defined for all sufficiently large/);
  assert.match(get(285).question, /f\(0\)=0/);
  assert.match(get(288).question, /absolute value/);
  assert.ok(get(290).question.includes("and with \\(x\\) increasing"));
  assert.match(get(293).question, /positive leading coefficients/);

  for (const question of questions) {
    assert.doesNotMatch(question.question, /previous question|same scenario|same situation/i);
    assert.doesNotMatch(`${question.question}\n${question.solution}`, /disput|thrown out|test bank|original version|region 5/i);
  }
});

test("all February Regional 2026 formulas compile with KaTeX", () => {
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
