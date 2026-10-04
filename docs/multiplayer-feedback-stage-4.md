# Multiplayer Stage 4: round feedback and waiting countdown

Implemented locally. Requires Stage 3 / migration 061. This change does not apply
SQL to Supabase, commit, push, or deploy the application.

## Behavior

- After submitting an answer or Give up, the leaderboard shows the shared time
  remaining while other players finish, including on the final question.
- Before the database closes the round, players see Submitted / Still answering
  and totals from completed questions only. Current-question score deltas and
  results are withheld on the server, not just hidden in the interface.
- Once the round closes, each player gets Correct / Incorrect / Gave up / Blank,
  this question's points, recorded answer time, and their updated total.
- Blank on timeout displays Time expired, not a made-up submission time.
- A zero on the browser clock does not authorize revealing results. The existing
  transport grace and authoritative round transition remain in control.
- The last question's breakdown is in the final leaderboard; players also see
  their answer time in each question-review card. No extra final-round hold or
  podium delay is added.
- The next question clears previous-round feedback. Old snapshots cannot move
  the player or spectator interface backwards. Waiting screens show connection
  warnings and a retry control, preserving the saved-answer retry flow.
- Existing rank styling, negative totals, speed bonuses, wrong-answer penalties,
  Give up behavior, readiness, capacities and question durations are unchanged.
  There is no Skip button.

## Database and access

Migration 062 creates a service-role-only, stable read function,
`read_multiplayer_scoreboard(uuid)`, and replaces the read snapshot and read lobby
functions to use that same consistent view. These functions do not change data,
advance rounds, lock rooms for writing, or emit broadcasts. The new projection
uses the current question and existing indexed player/submission relationships;
it does not fetch all submissions from all rounds.

The original authenticated SELECT grant on multiplayer_players could reveal a
player's own live score independently of the API. Migration 062 replaces that
table-wide read grant with reads of id, room_id and user_id only, retaining the
existing private-room membership RLS checks. It explicitly revokes score-column
reads from PUBLIC, anon and authenticated. The current app reads its roster
through verified server endpoints and uses room broadcasts; it does not depend
on browser reads of raw player rows. This is an intentional access restriction,
not a data deletion. Custom consumers of those old direct reads must use the
verified API instead. Existing RLS policies and write permissions are unchanged.

The server validates account/guest membership before player reads. Spectating
still requires a signed-in nonparticipant in a public in-progress room. Completed
results retain the existing membership/public-spectator authorization. Roster
feedback contains no chosen answer letters, answer keys, solutions, guest tokens,
or connection fencing keys. Completed question review retains its existing
answer/solution access; that is separate from live round feedback.

The migration does not rewrite/delete scores, submissions, users, practice data,
match results or durable match history. Version 1 rooms retain their recorded
legacy scores; version 2 scoring remains correct 1,000 plus up to 500 speed bonus,
wrong −300, blank/Give up 0. Atomic submission and finalization functions are not
modified.

## Efficiency and scope

The player countdown uses its existing local, server-synchronized timer; no
per-second requests or extra worker jobs are added. Existing recovery polling and
realtime coalescing remain. Spectators now read the question and safe roster in
one snapshot instead of separate question/player/name/rating queries. Final
results similarly reuse the scoreboard projection.

This is bounded per room (20 public / 30 private), but does not prove capacity
for 200 simultaneous users. Live multi-connection measurements across rooms are
still needed. Initial-load and podium-speed optimization remain deferred.

## Local verification

Build before browser checks, not concurrently with them (fixtures read generated
CSS). Run from /path/to/mao-practice:

```sh
npm run lint &&
node --experimental-strip-types --test tests/*.test.mjs &&
npm run build -- --webpack &&
node tests/multiplayerRoundFeedback.browser.mjs &&
node tests/multiplayerGiveUp.browser.mjs &&
node tests/multiplayerClient.browser.mjs &&
node tests/multiplayerResults.browser.mjs &&
node tests/multiplayerLobbyReady.browser.mjs &&
node tests/multiplayerSettings.browser.mjs
```

Isolated database regression, using the existing local runtime:

```sh
node tests/multiplayerRoundFeedback.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
```

Coverage: migration preserves all seeded rows and scoring/transition definitions;
open private/public snapshots, lobby and spectator reads; positive/negative/zero
score masking; real RLS membership checks; server-only grants; guest identity;
unchanged-version reads; fresh lobby presence and readiness; timeout/grace and
all-submitted closure; all four outcomes; next-round reset; finalization/history;
30-player roster bounds; no broadcasts/writes on reads. Browser checks cover
desktop/mobile, refresh, stale state, local countdown without extra requests,
preloaded next question, final-question waiting, reconnect and final results.
These tests use isolated PostgreSQL and mocked endpoints, never production data.

## Rollout order

1. Review only Stage 4 files and pass the checks above. Leave unrelated security
   notes and migrations unstaged.
2. Apply supabase/migrations/062_multiplayer_round_feedback.sql in the intended
   Supabase project's SQL Editor, before deploying the application. It requires
   061 and is transactional with a 5-second lock / 30-second statement timeout.
   If it fails or times out, stop and inspect; do not record it as applied.
3. Verify the SQL checks below, then record migration 062 through the normal
   migration-history workflow. The CLI's previous temporary-login failures are
   not evidence that this SQL failed. Do not blindly replay an already-applied
   migration or mark one applied without verifying its schema and grants.
4. Publish only the Stage 4 application changes. Database-first is compatible
   with Stage 3's API-based reads; deploying Stage 4 before 062 is not supported.
5. Use a new two-account room to check the countdown after the first submission;
   both totals remain unchanged while someone answers. Close the round and
   verify outcomes, signed question points, time and totals. Test Give up, an
   unanswered timeout, a negative total, a next-round reset, a guest, a spectator,
   and the final question. Confirm practice/dashboard and lobby Ready still work.

Run in Supabase SQL Editor (all fields should be true):

```sql
with reads as (
  select p.* from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.oid in (
    to_regprocedure('public.read_multiplayer_scoreboard(uuid)'),
    to_regprocedure('public.read_multiplayer_snapshot(uuid,uuid,bigint)'),
    to_regprocedure('public.read_multiplayer_lobby(uuid,uuid,text)'))
)
select
  (select count(*)=3 from reads) as read_functions_present,
  (select count(*)=3 and bool_and(provolatile='s' and prosecdef
    and proconfig=array['search_path=""']) from reads) as stable_server_reads,
  (select count(*)=3 and bool_and(
    not has_function_privilege('anon',oid,'execute') and
    not has_function_privilege('authenticated',oid,'execute') and
    has_function_privilege('service_role',oid,'execute')) from reads) as rpc_permissions_correct,
  (not has_column_privilege('anon','public.multiplayer_players','score','select') and
   not has_column_privilege('authenticated','public.multiplayer_players','score','select')) as raw_scores_blocked,
  (has_column_privilege('authenticated','public.multiplayer_players','id','select') and
   has_column_privilege('authenticated','public.multiplayer_players','room_id','select') and
   has_column_privilege('authenticated','public.multiplayer_players','user_id','select')) as membership_reads_preserved;
```

These checks verify structure and permissions, not live gameplay or a full
security audit. Do not rerun the earlier 060/061 exact-function history guards:
062 intentionally replaces those read functions. If the app needs reverting,
roll back the app release first and retain 062's read protection; do not delete
user data, reset rooms, or restore broad browser grants as a troubleshooting step.
