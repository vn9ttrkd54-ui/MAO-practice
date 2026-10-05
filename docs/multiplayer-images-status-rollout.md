# Multiplayer diagrams and live submission status

## Fixes

- Question 10238's `/questions/mu-238-240-graph.svg` existed in the question bank. Multiplayer omitted `illustration` from its question payload and never rendered the diagram. Current questions, preloaded questions, spectator views and post-game review now retain it through the existing `QuestionImage` component. Public and private rooms share this path.
- Individual answers changed submission rows without changing `multiplayer_rooms.state_version`. A versioned read could therefore return `unchanged` even after another player answered. Migration **067** adds one insert trigger on the authoritative submission table, reusing the existing room-version update and small Realtime broadcast.

No existing data, points, timers, permissions or RLS policies are rewritten. No new endpoint or faster polling is introduced. Each new committed submission can now cause an existing authorized snapshot refresh. Simultaneous signals use the client's existing coalescing; duplicate receipts and heartbeats do not produce extra submission signals. This is not a claim of zero additional request load or a live 200-player benchmark.

## Rollout

1. Apply `supabase/migrations/067_multiplayer_submission_signals.sql` to the production project after the existing migrations through 066. It is transactional, repeatable, and uses a five-second lock timeout. A quiet interval between games is preferable. If it reports an error, do not proceed on the assumption that it applied.
2. Run the read-only verification below in Supabase SQL Editor. All four values must be true.
3. Record version 067 in migration history using the normal project workflow after successful application. A stalled CLI repair is not proof that the trigger failed; report the CLI error separately from SQL verification.
4. Deploy the application changes. No environment-variable or email-template changes are required.
5. Test a public and a private room with at least three players: A submits, B submits later while C is still answering. A's leaderboard must update B to Answered before the round closes. Repeat using Give up. Scores/correctness must remain hidden until closure. Repeated submission retries must not duplicate points.
6. Verify a diagram question (specifically Mu question ID 10238 when selected) displays its graph on desktop/mobile, in the spectator view and in question review. Refresh must preserve the server-confirmed statuses.

Copy the migration in macOS Terminal:

```sh
pbcopy < "/path/to/mao-practice/supabase/migrations/067_multiplayer_submission_signals.sql"
```

Paste and run it in Supabase SQL Editor, then run:

```sql
select
  exists (
    select 1 from pg_trigger
    where tgrelid = 'public.multiplayer_submissions'::regclass
      and tgname = 'multiplayer_submissions_bump_room_state'
      and tgenabled = 'O'
      and tgfoid = 'public.bump_multiplayer_room_state_version()'::regprocedure
  ) as submission_signal_ready,
  exists (
    select 1 from pg_trigger
    where tgrelid = 'public.multiplayer_rooms'::regclass
      and tgname = 'multiplayer_rooms_broadcast_state'
      and tgenabled = 'O'
  ) as room_broadcast_ready,
  not has_column_privilege('anon', 'public.multiplayer_players', 'score', 'SELECT')
    and not has_column_privilege('authenticated', 'public.multiplayer_players', 'score', 'SELECT')
    as browser_scores_blocked,
  not has_function_privilege('anon', 'public.read_multiplayer_scoreboard(uuid)', 'EXECUTE')
    and not has_function_privilege('authenticated', 'public.read_multiplayer_scoreboard(uuid)', 'EXECUTE')
    and has_function_privilege('service_role', 'public.read_multiplayer_scoreboard(uuid)', 'EXECUTE')
    as scoreboard_server_only;
```

## Local checks

```sh
npm run lint
node --experimental-strip-types --test tests/*.test.mjs
npm run build -- --webpack
node tests/multiplayerRoundFeedback.browser.mjs
node tests/multiplayerRoundFeedback.database.mjs /absolute/path/to/pglite/dist/index.js
```

The database harness reproduces the pre-067 stale snapshot, checks both room types, a 30-player roster, replay/rollback behavior, unchanged data/functions, hidden open-round results and unchanged permissions. The browser harness uses the real 10238 SVG bytes and tests rendering, peer updates, burst coalescing and reconnects. These are isolated checks, not proof of a hosted deployment or multi-connection load capacity.

## Rollback

The app's optional illustration fields are backward compatible. Reverting the app removes picture rendering but does not alter saved game data. If the new signal causes a production issue, an explicitly approved rollback can drop only `multiplayer_submissions_bump_room_state` on `public.multiplayer_submissions`; this reintroduces delayed status updates. Do not delete submissions or reset rooms to roll back this change.
