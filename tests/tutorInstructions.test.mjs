import assert from "node:assert/strict";
import test from "node:test";
import { tutorInstructions } from "../lib/tutorInstructions.ts";

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
