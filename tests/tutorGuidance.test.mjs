import assert from "node:assert/strict";
import test from "node:test";

import { formatTutorGuidance, getTutorGuidance } from "../lib/tutorGuidance.ts";

test("returns curriculum guidance for the five evaluation questions", () => {
  for (const questionId of [10008, 10014, 10021, 10023, 10030]) {
    assert.ok(getTutorGuidance(questionId));
  }
});

test("returns no guidance for questions not yet curated", () => {
  assert.equal(getTutorGuidance(10001), null);
});

test("formats the intended first hint and ordered progression", () => {
  const guidance = getTutorGuidance(10023);
  assert.ok(guidance);

  const formatted = formatTutorGuidance(guidance);
  assert.match(formatted, /Intended first hint:/);
  assert.match(formatted, /1\. Transform the inequality/);
  assert.match(formatted, /Common mistakes to watch for:/);
});

test("includes response-specific teaching notes when supplied", () => {
  const guidance = getTutorGuidance(10014);
  assert.ok(guidance);

  assert.match(formatTutorGuidance(guidance), /fourth derivative/);
});
