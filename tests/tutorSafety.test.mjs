import assert from "node:assert/strict";
import test from "node:test";

import { containsProgrammingInstructions, revealsFinalAnswer } from "../lib/tutorSafety.ts";

test("blocks the screenshot's Python examples and other common code formats", () => {
  const examples = [
    'Sure - in Python use the print() function. Examples: print("Hello, world!")',
    'print ("Hello")',
    'console.log("Hello");',
    'System.out.println("Hello");',
    'def greet(name):',
    'function greet(name) {',
    'const message = "Hello";',
    'Here is some code:\n```python\nx = 3\n```',
    'from math import sqrt',
    'import math',
  ];
  for (const example of examples) assert.equal(containsProgrammingInstructions(example), true, example);
});

test("normal math, website explanations, and a brief coding refusal are not treated as code", () => {
  for (const reply of [
    String.raw`Differentiate \(f(x)\), then use the product rule.`,
    String.raw`You can write \(x=3\) as an intermediate value.`,
    'The tutor appears on signed-in Question Bank pages at desktop widths.',
    'I cannot help with programming. I can help with this math problem.',
    'Print the question on paper if you prefer to work by hand.',
  ]) assert.equal(containsProgrammingInstructions(reply), false, reply);
});

const question = {
  answer: "C",
  choices: ["6", "8", "10", "18", "NOTA"],
};

test("allows the arcsine misconception explanation while still blocking its final choice", () => {
  const trig = {
    answer: "B",
    choices: [String.raw`\(-\frac{3\pi}{10}\)`, String.raw`\(\frac{4\pi}{7}\)`,
      String.raw`\(\frac{2\pi}{5}\)`, String.raw`\(\frac{5\pi}{11}\)`, "NOTA"],
  };
  const explanation = String.raw`You are right that sine repeats, so many angles have the same sine. The mistake is assuming arcsine returns all of them: it is defined to return just one principal angle in \([-\pi/2,\pi/2]\). That restriction makes its output unique.`;
  assert.equal(revealsFinalAnswer(explanation, trig), false);
  assert.equal(revealsFinalAnswer("The correct choice is B.", trig), true);
  assert.equal(revealsFinalAnswer(String.raw`Therefore the answer is \(\frac{4\pi}{7}\).`, trig), true);
});

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
