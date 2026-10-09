import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const migration = source("supabase/migrations/069_account_moderation_retention.sql");

test("retention has bounded indexed background work and short scheduler timeouts", () => {
  assert.equal((migration.match(/limit 500 for update skip locked/g) ?? []).length, 2);
  for (const name of ["account_moderation_audit_expiry", "account_moderation_receipts_expiry", "account_moderation_receipts_actor"]) {
    assert.match(migration, new RegExp(`create index ${name} `));
  }
  assert.match(migration, /pg_try_advisory_xact_lock\(690,1\)/);
  assert.match(migration, /cron\.schedule\('account-moderation-retention','23 \* \* \* \*'/);
  assert.match(migration, /set statement_timeout='5s'; set lock_timeout='250ms'/);
  assert.match(migration, /interval '90 days'/);
  assert.match(migration, /interval '7 days'/);
  assert.doesNotMatch(migration, /http_post|net\.|fetch\(/);
});

test("managed scheduler history needs neither ownership, DDL, nor UPDATE privileges", () => {
  assert.doesNotMatch(migration, /create index .* on cron\.|alter table cron\.|grant .* on cron\./i);
  assert.match(migration, /order by runid limit 500\s*\) delete from cron\.job_run_details/);
  assert.doesNotMatch(source("docs/sql/moderation-retention-verify.sql"), /account_moderation_retention_run_expiry/);
});

test("cleanup is not exposed through page requests, polling, or a new public API", () => {
  for (const path of ["app/multiplayer/actions.ts", "lib/services/accountModerationService.ts", "lib/supabase/server.ts", "app/api/admin/users/[id]/moderation/route.ts", "components/admin/AccountModerationPanel.tsx"]) {
    assert.doesNotMatch(source(path), /cleanup_account_moderation_retention|account_moderation_receipts|scrub_deleted_moderation_actor/);
  }
  for (const name of ["scrub_deleted_moderation_actor", "cleanup_account_moderation_retention"]) {
    assert.match(migration, new RegExp(`revoke all on function public\\.${name}\\(\\) from public,anon,authenticated,service_role,authenticator`));
  }
  assert.match(migration, /alter table public\.account_moderation_receipts enable row level security/);
  assert.match(migration, /current_user <> 'postgres'/);
});

test("policy, operator guidance, and deletion UI match the retention limits without promising anonymity", () => {
  const policy = source("app/privacy/page.tsx");
  assert.match(policy, /Backlogs or service interruptions can delay removal/);
  assert.match(policy, /Active suspension and required-name-change settings are separate/);
  assert.match(policy, /pseudonymous, not necessarily anonymous/);
  assert.match(policy, /no username, original reason text, or raw account identifier/);
  assert.match(policy, /documented purpose, restricted access, and an expiry or review date/);
  assert.match(source("components/admin/AccountModerationPanel.tsx"), /Actor: \{entry\.actor_id \?\? "Deleted moderator"\}/);
  const rollout = source("docs/moderation-retention-rollout.md");
  assert.match(rollout, /not a legally mandated retention period/);
  assert.match(rollout, /database first/);
  assert.match(rollout, /PGlite does not run\s+pg_cron/);
  for (const name of ["preview", "verify"]) {
    const sql = source(`docs/sql/moderation-retention-${name}.sql`);
    assert.match(sql, /begin read only/);
    assert.match(sql, /rollback;\s*$/);
    assert.doesNotMatch(sql, /select \*|select .*reason|delete from|^\s*select (?:public\.)?cleanup_account_moderation_retention\(\)/im);
  }
});
