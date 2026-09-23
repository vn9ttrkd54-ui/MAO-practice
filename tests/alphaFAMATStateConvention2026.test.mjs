import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";

import { alphaQuestions } from "../data/questions/alpha.ts";

const questions = alphaQuestions.filter(
  (question) => question.number >= 238 && question.number <= 267,
);

test("2026 FAMAT State Convention Alpha contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(
    questions.map((question) => question.number),
    Array.from({ length: 30 }, (_, index) => index + 238),
  );
  assert.deepEqual(
    questions.map((question) => question.id),
    Array.from({ length: 30 }, (_, index) => index + 20301),
  );
  assert.equal(
    questions.map((question) => question.answer).join(""),
    "ACABB" + "DABDC" + "DBCAB" + "DDCCA" + "CDCAB" + "CEBAD",
  );
  assert.ok(questions.every((question) => question.division === "Alpha"));
  assert.ok(questions.every((question) => question.choices.length === 5));
  assert.ok(questions.every((question) => Number.isInteger(question.difficulty)
    && question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(alphaQuestions.map((question) => question.id)).size, alphaQuestions.length);
});

test("the two incorrect printed answer labels are repaired", () => {
  const complexSquareRoot = questions.find((question) => question.id === 20315);
  assert.equal(complexSquareRoot?.answer, "B");
  assert.equal(complexSquareRoot?.choices[1], String.raw`\(-6\)`);
  assert.match(complexSquareRoot?.solution ?? "", /MR=.*-6/s);

  const conditionalDie = questions.find((question) => question.id === 20319);
  assert.equal(conditionalDie?.answer, "C");
  assert.equal(conditionalDie?.choices[2], String.raw`\(\frac{7}{15}\)`);
  assert.match(conditionalDie?.solution ?? "", /14.*30.*7.*15/s);
});

test("the imported set is self-contained and keeps important domain restrictions", () => {
  assert.ok(questions.every((question) => question.illustration === undefined));
  assert.match(questions.find((question) => question.id === 20310)?.question ?? "", /counted with multiplicity/);
  assert.match(questions.find((question) => question.id === 20324)?.solution ?? "", /outside the original domains/);
  assert.match(questions.find((question) => question.id === 20325)?.question ?? "", /for which it is defined/i);
  assert.match(questions.find((question) => question.id === 20327)?.solution ?? "", /not among choices A through D/);
  assert.doesNotMatch(
    questions.map((question) => question.question + question.solution).join("\n"),
    /disput|thrown out|withdrawn|appeal/i,
  );
});

test("high-risk Alpha answers agree with independent calculations", () => {
  const validK = Array.from({ length: 1000 }, (_, index) => index + 1)
    .filter((k) => Number.isInteger(k / 3) && k / 3 >= 100 && k / 3 <= 999 && 3 * k >= 100 && 3 * k <= 999);
  assert.equal(validK.length, 12);

  const domainIntegers = Array.from({ length: 10 }, (_, index) => index + 1)
    .filter((x) => x > 1 && (Math.log(x - 1) / Math.log(3) <= 0 || Math.log(x - 1) / Math.log(3) > 1));
  assert.equal(domainIntegers.reduce((sum, value) => sum + value, 0), 47);

  let distinctMultiplesOfFive = 0;
  for (let value = 1000; value <= 9999; value += 1) {
    const digits = [...String(value)].map(Number);
    if (value % 5 === 0 && new Set(digits).size === 4 && Math.max(...digits) === 5) {
      distinctMultiplesOfFive += 1;
    }
  }
  assert.equal(distinctMultiplesOfFive, 84);

  const roots = [[3, -2], [-3, 2]];
  for (const [real, imaginary] of roots) {
    assert.equal(real ** 2 - imaginary ** 2, 5);
    assert.equal(2 * real * imaginary, -12);
    assert.equal(real * imaginary, -6);
  }

  const validDieTriples = [];
  for (let first = 1; first <= 6; first += 1) {
    for (let second = 1; second <= 6; second += 1) {
      for (let third = 1; third <= 6; third += 1) {
        if (Math.abs(first - second) === third) validDieTriples.push([first, second, third]);
      }
    }
  }
  assert.equal(validDieTriples.length, 30);
  assert.equal(validDieTriples.filter((rolls) => rolls.includes(3)).length, 14);

  const polygon = [
    [3 * Math.sqrt(3), 17],
    [3 * Math.sqrt(3), 0],
    [0, 0],
    [-2 * Math.sqrt(3), 2],
  ];
  const twiceArea = Math.abs(polygon.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = polygon[(index + 1) % polygon.length];
    return sum + x * nextY - y * nextX;
  }, 0));
  assert.ok(Math.abs(twiceArea / 2 - 91 * Math.sqrt(3) / 2) < 1e-10);

  const matrix = [[3, 2, 4], [0, 5, 1], [-2, 5, -3]];
  const determinant = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1])
    - matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0])
    + matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
  assert.equal(determinant, -24);
  assert.equal(10 / determinant, -5 / 12);

  const topRow = [];
  for (let start = 1; start <= 102; start += 6) {
    topRow.push(start, start + 5);
  }
  assert.equal(topRow.reduce((sum, value) => sum + value, 0), 1751);
});

test("answer annotations match the stored answer letters", () => {
  for (const question of questions) {
    const annotation = [...question.solution.matchAll(/\\boxed\{\\text\{([A-E])\}\}/g)].at(-1);
    assert.equal(annotation?.[1], question.answer, `Alpha ${question.number}`);
  }
});

test("all 2026 Alpha formulas are explicitly delimited and compile with KaTeX", () => {
  const delimiterPattern = /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g;

  for (const question of questions) {
    for (const value of [question.question, ...question.choices, question.solution]) {
      const matches = [...value.matchAll(delimiterPattern)];
      const outsideMath = value.replace(delimiterPattern, "");
      assert.doesNotMatch(outsideMath, /\\[A-Za-z]+/, `Alpha ${question.number} has undelimited LaTeX`);

      for (const match of matches) {
        assert.doesNotThrow(
          () => katex.renderToString(match[1] ?? match[2], {
            throwOnError: true,
            displayMode: match[2] !== undefined,
          }),
          `Alpha ${question.number} contains invalid LaTeX`,
        );
      }
    }
  }
});
