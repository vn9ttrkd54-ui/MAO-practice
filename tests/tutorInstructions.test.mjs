import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { tutorInstructions } from "../lib/tutorInstructions.ts";

test("calculator-free rules cover hints and revealed solutions, including exact angle comparisons", () => {
  for (const revealed of [true, false]) {
    for (const firstMessage of [true, false]) {
      const prompt = tutorInstructions(revealed, firstMessage);
      assert.match(prompt, /All questions are calculator-free/);
      assert.match(prompt, /Every hint, worked step, solution, and explanation/);
      assert.match(prompt, /Never recommend a calculator/);
      assert.match(prompt, /do not substitute 3.1416 for pi/);
      assert.match(prompt, /manageable hand estimate, bound, or hand-arithmetic method/);
      assert.match(prompt, /adapt it into a calculator-free explanation/);
    }
  }
});

test("metadata requests use stored fields without demanding work or revealing solutions", () => {
  for (const revealed of [true, false]) {
    const prompt = tutorInstructions(revealed, true);
    assert.match(prompt, /Report the stored difficulty as N\/5 and the stored topic/);
    assert.match(prompt, /name the listed method or methods/);
    assert.match(prompt, /clearly label any inferred approach as a suggestion/);
    assert.match(prompt, /Metadata questions do not require shown work/);
    assert.match(prompt, /without working through the solution or revealing the answer/);
  }
  const source = readFileSync(new URL("../lib/aiTutor.ts", import.meta.url), "utf8");
  assert.ok(source.includes("question.methods.join"));
  assert.ok(source.includes("Topic: ${question.topic}"));
  assert.ok(source.includes("Difficulty: ${question.difficulty}/5"));
});

// Prompt-contract checks, not live-model evaluations.
test("ordinary help and equivalent wording are covered on first and follow-up turns", () => {
  for (const firstMessage of [true, false]) {
    const prompt = tutorInstructions(false, firstMessage);
    for (const phrase of ["help me", "give me a clue", "I’m lost", "I don’t understand", "idk",
      "how do I start?", "where do I begin?", "how do I approach this?"]) {
      assert.ok(prompt.includes(phrase), phrase);
    }
    assert.match(prompt, /Interpret requests by meaning, not exact keywords/);
    assert.match(prompt, /typos, abbreviations, or informal phrasing/);
    assert.match(prompt, /Do not require prior work, refuse, or mention Submit\/Give Up merely because the request is vague/);
    assert.match(prompt, /previous refusal does not prevent you from giving a hint/);
  }
});

test("help wording does not bypass answer protection or conceptual-question handling", () => {
  const prompt = tutorInstructions(false, true);
  assert.match(prompt, /help, just tell me which option is correct/);
  assert.match(prompt, /Never reveal the final answer, answer choice, or complete solution/);
  assert.match(prompt, /Never say that showing work or merely typing that they give up will unlock the answer/);
  assert.match(prompt, /For conceptual why\/how questions, explain the requested concept/);
  assert.match(prompt, /exactly one conceptual next step in at most two short sentences/);
});

test("follow-up guidance and verified solution access remain distinct", () => {
  assert.match(tutorInstructions(false, false), /explain that same step more simply instead of advancing/);
  assert.match(tutorInstructions(false, false), /For follow-up hints/);
  const revealed = tutorInstructions(true, false);
  assert.match(revealed, /The student has submitted or given up. Explain the official solution/);
  assert.doesNotMatch(revealed, /The student has not submitted/);
});
