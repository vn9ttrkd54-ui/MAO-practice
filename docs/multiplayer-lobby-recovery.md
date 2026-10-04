# Multiplayer lobby recovery (migration 063)

Local implementation only. Nothing here has been applied to hosted Supabase or
deployed by the coding agent. Requires the existing Stage 4 / migration 062.

## What changes

- Back navigation disconnects lobby presence; it does not close the private room.
  Unfinished private memberships now remain visible on both Multiplayer and
  Create Room, with **Return to Room**. The host also gets **Close Room** and an
  explicit confirmation. Non-hosts cannot close the room.
- Creating/closing a room invalidates both pages so navigation does not keep
  serving the pre-creation room list. If the room lookup fails, Create Room is
  disabled with a retry message instead of pretending no room exists.
- Closing verifies the signed-in account on the server and locks the target room
  using the same lock as Start. A running/completed match or room with recorded
  match data cannot be closed through this recovery action. A successful close
  marks an unstarted room cancelled, freeing the existing creation guard; it does
  not immediately delete the roster. The normal cancelled-room cleanup remains.
- Migration 063 upgrades legacy scoring only in public waiting/countdown rooms
  that have never started and contain no questions, submissions, match results,
  history, nonzero player scores, placements, or submission flags.
  These rooms receive scoring version 2: correct 1,000 plus up to 500 speed bonus,
  wrong −300, blank/Give up 0. No Skip button is added.
- Upgrading a public lobby increments its settings version (old Ready consent is
  cleared logically) and state version (clients receive the change). It never
  extends the countdown or changes difficulty, duration, roster, or scores.
- Started/completed public matches and all existing private rooms keep their
  scoring version. Legacy private rooms can be explicitly closed and recreated
  if the host wants the new scoring. No saved scores are recalculated.

## Safety and efficiency

The close RPC is executable only by service_role, with a fixed empty search path.
The browser supplies a room ID and confirmation, never an authoritative user ID.
The server obtains the account from the verified session. UI visibility is not
the permission check. Failed/ambiguous writes show an error, not a success claim.

The migration is transactional, with a 5-second lock timeout and 30-second
statement timeout. It locks candidate public lobbies against simultaneous starts
and rechecks all guards. The public queue uniqueness constraint bounds these
candidates by division and question count. No polling, heartbeat or worker is
added. Create Room adds an account-scoped room lookup; Close is an explicit,
one-shot mutation. These tests do not establish 200-user production capacity.

## Local validation

Run from `/path/to/mao-practice`. Build before browser checks because
they use the generated application CSS.

```sh
npm run lint &&
node --experimental-strip-types --test tests/*.test.mjs &&
npm run build -- --webpack &&
node tests/multiplayerLobbyRecovery.browser.mjs &&
node tests/multiplayerLobbyReady.browser.mjs &&
node tests/multiplayerSettings.browser.mjs &&
node tests/multiplayerGiveUp.browser.mjs &&
node tests/multiplayerRoundFeedback.browser.mjs
```

Isolated PostgreSQL using the existing local runtime (no credentials):

```sh
node tests/multiplayerLobbyRecovery.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js &&
node tests/multiplayerRoundFeedback.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
```

Coverage includes disconnected/stale private memberships, account scoping,
explicit confirmation, failed writes, host-only cancellation, creation guard
release, Close-before-Start and Start-before-Close ordering, unchanged seeded
history/scores, public legacy upgrade exclusions, Ready invalidation, unchanged
countdowns, actual Give up/penalty/bonus submissions, desktop/mobile layout, and
pending submission controls. Database tests are single-instance, isolated tests;
browser tests use a mocked close action. Actual Safari Back navigation and real
multi-connection concurrency still require hosted smoke testing.

## Rollout order

1. Review only the files listed below; leave unrelated security files unstaged.
2. During a quiet lobby window, apply
   `supabase/migrations/063_multiplayer_lobby_recovery.sql` in the intended
   Supabase project's SQL Editor, **before deploying the app**. Do not reapply
   earlier migrations. If it times out, stop and inspect the transaction state;
   do not mark it applied or repeatedly run it while a prior attempt is active.
3. Run the read-only checks below. All three should be true. Then record 063 with
   the normal migration-history workflow. A CLI temporary-login timeout is not
   evidence that SQL Editor failed. Do not mark a migration applied without
   checking its function, permissions and data update.
4. Publish only these application changes after the database is ready.
5. Perform the small hosted checks below before calling the rollout complete.

```sql
with close_rpc as (
  select p.* from pg_proc p
  where p.oid=to_regprocedure('public.close_owned_private_multiplayer_lobby(uuid,uuid)')
)
select
  (select count(*)=1 and bool_and(prosecdef and proconfig=array['search_path=""'])
    from close_rpc) as close_function_ready,
  (select count(*)=1 and bool_and(
    not has_function_privilege('anon',oid,'execute') and
    not has_function_privilege('authenticated',oid,'execute') and
    has_function_privilege('service_role',oid,'execute'))
    from close_rpc) as close_permissions_correct,
  not exists (
    select 1 from public.multiplayer_rooms r
    where r.visibility='public' and r.scoring_version=1
      and r.status in ('waiting','countdown') and r.started_at is null
      and r.current_question_number=0
      and not exists(select 1 from public.multiplayer_match_questions where room_id=r.id)
      and not exists(select 1 from public.multiplayer_submissions where room_id=r.id)
      and not exists(select 1 from public.multiplayer_match_results where room_id=r.id)
      and not exists(select 1 from public.multiplayer_match_history where room_id=r.id)
      and not exists(select 1 from public.multiplayer_players where room_id=r.id
        and (score<>0 or placement is not null or has_submitted_current_question))
  ) as unused_public_lobbies_upgraded;
```

These checks verify structure/access and current eligible rooms, not a full
security audit or proof of every deployed function body.

Hosted smoke test:

- Create a private room, use Safari Back without starting, and verify Return to
  Room / Close Room on both Multiplayer and Create Room. Return successfully.
- Back again, choose Close Room, then Keep Room: room must remain available.
  Confirm Close Room, then create another (subject to the existing 3 rooms per
  10 minutes limit). A second account must not have the Close control.
- With a game already started in another tab, a stale Close request must report
  that it was not closed; players and scores must remain available.
- Join a new public game, verify Give up is available, and check wrong −300,
  Give up 0 and the correct-answer speed bonus after the round closes. Ready,
  question timing and closed-round feedback must still work.
- Confirm a previously completed game's saved score and practice progress.

If needed, roll back the application deployment first. Keep 063 installed; do
not rewrite scores, downgrade active room scoring, delete rooms, or restore
browser RPC grants as a rollback shortcut.

## Intended files

```text
app/multiplayer/actions.ts
app/multiplayer/page.tsx
app/multiplayer/create/page.tsx
components/multiplayer/PrivateRoomRecovery.tsx
lib/services/multiplayerService.ts
types/multiplayer.ts
supabase/migrations/063_multiplayer_lobby_recovery.sql
tests/multiplayerLobby.test.mjs
tests/multiplayerLobbyRecovery.test.mjs
tests/multiplayerLobbyRecovery.database.mjs
tests/multiplayerLobbyRecovery.browser.mjs
tests/browserFixtures/lobbyRecovery.tsx
tests/browserFixtures/lobbyRecoveryActions.ts
docs/multiplayer-lobby-recovery.md
```
