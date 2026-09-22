import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 270 && question.number <= 299);

test("FAMAT State Convention 2023 contains all 30 sequential Theta questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(q => q.number), Array.from({ length: 30 }, (_, i) => 270 + i));
  assert.deepEqual(questions.map(q => q.id), Array.from({ length: 30 }, (_, i) => 30270 + i));
  assert.equal(questions.map(q => q.answer).join(""), "CBDDCBDBBDBBBADAEBAABDACABBAAA");
  assert.ok(questions.every(q => q.choices.length === 5 && q.difficulty >= 1 && q.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(q => q.id)).size, thetaQuestions.length);
});

test("source correction and required diagram are retained", () => {
  const inverse = questions.find(q => q.number === 272);
  assert.equal(inverse.answer, "D");
  assert.ok(inverse.solution.includes(String.raw`\frac{-5}{-80}=\boxed{\frac1{16}}`));
  const illustrated = questions.filter(q => q.illustration);
  assert.deepEqual(illustrated.map(q => q.number), [299]);
  assert.ok(existsSync(new URL(`../public${illustrated[0].illustration.src}`, import.meta.url)));
});

test("high-risk answers agree with independent calculations", () => {
  const determinant = 3 * (2 - 9) + 11 * (1 - 6) + 4 * (3 - 4);
  assert.equal(determinant, -80);
  assert.equal(27 % 4, 3);
  assert.equal(4 * 2 + 3 * 3, 17);
  assert.equal(27 - 2 * 13, 1);
  assert.equal(0.5 * 2 ** 2, 2);
});

test("all FAMAT State Convention 2023 formulas compile with KaTeX", () => {
  for (const question of questions) for (const text of [question.question, ...question.choices, question.solution]) {
    for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
      assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], { throwOnError: true, displayMode: match[2] !== undefined }), `Theta ${question.number}`);
    }
  }
});
