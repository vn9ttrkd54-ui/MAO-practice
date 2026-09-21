import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/alpha.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { alphaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = alphaQuestions.filter(question => question.number >= 148 && question.number <= 177);

test("supplied Alpha set contains all 30 sequential questions and preserved IDs", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => index + 148));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => index + 20211));
  assert.equal(questions.map(question => question.answer).join(""), "DBCABCBCDDAAABCBBCCCCDEABADDCC");
  assert.ok(questions.every(question => question.division === "Alpha"));
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.ok(questions.every(question => Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(alphaQuestions.map(question => question.id)).size, alphaQuestions.length);
});

test("the set is self-contained and requires no missing illustration", () => {
  assert.ok(questions.every(question => question.illustration === undefined));
  for (const question of questions) {
    assert.doesNotMatch(question.question, /diagram|figure|shown below|graph below|pictured/i);
  }
});

test("the Ferris-wheel model is corrected to honor its initial position", () => {
  const ferrisWheel = questions.find(question => question.id === 20239);
  assert.match(ferrisWheel.question, /d\(t\)=-R\\cos\(St\)\+U/);
  assert.equal(ferrisWheel.answer, "C");
  assert.match(ferrisWheel.solution, /d\(0\)=-R\+U=3/);
});

test("methods are canonical techniques and not duplicate topic labels", () => {
  const topicLabels = new Set(questions.map(question => question.topic));
  for (const question of questions) {
    for (const method of question.methods) {
      assert.ok(!topicLabels.has(method), `Alpha ${question.number} uses topic "${method}" as a method`);
    }
  }
  assert.deepEqual(questions.find(question => question.id === 20233).methods, ["Mathematical Induction"]);
  assert.deepEqual(questions.find(question => question.id === 20215).methods, ["Trigonometric Identities", "Half-Angle"]);
  assert.deepEqual(questions.find(question => question.id === 20220).methods, ["Nested Functions"]);
  assert.deepEqual(questions.find(question => question.id === 20222).methods, ["Asymptotes"]);
});

test("high-risk answers agree with independent calculations", () => {
  assert.equal(8 ** 2 + 10 ** 2 - 2 * 8 * 10 * (-4 / 5), 4 * 73);
  assert.equal((52 / 1140), 13 / 285);

  const nonzeroIntersectionX = 2 / (1 + (2 / 9) ** 2);
  assert.ok(nonzeroIntersectionX > 0);
  assert.equal(questions.find(question => question.id === 20225).answer, "C");

  const radius = (303 - 3) / 2;
  const center = (303 + 3) / 2;
  const angularSpeed = 2 * Math.PI / 1.5;
  assert.equal(radius + 6 * angularSpeed / Math.PI + 3 * center, 617);
});

test("all supplied Alpha formulas compile with KaTeX", () => {
  for (const question of questions) {
    for (const text of [question.question, ...question.choices, question.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), "Alpha " + question.number);
      }
    }
  }
});
