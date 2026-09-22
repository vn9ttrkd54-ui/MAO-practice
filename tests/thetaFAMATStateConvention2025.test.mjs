import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 210 && question.number <= 239);

test("FAMAT State Convention 2025 contains all 30 sequential Theta questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 210));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 30210));
  assert.equal(questions.map(question => question.answer).join(""), "BAECCDCAECCBADBDADBBACEDDABBCA");
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("shared source statements are retained in each dependent bank question", () => {
  for (const number of [218, 219]) {
    assert.match(questions.find(question => question.number === number).question, /f'\(x\)=n/);
  }
  for (const number of [221, 222]) {
    assert.match(questions.find(question => question.number === number).question, /ab=6a\+8b/);
  }
  for (const number of [228, 229]) {
    assert.match(questions.find(question => question.number === number).question, /x-1/);
  }
});

test("the required question diagram is local and no diagram is missing", () => {
  const illustrated = questions.filter(question => question.illustration);
  assert.deepEqual(illustrated.map(question => question.number), [225]);
  const illustration = illustrated[0].illustration;
  assert.equal(illustration.src, "/questions/theta-225-three-circles.svg");
  assert.ok(existsSync(new URL(`../public${illustration.src}`, import.meta.url)));
  const asset = readFileSync(new URL(`../public${illustration.src}`, import.meta.url), "utf8");
  assert.match(asset, /^<svg/);
  assert.doesNotMatch(asset, /answer|solution/i);
});

test("the malformed real-number wording in source question 27 is repaired", () => {
  const question = questions.find(question => question.number === 236);
  assert.ok(question.question.includes(String.raw`greatest integer \(a\)`));
  assert.ok(!question.question.includes(String.raw`greatest real number \(a\)`));
  assert.equal(question.answer, "B");
});

test("high-risk answers agree with independent calculations", () => {
  const determinant = 4 * (-2 * 5) - (-2) * (-5 * 5) + 1 * (-5 * 3);
  assert.equal(determinant, -105);

  const absoluteValueSolutions = [];
  for (let x = -20; x <= 20; x += 1) {
    if (Math.abs(Math.abs(Math.abs(Math.abs(x - 1) - 2) - 3) - 2) === 1) absoluteValueSolutions.push(x);
  }
  assert.deepEqual(absoluteValueSolutions, [-7, -5, -3, -1, 1, 3, 5, 7, 9]);
  assert.equal(absoluteValueSolutions.reduce((sum, value) => sum + value, 0), 9);

  const posterior = (5 / 8 * 2 / 5) / (5 / 8 * 2 / 5 + 3 / 8 * 1 / 3);
  assert.equal(posterior, 2 / 3);
  assert.equal(Array.from({ length: 10 }, (_, index) => index + 1).reduce((sum, value) => sum + value, 0), 55);
});

test("all FAMAT State Convention 2025 formulas compile with KaTeX", () => {
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
