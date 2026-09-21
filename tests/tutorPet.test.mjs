import test from "node:test";
import assert from "node:assert/strict";
import { tutorPetState } from "../lib/tutorPet.ts";

const idle = { loading: false, remaining: null, errorCode: null, hasError: false, hasAnswer: false };
test("pet starts idle and celebrates an answer", () => {
  assert.equal(tutorPetState(idle), "idle");
  assert.equal(tutorPetState({ ...idle, hasAnswer: true }), "ready");
});
test("pending final request keeps the thinking bubble until completed", () => {
  assert.equal(tutorPetState({ ...idle, remaining: 0, loading: true }), "thinking");
});
test("zero remaining rests even when the final answer succeeded", () => {
  assert.equal(tutorPetState({ ...idle, remaining: 0, hasAnswer: true }), "sleeping");
});
test("both server limits rest, but ordinary failures do not", () => {
  for (const errorCode of ["daily_limit", "pool_exhausted"]) {
    assert.equal(tutorPetState({ ...idle, errorCode, hasError: true }), "sleeping");
  }
  assert.equal(tutorPetState({ ...idle, errorCode: "unavailable", hasError: true }), "error");
});
