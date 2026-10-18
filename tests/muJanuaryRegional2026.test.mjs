import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(q => (q.id - 10000) >= 236 && (q.id - 10000) <= 265);

const retained = Array.from({ length: 30 }, (_, index) => index + 1).filter(number => number !== 13);

test("January Regional excludes the annotated throw-out and preserves remaining IDs and answers", () => {
  assert.equal(questions.length, 29);
  assert.deepEqual(questions.map(q => (q.id - 10000)), retained.map(number => 235 + number));
  assert.deepEqual(questions.map(q => q.id), retained.map(number => 10235 + number));
  const originalKey = "CDADCABCBECEBAABCBBECDDBECCCEA";
  assert.equal(questions.map(q => q.answer).join(""), retained.map(number => originalKey[number - 1]).join(""));
  assert.ok(!muQuestions.some(question => question.id === 10248));
  questions.forEach(q => assert.equal(q.choices.length, 5));
  assert.equal(new Set(muQuestions.map(q => q.id)).size, muQuestions.length);
});

test("accepted wording and corrected choices are present without editorial notes", () => {
  const get = n => questions.find(q => (q.id - 10000) === n);
  assert.match(get(238).question, /not defined for/);
  assert.match(get(239).question, /vertical tangent/);
  assert.notEqual(get(265).choices[0], get(265).choices[2]);
  for (const q of questions) {
    assert.doesNotMatch(`${q.question}\n${q.solution}`, /disput|thrown out|published|answer key|test bank|original version|youtube/i);
  }
});

test("all January Regional 2026 formulas compile with KaTeX", () => {
  for (const q of questions) for (const text of [q.question, ...q.choices, q.solution]) {
    for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
      assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
        throwOnError: true,
        displayMode: match[2] !== undefined,
      }), `MU ${(q.id - 10000)}`);
    }
  }
});

test("the two graph assets are local and assigned only where needed", () => {
  for (const file of ["mu-238-240-original.svg", "mu-250-original.svg"]) {
    const png = readFileSync(new URL(`../public/questions/${file}`, import.meta.url));
    assert.match(png.toString("utf8"), /<svg\b/);
  }
  for (const n of [238,239,240]) assert.equal(questions.find(q => (q.id - 10000) === n).illustration?.src, "/questions/mu-238-240-original.svg");
  assert.equal(questions.find(q => (q.id - 10000) === 250).illustration?.src, "/questions/mu-250-original.svg");
  assert.equal(questions.filter(question => question.illustration).length, 4);
});

test("all retained original-number credits and difficulty ratings are stable", () => {
  const difficulties = [2,1,2,2,2,1,2,2,2,2,3,5,5,1,3,2,2,2,2,2,5,2,2,4,4,1,5,2,4,4];
  for (const question of questions) {
    const number = question.id - 10235;
    assert.deepEqual(question.source, {
      competition: "2026 January Regional", event: "Calculus Individual", questionNumber: number,
    });
    assert.equal(question.difficulty, difficulties[number - 1]);
  }
});

test("question 21 gives a complete recurrence, all parity cases, and a precise density interpretation", () => {
  const question = questions.find(question => (question.id - 10000) === 256);
  assert.match(question.question, /limiting fraction/);
  assert.match(question.solution, /Step 1/);
  assert.match(question.solution, /Step 5/);
  assert.match(question.solution, /J_m=/);
  assert.match(question.solution, /J_1=/);
  assert.match(question.solution, /Baker/);
  assert.match(question.solution, /nonzero linear combination/);
  assert.match(question.solution, /algebraic coefficients/);
  assert.match(question.solution, /nonexistent uniform probability/);
  assert.doesNotMatch(question.solution, /https?:|video|youtube/i);
  assert.deepEqual(question.methods, ["Integration by Parts"]);
});

test("January sequence and higher-risk integral derivations agree with independent calculations", () => {
  const simpson = (fn, start, end, count = 20000) => {
    const width = (end - start) / count;
    let sum = fn(start) + fn(end);
    for (let index = 1; index < count; index++) sum += (index % 2 ? 4 : 2) * fn(start + index * width);
    return sum * width / 3;
  };
  const integral = n => simpson(x => x ** n * Math.atan(x), 0, 1);
  assert.ok(Math.abs(integral(3) - 1 / 6) < 1e-12);
  assert.ok(Math.abs(integral(7) - 19 / 210) < 1e-12);
  let jEven = Math.PI / 4, jOdd = Math.log(2) / 2;
  for (let m = 2; m <= 31; m++) {
    if (m % 2) jOdd = 1 / (m - 1) - jOdd;
    else jEven = 1 / (m - 1) - jEven;
    const fromParts = (Math.PI / 4 - (m % 2 ? jOdd : jEven)) / m;
    assert.ok(Math.abs(integral(m - 1) - fromParts) < 1e-11);
  }
  assert.ok(Math.abs(simpson(x => Math.atan(x * x - x + 1), 0, 0.5) - Math.log(2) / 2) < 1e-12);
  let sum = 0;
  for (let k = 1; k <= 100000; k++) sum += 1 / (k * k * (k + 1));
  assert.ok(Math.abs(sum - (Math.PI ** 2 / 6 - 1)) < 1e-9);
  let a = 1;
  for (let n = 1; n < 100000; n++) a += 1 / (2 * a + 1);
  assert.ok(Math.abs(a / Math.sqrt(100000) - 1) < 0.002);
});
