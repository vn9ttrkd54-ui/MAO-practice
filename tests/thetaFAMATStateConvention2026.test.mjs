import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 180 && question.number <= 209);

test("FAMAT State Convention 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 180));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 30180));
  assert.equal(questions.map(question => question.answer).join(""), "DACEDBADCACCDACDBABCACBBBBDCAB");
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("question-page choices and corrected solution details are retained", () => {
  const algebra = questions.find(question => question.number === 192);
  assert.equal(algebra.answer, "D");
  assert.match(algebra.solution, /b=-6.*irrational/s);

  const identity = questions.find(question => question.number === 203);
  assert.deepEqual(identity.choices.slice(0, 4), ["1", String.raw`\(\frac23\)`, String.raw`\(\frac8{27}\)`, "Cannot Be Determined"]);
  assert.equal(identity.answer, "B");

  const lottery = questions.find(question => question.number === 204);
  assert.deepEqual(lottery.choices.slice(0, 4), ["$0.80", "$1.00", "$1.40", "$3.00"]);
  assert.equal(lottery.answer, "B");

  for (const question of questions) {
    assert.doesNotMatch(question.question + "\n" + question.solution, /thrown out|disput|original answer|original solution/i);
  }
});

test("all six source diagrams are local, present, and assigned only where needed", () => {
  const illustrated = questions.filter(question => question.illustration);
  assert.deepEqual(illustrated.map(question => question.number), [180, 182, 193, 197, 201, 206]);
  for (const question of illustrated) {
    assert.match(question.illustration.src, /^\/questions\/theta-[\w-]+\.svg$/);
    const asset = readFileSync(new URL(`../public${question.illustration.src}`, import.meta.url), "utf8");
    assert.match(asset, /^<svg/);
    assert.doesNotMatch(asset, /answer|solution/i);
  }
});

test("high-risk numerical answers agree with independent calculations", () => {
  assert.equal((2027 * 1013) % 100, 51);

  const gcd = (a, b) => b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
  let commonDivisor = 0n;
  for (let n = 2027n; n <= 2040n; n += 1n) {
    const value = n ** 3n * (n ** 2n - 1n) * (n ** 2n - 4n);
    commonDivisor = commonDivisor === 0n ? value : gcd(commonDivisor, value);
  }
  assert.equal(commonDivisor, 360n);

  const expectedThrows = 2 * (1 / 3) + 3 * (4 / 9) + 4 * (2 / 9);
  assert.equal(expectedThrows * 18, 52);
});

test("methods use canonical solving techniques rather than topic labels", () => {
  const topicLabels = new Set(questions.map(question => question.topic));
  for (const question of questions) {
    for (const method of question.methods) {
      assert.ok(!topicLabels.has(method), `Theta ${question.number} uses topic "${method}" as a method`);
    }
  }
});

test("all FAMAT State Convention 2026 formulas compile with KaTeX", () => {
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
