import assert from "node:assert/strict";
import test from "node:test";

import { calculateMultiplayerCorrectPoints } from "../lib/multiplayerScoring.ts";

test("new scoring has a 1000 base and 500 speed bonus with no answer-order penalty", () => {
  for (const duration of [30_000, 90_000, 180_000]) {
    for (const [elapsed, expected] of [[0, 1500], [duration / 2, 1250], [duration, 1000], [duration + 5000, 1000]]) {
      for (const earlierCorrectAnswers of [0, 1, 29]) {
        assert.equal(calculateMultiplayerCorrectPoints({ answerTimeMs: elapsed, questionDurationMs: duration, earlierCorrectAnswers }), expected);
      }
    }
  }
});

test("later correct submissions receive fewer points inside the delivery allowance", () => {
  const first = calculateMultiplayerCorrectPoints({
    answerTimeMs: 0,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 0,
    scoringVersion: 1,
  });
  const second = calculateMultiplayerCorrectPoints({
    answerTimeMs: 0,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 1,
    scoringVersion: 1,
  });

  assert.equal(first, 1500);
  assert.equal(second, 1499);
});

test("elapsed solving time and answer order both lower the score", () => {
  const early = calculateMultiplayerCorrectPoints({
    answerTimeMs: 3_000,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 0,
    scoringVersion: 1,
  });
  const later = calculateMultiplayerCorrectPoints({
    answerTimeMs: 5_000,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 1,
    scoringVersion: 1,
  });

  assert.ok(early > later);
  assert.ok(later >= 1000);
});

test("the score remains within the database range for a full room", () => {
  assert.equal(calculateMultiplayerCorrectPoints({
    answerTimeMs: 60_000,
    questionDurationMs: 60_000,
    earlierCorrectAnswers: 29,
    scoringVersion: 1,
}), 1001);
});
