# Fixed-penalty multiplayer scoring

Implemented locally. Migration 070 must be applied before deploying the app.
This document describes version 3; the version-1/2 rules remain unchanged.

## Rules

- Correct: 750 base points + up to 750 speed bonus, based on time remaining.
  `750 + round(750 * remaining_ms / duration_ms)`, clamped to 750-1,500.
- Wrong: fixed -300, regardless of timing or answer order.
- Blank, timeout or Give up: 0. There is no reward for deliberately not answering.
- This keeps the old time-remaining approach, not a first-correct/placement
  bonus. Server receipt time, not a client clock, determines points.
- At 90 seconds per question, a 10-second correct answer earns +1,417, and an
  11-second correct answer earns +1,408. Answering at 49 versus 50 seconds earns
  +1,092 versus +1,083: a nine-point difference, not a 100-point order bonus.
- Private 30/60/90/120/150/180-second timers remain supported. Each timer has
  the same 750-1,500 correct range and fixed -300 penalty. Scores can be negative.
- Existing shared transport grace is unchanged. After the visible deadline,
  accepted in-flight answers have no speed bonus: correct +750, wrong -300.

For five choices with no information, expected points are
`(correct_points + 4 * -300) / 5 = (correct_points - 1200) / 5`.
This is +60 at the maximum reward, zero at a 1,200-point correct award, -15 halfway
through the timer, and -90 at the deadline. This keeps the requested -300 penalty
but does not eliminate the positive expected value of fast blind guessing.
A fixed wrong penalty cannot make guessing exactly neutral at every speed when
correct awards vary. The question catalog is tested to have five choices per item.
Partial knowledge should be rewarded: eliminating choices improves expected
points. This is not a guarantee that a lucky guesser cannot win a single match.
Match RP is a separate placement/performance calculation, not an expected-zero
reward for guessing. The existing asymmetric RP rules are not redesigned here.

## Compatibility and security

New rooms default to version 3. Only completely empty, unstarted public queues
are upgraded. Occupied public lobbies, private lobbies, running games, submitted
answers, totals, saved results and history retain their previous scoring version.
The upgrade locks candidates, rechecks game records and bumps settings/state
versions. No room, membership or saved match is deleted.

The submission RPC still validates room membership, question identity, answer
shape and the shared deadline. Score, correctness and timing remain server-owned.
Duplicate retries recover the first answer and never subtract twice, replace a
wrong answer with a blank or change its original time-based penalty. Submission
and score changes remain one transaction, including rollback of broadcasts.
The receipt exposes no correctness or points. Existing scoreboard masking and
round-close feedback are unchanged. No browser database privilege is added.

RP performance still uses 70% accuracy and 30% normalized score. The maximum
is still 1,500, so the existing finalizer and normalization are unchanged.
Guest exclusion, correct-answer-only tie times, RP bounds and single-finalization
protections are unchanged.

There is no additional HTTP request, polling loop, per-player timer, table,
index, or submission query. The new branch replaces arithmetic inside the
existing atomic RPC. Local checks do not prove production latency or capacity.

## Local checks

Run from `/path/to/mao-practice`:

```sh
node --experimental-strip-types --test tests/multiplayer*.test.mjs
node --experimental-strip-types tests/multiplayerScoring.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
npm run build -- --webpack
node tests/multiplayerGiveUp.browser.mjs
node tests/multiplayerLobbyReady.browser.mjs
node tests/multiplayerResults.browser.mjs
```

The database test runs the actual migrations in isolated PostgreSQL, never
against hosted Supabase. Browser tests use synthetic rooms and mocked endpoints.
Build before browser tests; do not replace their CSS files with a simultaneous
build. Coverage includes the formulas, actual guessing expectation, one-second
differences, all timer settings, legacy data, immutable retries, masked open
scores, blank timeouts, negative history, normalization, guest exclusion,
privileges, rollback and desktop/mobile layouts.

## Rollout

1. Apply `supabase/migrations/070_multiplayer_fixed_penalty_scoring.sql` to the
   intended Supabase project. It is transactional with five-second lock and
   thirty-second statement timeouts. Stop on any error; do not assume it applied.
2. Verify the following read-only SQL. All columns should be true. This is only
   a structural check; also smoke-test the actual points after deployment.
3. Deploy only the reviewed application/test/document files. Keep the gap short
   and refresh open tabs: the old UI treats version 3 as legacy and hides Give up.
4. In a newly created room, check the lobby says 750 base + up to 750 speed bonus
   and a fixed -300 wrong penalty. Finish a match with correct, wrong, Give up and timeout outcomes.
   Refresh/retry to check no duplicate award or penalty. Older occupied rooms
   should intentionally keep their old rules.

```sql
select
  exists(select 1 from information_schema.columns
    where table_schema='public' and table_name='multiplayer_rooms'
      and column_name='scoring_version' and column_default='3') as new_rooms_use_v3,
  exists(select 1 from pg_constraint
    where conrelid='public.multiplayer_rooms'::regclass
      and conname='multiplayer_rooms_scoring_version_check'
      and pg_get_constraintdef(oid) like '%3%') as v3_rooms_allowed,
  not has_function_privilege('anon',
    'public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)','execute')
    and not has_function_privilege('authenticated',
    'public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)','execute') as browser_scoring_blocked,
  has_function_privilege('service_role',
    'public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)','execute') as server_scoring_allowed;
```

Do not recalculate old submissions, restore old score bounds or downgrade the
scoring function for running version-3 rooms. Use a reviewed forward fix instead.
