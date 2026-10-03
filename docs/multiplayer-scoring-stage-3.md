# Multiplayer Stage 3: scoring and Give up

Implemented locally; not applied to Supabase or deployed by this change.
Requires Stage 2 / migration 060.

## Rules

- Correct: 1,000 base + round(500 × remaining fraction of the question time).
- Wrong: −300, regardless of speed.
- Blank on timeout or confirmed Give up: 0.
- Scores may go negative. Public time stays 90 seconds; private time stays as configured, up to 180 seconds.
- No Skip button. Give up permanently records a blank for that player; it does not move anyone else forward while they are still answering.
- If everyone submits an answer or gives up, the existing round transition runs. Otherwise the existing shared deadline applies.
- Give up has a short confirmation with a Keep working option. Confirmation is irreversible, just like submitting an answer.

With five equally likely choices, a fastest blind guess has expected value +60;
leaving blank has expected value 0. The user explicitly accepted that difference.
This is a guessing deterrent, not exact guess/blank expected-value equality.

## Existing data and compatibility

Migration 061 adds scoring_version to rooms and submissions. Existing rows become
version 1, retaining the old correct-answer formula and zero penalty for wrong
answers. Newly created rooms default to version 2. Existing open lobbies also
retain version 1: starting an old lobby does not change its rules. The lobby and
question screen label the applicable rules. Public replacement rooms pick up the
new default when created; do not delete old rooms to force this.

No existing submissions, totals, results, history, accounts, or practice data are
deleted or recalculated. Negative-score constraints are updated on players,
submissions, final results, and durable match history. The original non-null
correctness and allowed A–E checks remain; explicit null is allowed only as a
version-2 Give up with false correctness and zero points.

For new rooms, only correct-answer solve time breaks equal-total ties. This keeps
wrong-answer speed, Give up, and timeout blanks from adding a hidden time penalty.
Legacy rooms keep their original tie rule. RP bounds, performance bounds and the
existing positive-score requirement for a ranked win remain.

## Submission and efficiency safeguards

- The same server-only atomic RPC validates membership, locks the room, recovers
  existing receipts, checks the question/deadline, and commits the submission and
  score together. Repeating a wrong answer cannot subtract 300 twice. Retrying it
  as Give up cannot erase the original penalty.
- The app derives identity and correctness on the server. Client-supplied player
  IDs, points, correctness and elapsed time are ignored.
- Only explicit selectedAnswer: null means Give up. A missing or malformed answer
  is rejected. Old rooms reject Give up.
- Speed uses the database receipt clock, not the browser clock or delivery ACK.
  The existing shared five-second transport grace remains; no bonus is earned
  after the visible question duration.
- The pending answer/Give up is frozen through retries and session refresh. A
  restored pending response cannot be replaced through the question controls.
- No extra polling, endpoint, per-player timer job, or database call is added.
  The room version travels in existing snapshots. New scoring no longer counts
  earlier correct answers for the order adjustment.
- Browser SQL privileges are not broadened. RPC receipts contain no answer key,
  correctness, or points. Existing live leaderboard totals retain their behavior;
  expanded per-question feedback and waiting-screen timers are the next stage.

This stage does not optimize initial game loading or podium preparation, change
room capacity, or prove 200-player production capacity. Isolated PostgreSQL and
mocked browser tests are not a multi-connection hosted load test.

## Local verification

Run from /path/to/mao-practice. Build first, then browser tests; rebuilding
concurrently can replace the CSS files the browser fixtures are reading.

```sh
npm run lint &&
node --experimental-strip-types --test tests/*.test.mjs &&
npm run build -- --webpack &&
node tests/multiplayerGiveUp.browser.mjs &&
node tests/multiplayerClient.browser.mjs &&
node tests/multiplayerLobbyReady.browser.mjs &&
node tests/multiplayerSettings.browser.mjs &&
node tests/multiplayerResults.browser.mjs
```

Isolated database tests (use the already-installed local PGlite runtime):

```sh
node tests/multiplayerScoring.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
```

Coverage includes preserving legacy records and finalized history, 30/90/180-second
speed calculations, wrong-answer timing, transport grace, immutable duplicate
receipts, timeout blanks, negative ranked/unranked finalization and archival,
transaction rollback, invalid score shapes, membership/deadline guards, and RPC
permissions. Browser tests cover desktop/mobile controls, cancelling Give up,
network failures, refresh recovery, leaving blank, old rooms, negative result
labels, and no Skip button.

The existing results browser fixture now aliases next/image to the repository's
image mock, matching the other standalone browser tests. Without the alias its
standalone webpack bundle tried to use Next.js server-provided process settings.
The application itself was not changed for that test-fixture issue.

## Rollout order

1. Complete the local checks above. Review only the files in this stage.
2. Apply supabase/migrations/061_multiplayer_scoring_give_up.sql in the intended
   Supabase project, before deploying the app. The migration is transactional and
   uses a five-second lock timeout and thirty-second statement timeout. If it
   errors or times out, stop and inspect; do not mark it applied.
3. Verify the changes and record migration 061 only after successful application.
   The previously observed CLI temporary-login hang may still affect migration
   repair; a failed repair is not evidence that the SQL failed. If repair hangs,
   stop it and use a separately reviewed, exact-definition SQL history guard
   instead of inserting a history row blindly.
4. Deploy the reviewed app files. The old app can still submit ordinary answers,
   but it does not show Give up or the new penalty labels, so keep the migration-
   to-deployment gap short and refresh open browser tabs.
5. Smoke-test a newly created room with two accounts or an account and guest.
   Confirm the lobby shows the new scoring line. An older lobby will intentionally
   show Legacy scoring; it is not evidence of a failed deployment.

Read-only structural check in the SQL Editor after application:

```sql
select
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='multiplayer_rooms'
      and column_name='scoring_version' and column_default='2'
  ) as new_rooms_use_v2,
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='multiplayer_submissions'
      and column_name='selected_answer' and is_nullable='YES'
  ) as give_up_storage_ready,
  not has_function_privilege('anon',
    'public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)', 'execute')
    and not has_function_privilege('authenticated',
    'public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)', 'execute')
    as browser_scoring_blocked,
  has_function_privilege('service_role',
    'public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)', 'execute')
    as server_scoring_allowed;
```

Expect all four true. These are structural checks only, not a complete definition
or data-integrity audit and not sufficient by themselves to repair migration
history.

Smoke tests:

- Submit a wrong answer: total drops by exactly 300, including below zero.
- Submit correct answers at different speeds: both earn 1,000–1,500; the faster
  correct answer earns at least as much.
- Open Give up, choose Keep working: nothing is submitted and the timer continues.
- Confirm Give up: 0 points; other players can use their remaining time.
- Leave another question unanswered until timeout: 0 points, not −300.
- Refresh after submission or while a response is unconfirmed; retry the saved
  response. No answer switch or duplicate points/penalties.
- Finish the game: negative totals appear in the leaderboard, result review and
  saved match history. Refreshing results does not award scores/RP again.
- Check a pre-existing room/history entry retains its old score.

Rollback is an application rollback or a reviewed forward fix, not deletion of
columns/data or reinstating the old nonnegative constraints. Old constraints
cannot safely be restored once version-2 negative scores or Give ups exist.
Do not roll back the database RPC to the old formula for running version-2 rooms.

## Files in this stage

- app/api/multiplayer/rooms/[id]/round/route.ts
- components/multiplayer/MatchQuestion.tsx
- components/multiplayer/MatchResults.tsx
- components/multiplayer/PrivateLobby.tsx
- lib/multiplayerRecovery.ts
- lib/multiplayerScoring.ts
- lib/services/multiplayerService.ts
- types/multiplayer.ts
- supabase/migrations/061_multiplayer_scoring_give_up.sql
- tests/multiplayerScoring.test.mjs
- tests/multiplayerSubmission.test.mjs
- tests/multiplayerRecovery.test.mjs
- tests/multiplayerGiveUp.test.mjs
- tests/multiplayerScoring.database.mjs
- tests/multiplayerGiveUp.browser.mjs
- tests/browserFixtures/scoring.tsx
- tests/multiplayerResults.browser.mjs
- docs/multiplayer-scoring-stage-3.md

Leave unrelated security/account-deletion files unstaged.
