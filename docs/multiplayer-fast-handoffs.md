# Multiplayer: faster start and final results

## Scope

Migration **064** requires the previous multiplayer migrations through **063**. Apply the database migration before deploying the matching application code. This change has not been applied to hosted Supabase or deployed by this task.

- New private and public matches use one shared first-question schedule: **3 seconds preparing, then a 5-second countdown**.
- The schedule starts when the server accepts the game start, not when the mouse is pressed. Navigation and network time consume part of those eight seconds; a late browser joins the same schedule without resetting everyone’s timer.
- First-question readiness acknowledgements no longer delay the room. A very slow device can arrive after the countdown or after the question starts. Existing answer deadlines and scoring-clock rules remain unchanged.
- Final-results loading targets **about 3 seconds after the match actually completes**, under a healthy worker and network. This is not a hard latency guarantee. Waiting for other players to finish is not results loading.
- No changes to scoring, speed bonuses, Give up, question duration, public-lobby Ready countdown, between-question timing, or podium animation.
- No existing room, answer, score, rating, history or user rows are rewritten. An already-preparing old match retains its database schedule; deploy between games for consistent countdown presentation.

## How it works

`start_multiplayer_lobby` inserts the first question with its reveal time already set to room start + 8 seconds. The existing atomic start transaction retains its membership, host, settings, difficulty and public-countdown checks. Early answers are still rejected by PostgreSQL.

Normal round and ready-result reads each use one database snapshot request, after verified account/guest authentication. The new RPCs are callable only by the server role, check the supplied verified actor against room membership, and use a consistent read-only snapshot. Open-round scores remain masked. Private results remain member-only; signed-in completed-public-match spectators keep their prior access. Raw answer choices are limited to the current player’s review.

The existing one-second worker and single-host finalization fallback remain responsible for atomic rating/history awards. No per-player finalization loop was added. The client makes a bounded burst of up to three recovery reads during preparation/final-answer waiting, an immediate recovery read after a saved answer, and two early pending-results refreshes. A final-question hard-deadline crossing also arms the short recovery burst, including blank answers; it does not cut off the existing answer grace. It retains the ordinary slower background fallback. Countdown ticks are local; duplicate events and in-flight reads are coalesced.

These changes reduce request overhead but do **not** certify 200-player production capacity. No hosted concurrency/load test has been performed. The existing room capacity limits are unchanged.

## Local verification

From the repository root:

```sh
npm run lint &&
node --experimental-strip-types --test tests/*.test.mjs &&
npm run build -- --webpack &&
node tests/multiplayerFastHandoffs.browser.mjs &&
node tests/multiplayerClient.browser.mjs &&
node tests/multiplayerGiveUp.browser.mjs &&
node tests/multiplayerRoundFeedback.browser.mjs &&
node tests/multiplayerResults.browser.mjs &&
node tests/multiplayerPodium.browser.mjs
```

The isolated PostgreSQL regression test needs an existing PGlite module path (not a database URL):

```sh
node tests/multiplayerFastHandoffs.database.mjs /absolute/path/to/@electric-sql/pglite/dist/index.js
```

It applies real migrations to an ephemeral database. Checks cover unchanged pre-existing data/functions, private/public 3+5 timing, duplicate/missing ACKs, early-answer rejection, preserved later-round behavior, actor/guest isolation, completed-result privacy, worker finalization, repeat-award protection and server-only read grants. Browser tests use actual components with mocked endpoints; they do not measure live Supabase/Vercel latency.

## Rollout order

1. Choose a quiet time with no active matches. Confirm 063 is applied and the existing worker is healthy.
2. Run local checks. Review only this stage’s files; preserve unrelated changes and security migration files.
3. Apply `supabase/migrations/064_multiplayer_fast_handoffs.sql` once in the correct Supabase project’s SQL Editor. The file contains one transaction with bounded lock and statement timeouts. A success message alone is not sufficient verification.
4. Run the read-only checks below. If they fail, stop before deploying; do not blindly rerun an uncertain migration. New function creation intentionally makes duplicate application visible.
5. Record 064 as applied using the normal migration workflow. For a manually applied migration, `npx supabase migration repair 064 --status applied --linked` updates history only; it does not install the SQL. If the temporary-login connection hangs, stop it and request a reviewed SQL Editor history fallback rather than rerunning schema changes or marking an unverified migration applied.
6. Commit/push only the reviewed stage files when ready to deploy. Wait for the production deployment to succeed, then refresh the browser to load the new client.
7. Run the live smoke test below. Do not mark live timing verified based only on local tests.

## Read-only database checks (Supabase SQL Editor, not the Mac terminal)

All three functions should exist; both browser roles should be blocked, and the server role should be allowed. `expected_volatility` should be true for all three rows.

```sql
with expected(signature, volatility) as (
  values
    ('public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[],bigint)', 'v'),
    ('public.read_multiplayer_round_for_actor(uuid,uuid,text,bigint)', 's'),
    ('public.read_multiplayer_result_snapshot(uuid,uuid,text)', 's')
)
select e.signature,
  p.oid is not null as function_present,
  not has_function_privilege('anon', p.oid, 'execute') as anonymous_blocked,
  not has_function_privilege('authenticated', p.oid, 'execute') as signed_in_blocked,
  has_function_privilege('service_role', p.oid, 'execute') as server_allowed,
  p.provolatile::text = e.volatility as expected_volatility
from expected e
left join pg_proc p on p.oid = to_regprocedure(e.signature);

select
  position($s$started+interval '3 seconds'$s$ in p.prosrc) > 0 as three_second_preparation,
  position($s$started+interval '8 seconds'$s$ in p.prosrc) > 0 as eight_second_total_start
from pg_proc p
where p.oid = to_regprocedure(
  'public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[],bigint)'
);

select jobname, schedule, active
from cron.job
where jobname = 'multiplayer-round-worker';

select d.status, d.return_message, d.start_time, d.end_time
from cron.job_run_details d
join cron.job j using (jobid)
where j.jobname = 'multiplayer-round-worker'
order by d.start_time desc limit 5;
```

The worker should be active on its existing `1 second` schedule, with recent successful runs. Do not create a duplicate worker. After recording the migration, also verify:

```sql
select version, name from supabase_migrations.schema_migrations
where version = '064';
```

Expected name: `multiplayer_fast_handoffs`.

## Live smoke test

- In a new private room, use a host plus another signed-in player or guest. Start and observe about 3 seconds preparing followed by 5, 4, 3, 2, 1. Time both browsers; verify neither can submit early.
- Refresh during the countdown: the shared remaining time must continue, not reset. A slower/disconnected browser must not extend the first-question schedule.
- Verify the next question still has its existing transition behavior. Check correct-answer speed bonus, wrong answer -300, blank/Give up 0, per-question feedback and question duration.
- Complete the final question for everyone. Measure from the last accepted answer to the podium becoming available, separately from the unchanged podium animation. Target about 3 seconds, not a forced extra wait if it is already ready.
- Repeat with a new public match and test one timeout/blank finish. The existing answer grace and worker deadline still apply before the match is complete.
- Confirm one result/history entry per player and no repeated rating change on refresh. Confirm a nonmember cannot view private results.
- If slow, collect the relevant request duration/status and request ID plus worker run status. Do not share cookies, Authorization headers, guest tokens or service keys.

## Stage files and rollback

Production files:

- `supabase/migrations/064_multiplayer_fast_handoffs.sql`
- `lib/services/multiplayerService.ts`
- `lib/multiplayerTiming.ts`
- `components/multiplayer/MatchQuestion.tsx`
- `components/multiplayer/ResultsPending.tsx`
- `app/api/multiplayer/rooms/[id]/round/route.ts`
- `app/multiplayer/room/[id]/play/page.tsx`

Tests/docs:

- `tests/multiplayerTiming.test.mjs`
- `tests/multiplayerResultLoading.test.mjs`
- `tests/multiplayerRoundFeedback.test.mjs`
- `tests/multiplayerClient.browser.mjs`
- `tests/multiplayerFastHandoffs.test.mjs`
- `tests/multiplayerFastHandoffs.database.mjs`
- `tests/multiplayerFastHandoffs.browser.mjs`
- `tests/browserFixtures/fastHandoffs.tsx`
- `docs/multiplayer-fast-handoffs.md`

For an application rollback, first return to the previous application deployment in a quiet window. Leaving the additive read functions installed is safe; do not drop them while newer clients/server deployments use them. The old client will display the shorter first-question schedule differently, so a full timing rollback requires a reviewed forward migration restoring only the previous start function. Never reset the database, replay old migrations wholesale, or delete match history to undo this stage.
