import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const policy = readFileSync(new URL("../app/privacy/page.tsx", import.meta.url), "utf8");

test("guest disclosure covers room data, visibility, and other technical processing", () => {
  assert.match(policy, /<h2>Guest multiplayer<\/h2>/);
  assert.match(policy, /guest nickname, room participation, answers, correctness, answer times, scores, placement, and connection status/);
  assert.match(policy, /can be shown to other players in that room/);
  assert.match(policy, /nickname that does not contain your real name/);
  assert.match(policy, /Website analytics and technical processing.*also apply when you play as a guest/);
});

test("guest retention distinguishes cookie expiry, room cleanup, and provider copies", () => {
  assert.match(policy, /room-specific reconnect token/);
  assert.match(policy, /HTTP-only cookie that expires after 24 hours/);
  assert.match(policy, /database stores a hash of the token/);
  assert.match(policy, /Guest records are not copied into account match history/);
  assert.match(policy, /removes its guest-player records, reconnect-token hashes, answer submissions, and room results/);
  assert.match(policy, /all remaining players acknowledge receipt/);
  assert.match(policy, /scheduled to run every minute/);
  assert.match(policy, /two minutes after the results are finalized/);
  assert.match(policy, /one hour after room creation.*past 10 minutes/);
  assert.match(policy, /two hours after a match starts.*two hours after completion/);
  assert.match(policy, /one hour after the room&apos;s last update/);
  assert.match(policy, /eligibility thresholds, not guaranteed deletion deadlines/);
  assert.match(policy, /does not immediately erase copies in restricted backups or provider security and diagnostic logs/);
});

test("guest disclosure preserves the existing 13-plus terms without a younger exception", () => {
  const terms = readFileSync(new URL("../app/terms/page.tsx", import.meta.url), "utf8");
  assert.match(terms, /By creating an account or using Mathematics Daily/);
  assert.match(terms, /You must be at least 13 years old/);
  assert.match(policy, /The same eligibility requirements.*apply to guest players/);
  assert.match(policy, /age 13 or older, including guest players/);
  assert.match(policy, /do not offer a parental-consent process/);
  assert.doesNotMatch(policy, /(?:under 13|under-13).*may (?:join|play)|guests of all ages/i);
});
