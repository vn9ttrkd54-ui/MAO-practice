import test from "node:test";
import assert from "node:assert/strict";
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
