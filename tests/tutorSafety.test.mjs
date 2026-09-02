import assert from "node:assert/strict";
import test from "node:test";

import { revealsFinalAnswer } from "../lib/tutorSafety.ts";

const question = {
  answer: "C",
  choices: ["6", "8", "10", "18", "NOTA"],
};

test("blocks the observed numeric answer leak", () => {
  const response = String.raw`You found \(x=-1\) and \(x=3\). Thus the answer is \(\boxed{10}\).`;
  assert.equal(revealsFinalAnswer(response, question), true);
});

test("allows a progressive hint without the final result", () => {
  const response = String.raw`Differentiate twice, solve \(f''(x)=0\), and check which candidates change concavity.`;
  assert.equal(revealsFinalAnswer(response, question), false);
});

test("blocks an explicit answer-choice leak", () => {
  assert.equal(revealsFinalAnswer("The correct choice is C.", question), true);
});

test("blocks answers wrapped in nested LaTeX presentation commands", () => {
  const response = String.raw`Thus the sum is \(\boxed{\text{10}}\), choice \(\mathrm{C}\).`;
  assert.equal(revealsFinalAnswer(response, question), true);
});

test("does not block a number used only as an intermediate value", () => {
  const response = "Use the given 10 as an intermediate value, then apply the requested operation yourself.";
  assert.equal(revealsFinalAnswer(response, question), false);
});
