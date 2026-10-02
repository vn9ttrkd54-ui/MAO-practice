# Stage 7 Reliable Trainer session saves

Stage 7 makes a Trainer session and its answer history save together. It also
makes a lost confirmation safe to retry and removes the full-history download
from the end-of-session flow. Apply migration `053_atomic_trainer_session_save.sql`
before deploying the matching application changes. No hosted data was accessed
or changed during implementation; nothing was committed, pushed or deployed.

## What changed

Previously, Trainer inserted a session, inserted its answers in another request,
then downloaded all session history. A failed answer request triggered a separate
delete as compensation. The browser also generated a different session ID and
end time whenever the user retried ending the session. An interrupted connection
could therefore leave partial history or create another session on retry.

The new flow sends one authenticated `save_trainer_session_v1` RPC. The database
inserts the session and answers in one transaction. If any answer insert fails,
the whole save rolls back; the application does not issue a compensating delete.
An exact retry confirms the existing record without inserting more rows. A
different payload with the same ID returns a conflict and does not overwrite or
automatically repair the existing record.

The browser creates the session ID at the start and freezes the end time, levels
and answers on the first finalization attempt. Manual retries reuse that exact
payload. A single in-flight guard handles double clicks. Authentication, the
request and response parsing have a combined twelve-second browser deadline.
Timeout means confirmation is unknown, not that the write necessarily failed.
There are no automatic session-save retries.

The summary appears immediately with locally available statistics and a saving
notice. A failed confirmation leaves the summary visible with Retry session save.
Recent comparisons, review links and the summary's navigation buttons unlock
after confirmation. Running out of eligible questions uses the same save flow.
Account changes and unmounts cancel pending work and prevent stale confirmations
from being displayed. Same-account token refreshes do not discard the session.

## Data and security boundaries

Migration 053 adds one function and its execute grants. It does not add or remove
tables, rewrite records, change existing table permissions, or modify earlier
migrations. Existing row-level security remains active. The function is
`VOLATILE SECURITY INVOKER`, uses an empty search path, and requires the expected
owner to match `auth.uid()`. Anonymous callers cannot execute it. Another user's
history never appears in the returned summary.

The function validates the session and result shapes, then takes a non-waiting,
transaction-scoped advisory lock for the account/session pair. A competing save
returns `busy` for a later manual retry instead of waiting behind that same save.
Different session IDs do not intentionally share a lock. This uses PostgreSQL's
[transaction-level advisory lock semantics](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS).

Retries compare every previously persisted field. Results are compared as a
multiset, preserving duplicate attempts: the original schema did not store an
explicit answer order. Per-answer duration remains local, as it was before this
stage. The session's overall start and end times are still persisted. Legacy
partial sessions are left alone; a conflict needs investigation, not deletion or
repeated blind retries.

These historical analytics still accept client-supplied answers and levels, as
before. This is not a new trusted grading system. The separate server-verified
practice-answer flow still controls question progress and awarded levels. The
session RPC does not update profiles, progress, bookmarks or awarded levels.
Existing direct table-write permissions remain unchanged for compatibility with
already-open older clients; only the new application uses this atomic path.

## Work per save

| Item | Previous flow | Stage 7 |
| --- | --- | --- |
| History data requests for a nonempty session | Two writes and one full-history read | One RPC |
| Retrying an uncertain save | A new session ID and end time | The same frozen session |
| History returned after saving | All sessions and nested answers, subject to API row limits | Current session and up to four predecessors, counts only |
| Partial failure | A separate compensating delete | Transaction rollback |

Authentication can have its own network activity; one RPC does not mean only one
request across the entire application. The recent-history query uses existing
user/time and session-result indexes. It counts answers for at most five sessions,
not the user's entire history. This still consumes database work and is not a
constant-cost or hosted-latency guarantee.

The function caps incoming sessions at 2,000 answers and the results JSON at 1 MiB.
At 2,000 answers, choosing Next Question ends and saves the session. A session
with no submitted answers can also be saved. The compact receipt ends with the
current session, even if another tab saved a newer one while confirmation was
pending. Accuracy rounding is consistent between the current summary and the
receipt, including the half-percent case 29 out of 200 rounding to 15 percent.

## Local verification

The isolated PostgreSQL-compatible test applies the actual migrations and RLS
policies, excluding the two hosted cron migrations. Across 1,105 prior sessions,
the new receipt is 662 bytes and contains five compact points. Checksums across
profiles, levels, progress, bookmarks, sessions and results are unchanged by
installing or reinstalling migration 053. These are fixture checks, not proof
about the contents of the hosted database.

Tests cover thirty identical retries without duplicate rows, conflicting payloads,
cross-account denial, anonymous denial, invalid arguments, repeated questions,
2,000-answer saves, empty sessions, and legacy partial records. An injected error
on the second answer proves that the session and first answer roll back together.
The Stage 6 database test also passes with migration 053 present.

The browser regression uses real Trainer components and save services with local
account and API fixtures. It checks double clicks, timeout recovery with an
unchanged payload, late responses, busy and conflicting saves, wrong-owner and
malformed receipts, account changes, unmounts, empty sessions, automatic completion,
and no history downloads. Desktop saving and mobile error/success screenshots
were inspected. Existing Trainer loading and production guest-flow regressions
also pass across Mu, Alpha and Theta.

All 334 unit tests, lint, TypeScript and the production Webpack build passed.
Verification commands from the repository root:

```sh
npm run test:tutor-safety
npm run lint
npx tsc --noEmit --incremental false
npm run build -- --webpack
node --experimental-strip-types tests/trainerSessionSave.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
node --experimental-strip-types tests/dashboardSnapshot.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
node --experimental-strip-types tests/stageSeven.browser.mjs
node --experimental-strip-types tests/stageFour.browser.mjs
node --experimental-strip-types tests/stageFour.next.browser.mjs
git diff --check
```

The database tests use the existing local PGlite installation at the path above;
another machine needs its own PGlite module path. Browser tests block external
requests. The PGlite tests use one backend and do not prove simultaneous
multi-connection lock behavior. No hosted 200-user load test was run.

## Rollout order

1. Review only Stage 7 changes. Leave the unrelated account-deletion and security
   files unstaged. No environment-variable, dependency or paid-plan change is needed.
2. Apply only the reviewed migration `053_atomic_trainer_session_save.sql` using
   the existing migration workflow. Inspect any CLI dry run first and stop if it
   lists unexpected migrations. Do not reset the database or blindly push all
   pending migrations.
3. If the CLI connection issue returns, execute the exact migration file in the
   Supabase SQL Editor. Reconcile migration-history version `053` only after
   successful execution and verification; do not mark unrelated versions applied.
4. Run the read-only check below in SQL Editor, not the Mac terminal. Expect one
   row with every value `true`. No row means the function is missing. Do not call
   the save function as the SQL Editor administrator to test a normal user's save.
5. Deploy the matching application through the existing Git/Vercel workflow.
   Reload Trainer so it is not running the previous application's save logic.
6. Using a test account, answer a question and end a session. Confirm the saved
   message, review links and dashboard entry. Start another session to verify it
   has a separate history entry. Also check a guest session remains local.
7. In a preview/local test, interrupt the save response and wait for the retry
   notice. Restore the connection and retry without refreshing. Confirm exactly
   one session with the expected answers. Test two independent sessions from
   different tabs and inspect latency, errors and connection usage before making
   a hosted capacity claim.

```sql
select
  not p.prosecdef and p.provolatile = 'v' as invoker_save,
  has_function_privilege('authenticated', p.oid, 'execute') as signed_in_can_save,
  not has_function_privilege('anon', p.oid, 'execute') as anonymous_blocked
from pg_proc p
where p.oid = to_regprocedure(
  'public.save_trainer_session_v1(uuid,uuid,text,timestamptz,timestamptz,integer,integer,integer,integer,jsonb)'
);
```

If deployment fails, roll back the matching application deployment. The additive
function can remain installed; do not delete session data to roll back. The old
application's multi-request save limitations return until the new version is
working again.

## Remaining limits

Pending session finalization is held in memory, not in a durable offline queue.
Closing or reloading the page before confirmation can lose the retry payload;
the UI explicitly asks the user to keep it open. Already-confirmed individual
answers remain separate from the session-history save. Guest history remains
in memory for the visit and is not uploaded to a later signed-in account.

This stage does not diagnose or fix the Question Bank saved-progress warning.
The failed request or server error is still needed to identify that issue. No
claim is made that live progress is intact based solely on these local tests.
Broader observability, production latency measurements and an authorized
200-user traffic test remain separate work.
