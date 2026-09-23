import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { challengeQuestions } from "../data/challengeQuestions.ts";

const scheduledIds = Array.from({ length: 15 }, (_, index) => `CH-${String(index + 7).padStart(4, "0")}`);

test("new Challenge questions have complete and unique answer sets", () => {
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
    assert.ok(question.solution.length >= 60, `${question.id} needs a detailed solution`);
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
