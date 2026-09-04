import assert from "node:assert/strict";
import test from "node:test";

import { calculateMultiplayerCorrectPoints } from "../lib/multiplayerScoring.ts";

test("later correct submissions receive fewer points inside the delivery allowance", () => {
  const first = calculateMultiplayerCorrectPoints({
    answerTimeMs: 0,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 0,
  });
  const second = calculateMultiplayerCorrectPoints({
    answerTimeMs: 0,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 1,
  });

  assert.equal(first, 1500);
  assert.equal(second, 1499);
});

test("elapsed solving time and answer order both lower the score", () => {
  const early = calculateMultiplayerCorrectPoints({
    answerTimeMs: 3_000,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 0,
  });
  const later = calculateMultiplayerCorrectPoints({
    answerTimeMs: 5_000,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 1,
  });

  assert.ok(early > later);
  assert.ok(later >= 1000);
});

test("the score remains within the database range for a full room", () => {
  assert.equal(calculateMultiplayerCorrectPoints({
    answerTimeMs: 60_000,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 29,
  }), 1001);
});
