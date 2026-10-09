import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("metadata and legal pages consistently describe the high-school 13-plus audience", () => {
  for (const path of ["app/layout.tsx", "app/privacy/page.tsx", "app/terms/page.tsx"]) {
    const text = source(path);
    assert.match(text, /high-school/);
    assert.match(text, /coaches, and teachers/);
    assert.match(text, /13\+|13 (?:and|or) older/);
  }
  assert.match(source("app/terms/page.tsx"), /Do not invite or readmit someone you know is under 13, including as a guest/);
});

test("homepage omits the audience sentence without changing the tagline or Play destination", () => {
  const home = source("app/page.tsx");
  assert.doesNotMatch(home, /For high-school math competitors, coaches, and teachers\. Ages 13\+\./);
  assert.match(home, /Practice math\. Improve skills\. Compete\./);
  assert.match(home, /href="\/multiplayer"/);
});

test("public reporting covers guests without demanding a child identity document", () => {
  const contact = source("app/contact/page.tsx");
  assert.match(contact, /id="underage-player"/);
  assert.match(contact, /without signing in/);
  assert.match(contact, /guest nickname and private room code or room link/);
  assert.match(contact, /approximate date and time/);
  assert.match(contact, /Do not send a password, date of birth, identity document/);
  assert.match(contact, /subject=Under-13%20player%20report/);
  assert.doesNotMatch(contact, /createClient|requireUser|redirect\(/);
  const policy = source("app/privacy/page.tsx");
  assert.match(policy, /href="\/contact#underage-player"/);
  assert.match(policy, /account holder or guest player/);
  assert.match(policy, /invalidates its reconnect token/);
  assert.match(policy, /operator-handled actions, not automatic age detection/);
  assert.match(policy, /restricted backup copies/);
  assert.match(policy, /Deleting an account automatically removes audit records about that account/);
  assert.match(policy, /90 days after the action/);
  assert.match(policy, /expire 24 hours after the action/);
  assert.match(policy, /pseudonymous, not necessarily anonymous/);
});

test("manual deletion stays outside the join/game paths and is rollback-first", () => {
  const removal = source("docs/sql/guest-player-removal.sql");
  assert.match(removal, /target_room_id uuid := null/);
  assert.match(removal, /target_player_id uuid := null/);
  assert.match(removal, /player\.user_id is not null/);
  assert.match(removal, /set local lock_timeout = '5s'/);
  assert.match(removal, /rollback;\s*$/);
  assert.doesNotMatch(removal, /create (?:or replace )?function|grant /i);
  assert.match(source("docs/sql/guest-player-removal-preview.sql"), /begin read only/);
  assert.doesNotMatch(source("docs/sql/guest-player-removal-preview.sql"), /select .*reconnect_token_hash/);
  const runbook = source("docs/underage-player-response.md");
  assert.match(runbook, /does not create an identity\/device ban/);
  assert.match(runbook, /has not deleted anything permanently/);
  assert.match(runbook, /not.*certification of COPPA compliance/);
  assert.match(runbook, /account_moderation_audit.*automatically removed/);
  assert.match(runbook, /do not keep an under-13 account's audit for 90 days by default/);
  for (const path of ["app/multiplayer/actions.ts", "app/multiplayer/join/page.tsx"]) {
    assert.doesNotMatch(source(path), /guest-player-removal|underage-player-response|termsAccepted|JoinAgreement/);
  }
});
