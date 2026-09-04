import assert from "node:assert/strict";
import test from "node:test";

import {
  applyAdaptiveTrainerResult,
  createAdaptiveTrainerState,
  isTrainerChallengeQuestion,
} from "../lib/trainerAdaptive.ts";

test("moves up after two correct answers at difficulties one and two", () => {
  let state = createAdaptiveTrainerState(2);
  state = applyAdaptiveTrainerResult(state, "correct", false);
  state = applyAdaptiveTrainerResult(state, "correct", false);
  assert.deepEqual(state, createAdaptiveTrainerState(3));
});

test("moves up after three correct answers at difficulties three and four", () => {
  let state = createAdaptiveTrainerState(4);
  state = applyAdaptiveTrainerResult(state, "correct", false);
  state = applyAdaptiveTrainerResult(state, "correct", false);
  state = applyAdaptiveTrainerResult(state, "correct", false);
  assert.deepEqual(state, createAdaptiveTrainerState(5));
});

test("moves down after the configured incorrect streak", () => {
  let state = createAdaptiveTrainerState(5);
  state = applyAdaptiveTrainerResult(state, "incorrect", false);
  state = applyAdaptiveTrainerResult(state, "give-up", false);
  assert.deepEqual(state, createAdaptiveTrainerState(4));

  state = createAdaptiveTrainerState(3);
  state = applyAdaptiveTrainerResult(state, "incorrect", false);
  state = applyAdaptiveTrainerResult(state, "incorrect", false);
  state = applyAdaptiveTrainerResult(state, "incorrect", false);
  assert.deepEqual(state, createAdaptiveTrainerState(2));
});

test("challenge misses preserve streaks and challenge successes count", () => {
  let state = { difficulty: 2, correctStreak: 1, incorrectStreak: 0 };
  assert.deepEqual(applyAdaptiveTrainerResult(state, "incorrect", true), state);
  assert.deepEqual(applyAdaptiveTrainerResult(state, "give-up", true), state);
  state = applyAdaptiveTrainerResult(state, "correct", true);
  assert.deepEqual(state, createAdaptiveTrainerState(3));
});

test("uses every tenth question as a challenge", () => {
  assert.equal(isTrainerChallengeQuestion(9), false);
  assert.equal(isTrainerChallengeQuestion(10), true);
  assert.equal(isTrainerChallengeQuestion(20), true);
});
