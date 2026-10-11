import assert from "node:assert/strict";
import test from "node:test";

import { calculateMultiplayerCorrectPoints, calculateMultiplayerWrongPoints } from "../lib/multiplayerScoring.ts";
import { muQuestions } from "../data/questions/mu.ts";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { thetaQuestions } from "../data/questions/theta.ts";

test("version 2 keeps its 1000 base and 500 speed bonus with no answer-order penalty", () => {
  for (const duration of [30_000, 90_000, 180_000]) {
    for (const [elapsed, expected] of [[0, 1500], [duration / 2, 1250], [duration, 1000], [duration + 5000, 1000]]) {
      for (const earlierCorrectAnswers of [0, 1, 29]) {
        assert.equal(calculateMultiplayerCorrectPoints({ answerTimeMs: elapsed, questionDurationMs: duration, earlierCorrectAnswers, scoringVersion: 2 }), expected);
      }
    }
  }
});

test("all multiplayer catalog questions have five choices and exactly one answer label", () => {
  for (const question of [...muQuestions, ...alphaQuestions, ...thetaQuestions]) {
    assert.equal(question.choices.length, 5, `Question ${question.id} must have five choices for the guessing penalty`);
    assert.ok(["A", "B", "C", "D", "E"].includes(question.answer));
  }
});

test("version 3 uses a 750 base, up to 750 speed bonus and a fixed 300 penalty at all supported timers", () => {
  for (const seconds of [30, 60, 90, 120, 150, 180]) {
    const duration = seconds * 1000;
    for (let elapsed = 0; elapsed <= duration + 5000; elapsed += 37) {
      const input = { answerTimeMs: elapsed, questionDurationMs: duration };
      const correct = calculateMultiplayerCorrectPoints(input);
      const wrong = calculateMultiplayerWrongPoints(input);
      assert.equal(correct, 750 + Math.round(750 * Math.max(0, duration - elapsed) / duration));
      assert.ok(correct >= 750 && correct <= 1500);
      assert.equal(wrong, -300);
      assert.ok(Number.isInteger(correct) && Number.isInteger(wrong));
      const guessingExpectation = (correct + 4 * wrong) / 5;
      assert.ok(guessingExpectation >= -90 && guessingExpectation <= 60);
    }
    const initial = { answerTimeMs: 0, questionDurationMs: duration };
    assert.equal((calculateMultiplayerCorrectPoints(initial) + 4 * calculateMultiplayerWrongPoints(initial)) / 5, 60);
    assert.equal(calculateMultiplayerCorrectPoints({ ...initial, answerTimeMs: duration / 2 }), 1125);
  }
});

test("a one-second correct lead earns the rounded share of the 750-point speed bonus", () => {
  for (const seconds of [30, 60, 90, 120, 150, 180]) {
    const duration = seconds * 1000;
    for (let elapsed = 0; elapsed <= duration - 1000; elapsed += 37) {
      const early = calculateMultiplayerCorrectPoints({ answerTimeMs: elapsed, questionDurationMs: duration });
      const later = calculateMultiplayerCorrectPoints({ answerTimeMs: elapsed + 1000, questionDurationMs: duration });
      assert.ok([Math.floor(750 / seconds), Math.ceil(750 / seconds)].includes(early - later));
    }
  }
  assert.equal(calculateMultiplayerCorrectPoints({ answerTimeMs: 49_000, questionDurationMs: 90_000 }), 1092);
  assert.equal(calculateMultiplayerCorrectPoints({ answerTimeMs: 50_000, questionDurationMs: 90_000 }), 1083);
});

test("version 3 ignores answer order, clamps timing, and has no post-deadline speed bonus", () => {
  for (const earlierCorrectAnswers of [0, 1, 29]) {
    const base = { questionDurationMs: 90_000, earlierCorrectAnswers };
    for (const [elapsed, correct, wrong] of [[-1000,1500,-300], [10_000,1417,-300], [11_000,1408,-300],
      [45_000,1125,-300], [90_000,750,-300], [95_000,750,-300]]) {
      assert.equal(calculateMultiplayerCorrectPoints({ ...base, answerTimeMs: elapsed }), correct);
      assert.equal(calculateMultiplayerWrongPoints({ ...base, answerTimeMs: elapsed }), wrong);
    }
  }
  assert.equal(calculateMultiplayerWrongPoints({ answerTimeMs: 0, questionDurationMs: 180_000 }), -300);
});

test("speed bonus rounds positive half points consistently with PostgreSQL", () => {
  assert.equal(calculateMultiplayerCorrectPoints({ answerTimeMs: 1_000, questionDurationMs: 60_000 }), 1488);
  assert.equal(calculateMultiplayerCorrectPoints({ answerTimeMs: 59_000, questionDurationMs: 60_000 }), 763);
});

test("legacy wrong-answer penalties are unchanged", () => {
  for (const answerTimeMs of [0, 45_000, 95_000]) {
    const base = { answerTimeMs, questionDurationMs: 90_000 };
    assert.equal(calculateMultiplayerWrongPoints({ ...base, scoringVersion: 1 }), 0);
    assert.equal(calculateMultiplayerWrongPoints({ ...base, scoringVersion: 2 }), -300);
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
