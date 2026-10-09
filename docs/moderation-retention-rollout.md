# Moderation retention (migration 069)

These are application retention choices, not a legally mandated retention period
or a certification of legal compliance. Keep only what is necessary for the
documented purpose. Apply the database first, before publishing the new notices.

## What changes

- Routine moderation audit history is eligible for deletion after 90 days. Its
  purposes are review of administrative decisions, disputes, and abuse investigation.
- Deleting an account removes its target audit records immediately through an Auth
  foreign-key cascade. Deleting a moderator clears its actor identifier and replaces
  the associated reasons with a neutral notice, preserving the other user's record.
  This applies to existing orphaned records during installation too.
- A private retry/rate-limit receipt expires 24 hours after the original action.
  It contains a random request ID, SHA-256 request fingerprint, hashed actor ID, and
  timestamps, not raw account IDs, usernames or original reason text. Fingerprints
  remain pseudonymous; do not call them anonymized or collect extra sensitive details.
  Recent legacy audits are backfilled without extending their original expiry.
- Active suspension, required renaming, private login aliases, fresh password/Google
  verification and the 10-action/minute database limit remain in place. Audit cleanup
  must never restore a suspended account. A deleted target's retry receipt preserves
  the action limit without keeping the deleted account's audit.
- The hourly job runs at minute 23. Each transaction removes at most 500 audit rows,
  500 receipts, and 500 of this job's run-history rows older than seven days. Other
  jobs' history is not changed. Review failed runs and expired-row backlogs; eligibility
  is not a promise that physical removal occurs exactly at the deadline.

## Security and performance

Receipts have RLS and no table privileges for anonymous, signed-in, service-role or
authenticator roles. Only the scoped moderation function writes them. Cleanup and
actor-redaction functions are security-definer functions owned by postgres, with an
empty search path and execution revoked from application roles. There is no cleanup
HTTP endpoint, UI control, extra page-load query, or extra multiplayer polling call.

Audit/receipt cleanup uses expiry indexes, bounded batches, `FOR UPDATE SKIP LOCKED`,
a nonblocking transaction advisory lock and a 250ms lock timeout. Its scheduled command sets a
five-second statement timeout. Existing indexed actor/target audit lookups support
account deletion/redaction. Ordinary moderation adds a small local receipt write,
not another network round trip. Shared database resources and large account deletions
can still affect latency; this is not a guarantee of zero lag under hosted load.

Supabase's extension owns `cron.job_run_details`. History cleanup uses its existing
run-ID primary key and SELECT/DELETE permissions, without a custom index or an UPDATE
lock. The migration never changes ownership or grants on managed scheduler tables.
History scans still share the scheduled five-second timeout; review large history
backlogs if a run times out rather than granting broader permissions.

Installation creates indexes, validates foreign keys and cleans existing orphaned
history in one transaction, with 5s lock/30s statement timeouts. It is not the capped
hourly job. For large tables or many orphans, use a low-traffic maintenance window.
If preview times out or volumes are unexpectedly large, stop for an operator-reviewed
   phased migration; do not disable timeouts or run bulk deletion on the gameplay path.

## Publish and verify

1. Confirm migrations 047, 057 and 068 and Supabase pg_cron are installed. Do not
   overwrite an unrelated PostgREST security hook. Review the read-only impact counts:

   ```sh
   pbcopy < /path/to/mao-practice/docs/sql/moderation-retention-preview.sql
   ```

   Paste into the correct project's SQL Editor as postgres. It returns counts, not
   usernames or reasons. The operator and scheduler checks must be true. Review the
   orphan counts before authorizing their permanent removal.

2. Apply the complete migration once, database first:

   ```sh
   pbcopy < /path/to/mao-practice/supabase/migrations/069_account_moderation_retention.sql
   ```

   Paste into SQL Editor and run. Errors roll back the transaction. Do not rerun after
   success: this creates a table, indexes and trigger. Record migration 069 through
   your normal migration-history workflow only after confirming installation.

   If an earlier version failed with `must be owner of table job_run_details`, use
   the corrected local file, not the old text in the editor. First run `rollback;`
   and then `select to_regclass('public.account_moderation_receipts');`. It should
   return NULL after the failed transaction. If it does not, stop for review rather
   than dropping objects or changing managed-table ownership. Then copy and run the
   complete corrected migration and perform the verification below.

3. Check installation and scheduling without deleting anything:

   ```sh
   pbcopy < /path/to/mao-practice/docs/sql/moderation-retention-verify.sql
   ```

   Run in SQL Editor. Every boolean must be true. After the next scheduled run, check
   that the status is succeeded and backlogs fall. Job registration alone does not
   prove the worker runs. Keep run error details private; investigate unexpected
   failures and recurring backlogs rather than silently extending the policy.

4. Deploy the application notices and nullable-actor display together. Review and
   stage only the intended files, not unrelated dashboard/security work. No production
   migration or application deployment is performed by the local tests below.

5. Use disposable test accounts to check self-deletion, owner deletion, blocked
   privileged deletion, suspension/restore, and required renaming. Confirm the exact
   deleted target's audit is gone and another participant's game/progress is unchanged.
   Never use a real student's account to test deletion. Compare hosted page/poll latency
   before and after under representative traffic; no load benchmark is implied here.

## Privacy operations outside this migration

Do not retain known under-13 audit data for 90 days by default. Complete the existing
[underage response process](underage-player-response.md), including guest participation,
reports, emails, unrelated free text and provider records. The 24-hour receipt is a
limited security record, not an excuse to keep the deleted account's personal audit.
For a request needing earlier receipt removal, the trusted operator must identify the
specific request and review retry/rate-limit implications; no bulk browser/API bypass
is provided. Document necessity and applicable legal requirements for any retention.

A specific lawful preservation need must be separately documented: purpose, minimum
record, authorized access, expiry/review date and deletion at the end. This migration
does not create a general-purpose legal-hold exemption or indefinite retention switch.
Do not export all audits "just in case" or put names, birth dates, passwords or tokens
in reasons. Backup/provider copies are not purged by an active-table cascade; verify
the project's real backup expiry/access rules, record them, and reapply deletions before
restoring a backup into active service. Do not claim a provider retention period that
has not been verified.

## Local verification

```sh
cd /path/to/mao-practice
node --experimental-strip-types --test tests/*.test.mjs
PGLITE_MODULE_PATH='/path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js' \
node --test tests/security/moderationRetention.test.mjs tests/security/accountModeration.test.mjs
npm run build -- --webpack
node tests/accountModeration.browser.mjs
```

The isolated database tests use real PostgreSQL roles, RLS, foreign keys, functions
and transactions, but emulate scheduler registration/metadata: PGlite does not run
pg_cron. They test expiry, bounded batches, retry integrity, action limits after
deletion, failed-deletion rollback, orphan redaction, preserved bans, stale tokens,
running/waiting host deletion and other-player preservation. Browser tests use the
real components with mocked transports, not production Auth/Google accounts. They
do not establish hosted worker execution, provider backup deletion or hosted latency.

Background: [FTC data minimization and retention guidance](https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business),
[PostgreSQL security-definer precautions](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY),
[Supabase Cron](https://supabase.com/docs/guides/cron).
