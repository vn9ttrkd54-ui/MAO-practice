# Stage 6 Dashboard summaries and loading recovery

This stage replaces the dashboard's full-history downloads with a compact,
account-specific summary. It keeps the existing design and session-saving
behavior. Apply migration `052_dashboard_snapshot.sql` before deploying the
application changes. Nothing was applied to the hosted database or deployed
during this local implementation.

## What changed

The old dashboard loaded the full question catalog into the browser and launched
nine parallel data operations, including detailed Trainer history, all progress,
all bookmarks and live multiplayer results. Several unpaginated reads could stop
at the API row limit. The browser then calculated totals and discarded most of
the downloaded history.

The browser now requests `/api/dashboard` once per mount or manual retry. After
verifying the signed-in user, the endpoint makes one data RPC. Authentication
and the existing proxy still have their own checks; this is not a claim of one
network call across the entire application.

The database calculates complete totals and returns at most five recent
sessions, eight trend points and ten activity items. Each session contains
counts, not individual answers. The server uses the question catalog to add
display numbers; question content is no longer part of the dashboard client
bundle. There is no new polling, shared personal-data cache or dependency.

The Trainer and question-bank formulas were compared with the existing JavaScript
implementation. Identical timestamps now have a deterministic secondary order.
Question-bank counts exclude IDs no longer in the catalog. Multiplayer average
placement and streak use archived ranked matches plus unarchived live results,
with each match counted once. Room cleanup therefore no longer removes archived
matches from those dashboard statistics. Rating and win totals still come from
the existing multiplayer profile.

Corrected totals can be higher than the old, truncated display. This does not
rewrite saved progress. Matches deleted before they were archived cannot be
recovered by this change.

## Account isolation and failures

The endpoint requires a verified cookie user and rejects a different requested
owner. The database function takes catalog IDs, not a user ID, and scopes every
account query to `auth.uid()`. It is `STABLE SECURITY INVOKER` with an empty search
path and fully qualified database objects. Existing row-level security remains
in force, including for administrator accounts. Anonymous callers have no
execute grant. This follows the documented [PostgreSQL function semantics](https://www.postgresql.org/docs/current/sql-createfunction.html)
and [Supabase function guidance](https://supabase.com/docs/guides/database/functions).

The endpoint and browser use `private, no-store` and `cache: no-store`, respectively.
Both bound their operations to twelve seconds. A failure shows a Retry dashboard
button, not fabricated zero progress or an endless loading state. There are no
automatic retries. Account-change notifications clear the displayed data and
cancel the old request; same-account token refreshes leave it alone. Reloading
after an account change uses the new server-verified identity.

These deadlines cover the new API operation and browser summary load. They do
not change the dashboard page's earlier server-side sign-in check or the shared
proxy. Cancelling the browser request does not prove that all underlying server
work immediately stopped.

## Local measurements and verification

Dashboard client-reference JavaScript from the same local Webpack build method:

| Measurement | Before Stage 6 | After Stage 6 | Reduction |
| --- | ---: | ---: | ---: |
| Raw bytes | 1,001,457 | 306,058 | 69.4% |
| Gzip bytes | 274,811 | 81,967 | 70.2% |
| Referenced chunks | 6 | 5 | 1 chunk |

The baseline is commit `b989af5`. These are the chunks referenced by
`DashboardClient`, not total page transfer, navigation time or hosted latency.
Reproduce the current measurement after a build with
`node scripts/measureDashboardBundles.mjs`.

The isolated PostgreSQL-compatible test applies the actual application
migrations and RLS policies, excluding the two hosted cron migrations. It loads
1,105 Trainer sessions, more than 1,000 progress/bookmark rows and 1,107 ranked
results across live and archived storage. The raw database summary is 4,063 bytes
for this fixture before server enrichment. Its arrays remain capped.

Checksums across eleven relevant tables are unchanged by installing the new
migration and reading dashboards. The test also checks formula parity, anonymous
and missing-identity denial, user/admin isolation, empty accounts, invalid catalog
arguments, deduplication, archive survival after fixture-room cleanup and a
repeat installation. This proves preservation for the local fixtures, not the
contents or health of the hosted database. No live user records were accessed
or modified.

All of these checks passed locally:

```sh
npm run test:tutor-safety
npm run lint
npx tsc --noEmit --incremental false
npm run build -- --webpack
node --experimental-strip-types tests/dashboardSnapshot.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
node --experimental-strip-types tests/stageSix.browser.mjs
node --experimental-strip-types tests/stageThree.next.browser.mjs
node --experimental-strip-types tests/stageFour.next.browser.mjs
node scripts/measureDashboardBundles.mjs
git diff --check
```

The unit suite contains 324 tests. The dashboard browser test uses the real
components and transport with local API/auth fixtures. It checks one read,
timeouts, safe errors, manual double-click retries, account changes, unmounts,
stale responses and mobile width. Desktop, mobile and error screenshots were
inspected. The existing production-build Question Bank and guest Trainer browser
tests also pass. Browser tests block external requests and use no hosted writes.

## Rollout order

1. Review this stage's changes and leave unrelated account-deletion/security files
   unstaged. No environment variable, paid plan or dependency change is required.
2. Confirm earlier migrations, especially `049` durable match history, are already
   installed. Apply only the reviewed `052_dashboard_snapshot.sql` through the
   existing migration workflow. If using a CLI dry run, stop if it lists unexpected
   pending migrations. Do not use a reset or blindly push all pending SQL.
3. If the connection problem returns, the Supabase SQL Editor is an alternative
   for executing the exact file. Reconcile migration-history version `052` only
   after successful execution and verification; do not mark unrelated versions as
   applied. The SQL adds a read function and permissions, not a table rewrite or
   data cleanup. An already-open older application continues using its old reads.
4. Before deploying the application, run the check below in SQL Editor. Expect
   one row with all three values `true`. No row means the function is missing.
5. Deploy the matching application changes through the existing Git/Vercel
   workflow, then reload the dashboard. Check a new account and one with history.
   Check recent sessions, bookmarks, challenge streaks and ranked history.
6. On a preview/local test, interrupt the summary request and confirm loading ends
   with Retry dashboard. Restore the connection and retry. Switch accounts in
   another tab and confirm the previous account's dashboard is cleared.

```sql
select
  not p.prosecdef and p.provolatile = 's' as read_only_invoker,
  has_function_privilege(
    'authenticated', p.oid, 'execute'
  ) as signed_in_can_read,
  not has_function_privilege(
    'anon', p.oid, 'execute'
  ) as anonymous_blocked
from pg_proc p
where p.oid = to_regprocedure('public.get_dashboard_snapshot(integer[])');
```

Do not call the function as the SQL Editor's administrator identity to test a
normal user's results; it requires the application's authenticated identity.
Check `/api/dashboard` in the browser's network panel: one summary request,
HTTP 200 on success, bounded lists and no individual Trainer answer history.
If rollout fails, revert the matching application deployment first. The unused
additive function can remain in place; no user-data restore is required for this
stage's changes.

## Remaining capacity work

One summary RPC and bounded browser payloads reduce network and browser work.
The database still aggregates a user's history, so work grows with that user's
record count. The current design uses existing user indexes; it is not constant
cost. The catalog argument is capped at 10,000 IDs. Larger catalogs or much longer
histories may justify a database catalog and transactionally maintained totals.

No hosted 200-user load test was run. Before claiming that capacity, test the
agreed traffic mix with authorization and measure latency, database CPU,
connections, failures and usage. Trainer history's multi-write save flow,
Question Bank detail reads and broader observability remain separate stages.
