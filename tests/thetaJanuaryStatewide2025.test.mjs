import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const questions = thetaQuestions.filter(question => question.number >= 31 && question.number <= 59);

test("January Statewide Algebra 2 contains 29 usable questions", () => {
  assert.equal(questions.length, 29);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 29 }, (_, index) => index + 31));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 29 }, (_, index) => index + 30031));
  assert.equal(questions.map(question => question.answer).join(""), "BBCDACBBAEBDDCEBCDCABECBCBABD");
  assert.ok(questions.every(question => question.choices.length === 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
});

test("thrown-out source question 3 is excluded and corrected explanations remain", () => {
  assert.doesNotMatch(questions.map(question => question.question).join("\n"), /minor axis is twice/i);
  assert.match(questions.find(question => question.number === 33).solution, /linear/);
  assert.match(questions.find(question => question.number === 45).solution, /no minimum/);
  assert.match(questions.find(question => question.number === 56).solution, /hole at/);
  for (const question of questions) {
    assert.doesNotMatch(question.question + "\n" + question.solution, /thrown out|disput|original version/i);
  }
});

test("all January Statewide Algebra 2 formulas compile with KaTeX", () => {
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
