import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import katex from "katex";

import { challengeQuestions } from "../data/challengeQuestions.ts";

const scheduledIds = Array.from({ length: 15 }, (_, index) => `CH-${String(index + 7).padStart(4, "0")}`);

test("new Challenge questions are difficult, LaTeX-formatted, and complete", () => {
  const questions = challengeQuestions.filter((question) => scheduledIds.includes(question.id));
  assert.equal(questions.length, 15);
  assert.deepEqual(
    Object.fromEntries(["Mu", "Alpha", "Theta"].map((division) => [division, questions.filter((question) => question.division === division).length])),
    { Mu: 5, Alpha: 5, Theta: 5 },
  );

  for (const question of questions) {
    assert.deepEqual(Object.keys(question.choices), ["A", "B", "C", "D", "E"]);
    assert.equal(new Set(Object.values(question.choices)).size, 5, `${question.id} has duplicate choices`);
    assert.ok(question.choices[question.answer], `${question.id} is missing its correct choice`);
    assert.ok(question.difficulty >= 4, `${question.id} is below the intended difficulty`);
    assert.match(question.question, /\\\(|\\\[/, `${question.id} question is missing LaTeX delimiters`);
    for (const choice of Object.values(question.choices)) {
      assert.match(choice, /\\\(|\\\[/, `${question.id} has a choice without LaTeX delimiters`);
    }
    assert.match(question.solution, /\\\[/, `${question.id} solution is missing display math`);
    assert.ok(question.solution.length >= 60, `${question.id} needs a detailed solution`);
  }
});

test("new Challenge questions match each division's subject level", () => {
  const topicsByDivision = {
    Mu: ["Limits", "Optimization", "Differential Equations", "Improper Integrals", "Derivatives"],
    Alpha: ["Trigonometry", "Polynomials", "Complex Numbers", "Trigonometric Equations", "Logarithms"],
    Theta: ["Functions", "Number Theory", "Counting", "Polynomials", "Combinatorics"],
  };

  for (const [division, topics] of Object.entries(topicsByDivision)) {
    const actualTopics = challengeQuestions
      .filter((question) => scheduledIds.includes(question.id) && question.division === division)
      .map((question) => question.topic);
    assert.deepEqual(actualTopics, topics);
  }
});

test("all new Challenge math compiles with KaTeX", () => {
  const questions = challengeQuestions.filter((question) => scheduledIds.includes(question.id));

  for (const question of questions) {
    const fields = [question.question, ...Object.values(question.choices), question.solution];
    for (const field of fields) {
      for (const match of field.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(
          () => katex.renderToString(match[1] ?? match[2], {
            throwOnError: true,
            displayMode: match[2] !== undefined,
          }),
          `${question.id} contains invalid LaTeX`,
        );
      }
    }
  }
});

test("five-day Supabase schedule matches each question division", async () => {
  const sql = await readFile(new URL("../supabase/migrations/048_daily_challenges_2026_09_23_to_27.sql", import.meta.url), "utf8");
  const rows = [...sql.matchAll(/\('(\d{4}-\d{2}-\d{2})', '(Mu|Alpha|Theta)', '(CH-\d{4})'\)/g)]
    .map((match) => ({ date: match[1], division: match[2], questionId: match[3] }));
  assert.equal(rows.length, 15);
  assert.equal(new Set(rows.map((row) => row.questionId)).size, 15);

  const questionById = new Map(challengeQuestions.map((question) => [question.id, question]));
  for (const row of rows) assert.equal(questionById.get(row.questionId)?.division, row.division);
  for (const date of ["2026-09-23", "2026-09-24", "2026-09-25", "2026-09-26", "2026-09-27"]) {
    assert.deepEqual(rows.filter((row) => row.date === date).map((row) => row.division), ["Mu", "Alpha", "Theta"]);
  }
});
