import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { CHALLENGE_TIME_ZONE, getChallengeDate } from "../lib/challengeDate.ts";

export const midnightCases = [
  ["2026-01-15T04:59:59.999Z", "2026-01-14"],
  ["2026-01-15T05:00:00.000Z", "2026-01-15"],
  ["2026-07-15T03:59:59.999Z", "2026-07-14"],
  ["2026-07-15T04:00:00.000Z", "2026-07-15"],
  ["2026-03-08T04:59:59.999Z", "2026-03-07"],
  ["2026-03-08T05:00:00.000Z", "2026-03-08"],
  ["2026-03-08T06:59:59.999Z", "2026-03-08"],
  ["2026-03-08T07:00:00.000Z", "2026-03-08"],
  ["2026-03-09T03:59:59.999Z", "2026-03-08"],
  ["2026-03-09T04:00:00.000Z", "2026-03-09"],
  ["2026-11-01T03:59:59.999Z", "2026-10-31"],
  ["2026-11-01T04:00:00.000Z", "2026-11-01"],
  ["2026-11-01T05:30:00.000Z", "2026-11-01"],
  ["2026-11-01T06:30:00.000Z", "2026-11-01"],
  ["2026-11-02T04:59:59.999Z", "2026-11-01"],
  ["2026-11-02T05:00:00.000Z", "2026-11-02"],
  ["2027-01-01T04:59:59.999Z", "2026-12-31"],
  ["2027-01-01T05:00:00.000Z", "2027-01-01"],
];

test("daily challenge timezone is New York, with no fixed UTC offset", () => {
  assert.equal(CHALLENGE_TIME_ZONE, "America/New_York");
  for (const [instant, expected] of midnightCases) {
    assert.equal(getChallengeDate(new Date(instant)), expected, instant);
  }
});

test("challenge dates do not depend on the server or visitor timezone", () => {
  const url = new URL("../lib/challengeDate.ts", import.meta.url).href;
  const script = `import { getChallengeDate } from ${JSON.stringify(url)};
    console.log(getChallengeDate(new Date('2026-10-22T02:00:00Z')));`;
  for (const TZ of ["UTC", "America/Los_Angeles", "Asia/Tokyo"]) {
    assert.equal(execFileSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", script], {
      env: { ...process.env, TZ }, encoding: "utf8",
    }).trim(), "2026-10-21");
  }
});

test("invalid instants fail instead of producing a malformed assignment date", () => {
  assert.throws(() => getChallengeDate(new Date(NaN)), RangeError);
});
