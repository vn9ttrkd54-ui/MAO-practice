import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 60 && question.number <= 89);

test("February Regional 2026 retains 29 questions, excluding source throw-out 24 without reassigning IDs", () => {
  assert.equal(questions.length, 29);
  const retained = Array.from({ length: 30 }, (_, index) => index).filter(index=>index!==23);
  assert.deepEqual(questions.map(question => question.number), retained.map(index=>index+60));
  assert.deepEqual(questions.map(question => question.id), retained.map(index=>index+30060));
  assert.equal(questions.map(question => question.answer).join(""), [..."AECDBDAEBCCADEDBCADCBBEABDABBA"].filter((_,index)=>index!==23).join(""));
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("disputed source questions use corrected, unambiguous versions", () => {
  const probability = questions.find(question => question.number === 74);
  assert.deepEqual(probability.choices.slice(0, 4), [
    String.raw`\(\frac12\)`,
    String.raw`\(\frac35\)`,
    String.raw`\(\frac7{10}\)`,
    String.raw`\(\frac45\)`,
  ]);

  assert.equal(questions.some(question => question.id === 30083), false);

  for (const question of questions) {
    assert.doesNotMatch(question.question + "\n" + question.solution, /thrown out|disput|original answer choices|region 5/i);
  }
});

test("methods are solving techniques rather than duplicate topic labels", () => {
  const topicLabels = new Set(questions.map(question => question.topic));
  for (const question of questions) {
    for (const method of question.methods) {
      assert.ok(!topicLabels.has(method), `Theta \${question.number} uses topic "\${method}" as a method`);
    }
  }
});

test("all February Regional 2026 formulas compile with KaTeX", () => {
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
