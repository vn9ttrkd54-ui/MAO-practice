import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { analyticsUrl } from "../lib/analyticsPrivacy.ts";

test("analytics removes URL parameters, fragments and room identities", () => {
  assert.equal(analyticsUrl("https://example.com/challenge?division=Mu#private"), "https://example.com/challenge");
  assert.equal(analyticsUrl("https://example.com/multiplayer/room/secret-room/results?code=secret"), "https://example.com/multiplayer/room/[id]/results");
});
test("sensitive pages and invalid URLs are excluded", () => {
  for (const path of ["admin", "admin/users/private-id", "account", "auth/confirm", "reset-password", "api/account"]) {
    assert.equal(analyticsUrl(`https://example.com/${path}?token=secret`), null);
  }
  assert.equal(analyticsUrl("invalid"), null);
  assert.equal(analyticsUrl("https://example.com/login"), "https://example.com/login");
});

test("privacy policy discloses analytics separately from essential storage", () => {
  const policy = readFileSync(new URL("../app/privacy/page.tsx", import.meta.url), "utf8");
  assert.match(policy, /<h2>Website analytics<\/h2>/);
  assert.match(policy, /Vercel Web Analytics/);
  assert.match(policy, /aggregated usage statistics/);
  assert.match(policy, /does not use third-party cookies/);
  assert.match(policy, /visitor identifier.*discards after 24 hours/);
  assert.match(policy, /does not mean all aggregated analytics statistics are deleted after 24 hours/);
  assert.match(policy, /remove query strings and fragments/);
  assert.match(policy, /replace multiplayer room identifiers with placeholders/);
  assert.match(policy, /https:\/\/vercel\.com\/docs\/analytics\/privacy-policy/);
  assert.doesNotMatch(policy, /Because these technologies are necessary for the service, there is no advertising-cookie consent banner/);
});
