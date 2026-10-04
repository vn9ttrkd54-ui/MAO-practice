import assert from "node:assert/strict";
import test from "node:test";
import { countdownSeconds, FIRST_QUESTION_READY_MS, FIRST_QUESTION_PREPARATION_MS, MultiplayerClock, questionDisplayDeadline } from "../lib/multiplayerTiming.ts";

test("preparation and announcement time do not inflate or consume the countdown", () => {
  assert.equal(countdownSeconds(0, 1000, 1), null);
  assert.equal(countdownSeconds(13000, 1000, 1), null);
  assert.equal(countdownSeconds(8000, 3000, 1), 5);
  assert.equal(countdownSeconds(8000, 2000, 1), null);
  assert.equal(countdownSeconds(8000, 1000, 2), null);
  assert.equal(countdownSeconds(8000, 3000, 2), 5);
  assert.equal(countdownSeconds(8000, 8000, 2), 0);
});

test("first question has three-second preparation and five-second countdown", () => {
  assert.equal(FIRST_QUESTION_READY_MS, 5_000);
  assert.equal(FIRST_QUESTION_PREPARATION_MS, 3_000);
});

test("late delivery cannot extend the scheduled visible deadline", () => {
  const round = { questionStartedAt: 100_000, questionEndsAt: 165_000, questionDurationSeconds: 60 };
  assert.equal(questionDisplayDeadline(round), 160_000);
  assert.equal(questionDisplayDeadline({ ...round, deliveredAt: 120_000, personalEndsAt: 165_000 }), 160_000);
  assert.equal(questionDisplayDeadline({ ...round, questionEndsAt: 150_000 }), 150_000);
});

test("clock correction excludes server processing time", () => {
  const clock = new MultiplayerClock(500_000, 0);
  // 1000ms round trip: 800ms server work, estimated 100ms each direction.
  assert.equal(clock.synchronize(0, 1000, 100_100, 100_900), true);
  assert.equal(clock.now(1000), 101_000);
  assert.equal(clock.now(2000), 102_000);
});

test("slower samples cannot replace a better clock estimate", () => {
  const clock = new MultiplayerClock(500_000, 0);
  clock.synchronize(0, 100, 100_040, 100_060);
  const before = clock.now(1100);
  assert.equal(clock.synchronize(100, 1100, 999_000, 999_100), false);
  assert.equal(clock.now(1100), before);
  assert.equal(clock.synchronize(2000, 2100, 102_040, 102_060), false);
});

test("invalid samples are ignored and elapsed time uses the monotonic clock", () => {
  const clock = new MultiplayerClock(100_000, 10);
  assert.equal(clock.synchronize(10, 20, undefined, undefined), false);
  assert.equal(clock.now(60_010), 160_000);
});
