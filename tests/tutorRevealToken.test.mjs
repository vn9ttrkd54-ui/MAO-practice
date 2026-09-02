import assert from "node:assert/strict";
import test from "node:test";

process.env.TUTOR_REVEAL_SECRET = "test-only-secret";

const { createTutorRevealToken, verifyTutorRevealToken } = await import("../lib/tutorRevealToken.ts");

test("accepts a current token for the matching user and question", () => {
  const token = createTutorRevealToken("user-1", 10030, 1_000);
  assert.equal(verifyTutorRevealToken(token, "user-1", 10030, 2_000), true);
});

test("rejects a token for another question or user", () => {
  const token = createTutorRevealToken("user-1", 10030, 1_000);
  assert.equal(verifyTutorRevealToken(token, "user-1", 10031, 2_000), false);
  assert.equal(verifyTutorRevealToken(token, "user-2", 10030, 2_000), false);
});

test("rejects an expired token", () => {
  const token = createTutorRevealToken("user-1", 10030, 1_000);
  assert.equal(verifyTutorRevealToken(token, "user-1", 10030, 4 * 60 * 60 * 1_000 + 1_001), false);
});
