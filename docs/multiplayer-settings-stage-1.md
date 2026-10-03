# Multiplayer room settings rollout

This stage adds public hosts, difficulty bands and longer question times. It is a local implementation, not a deployed change or evidence of 200-player capacity. Apply migration 057 before deploying the matching application during a quiet lobby window.

## Included behavior

- Public rooms retain 20 seats. The first fresh joiner becomes host; a departed or expired host is replaced by the earliest remaining active player. Rejoining does not reclaim hosting from a current host.
- Public questions use 90 seconds. New private rooms offer 30, 60, 90, 120, 150 or 180 seconds and retain 30 seats.
- Both hosts choose levels 1–3, 2–4 or 3–5. New rooms default to 2–4. All players see the confirmed band; public directory cards show it too.
- Only the authenticated current host with the current lobby connection can save difficulty. Changes lock during the final 10 seconds and once the game starts. Changing difficulty never extends the timer.
- Selection uses the server catalog, with enough unique questions required inside the selected division and band. Starting checks the settings version and band under the same room lock as joins and leaves.
- Active and completed rooms retain their original time, question selections and results. Existing private rooms retain their unrestricted pool until a host chooses a band. Pending public rooms are upgraded to 90 seconds and 2–4 without deleting their memberships.

No lobby Ready button, answer-scoring change, Give up action, per-round result redesign or loading optimization is included. Existing full-room auto-start behavior remains until the next stage. The existing question-loaded acknowledgement is not a player-controlled Ready button.

## Agreed later work

Ready must only shorten the normal countdown to at most 10 seconds, never extend it; a countdown already below five seconds keeps running unchanged. Use Give up, not Skip, and treat Give up like leaving the answer blank. Incorrect answers should cost a fixed 300 points, independent of time; scores may be negative. The correct-answer reward still needs to be settled: with five choices and blank worth zero, a fixed 1200 reward makes blind guessing equal to blank in expected points. Loading work is deferred until the user provides more feedback.

## Local checks

- TypeScript, ESLint and the production Webpack build.
- Unit coverage for all nine division/band combinations, sufficient unique questions, selection boundaries, settings validation, trusted identity and request fencing.
- Isolated PostgreSQL coverage in `tests/multiplayerSettings.database.mjs`: migration preservation, host handoff, expired connections, account deletion, final-countdown lock, stale settings, repeat requests, private time limits and RPC permissions.
- Browser coverage in `tests/multiplayerSettings.browser.mjs`, plus the existing lobby recovery and layout suites. API responses are mocked and external requests blocked; these are not hosted latency or concurrency tests.

## Deployment order

1. Review only the Stage 1 files. Leave unrelated account, security and migration files unstaged. Do not run an unrestricted database push just to apply this stage.
2. Test the migration and matching app against a staging database first. Schedule production application during a quiet lobby window; old app instances cannot start a newly band-limited room using the old unrestricted selector.
3. Apply only `supabase/migrations/057_multiplayer_room_settings.sql` in the intended project's SQL Editor. It is transactional and requests a schema-cache refresh. If it fails, stop and inspect the error; do not remove constraints manually or mark it applied.
4. Deploy the matching application and refresh open lobby pages. Do not deploy the application ahead of the migration: it requires the new RPC signatures and fields.
5. Run the read-only checks below, then manually check two-account hosting, band selection, public 90-second play and private 180-second play.
6. Record migration 057 in migration history only after successful application and verification, using the project's established reviewed repair process. A successful SQL Editor run alone does not update migration history.

```sql
select
  to_regprocedure('public.set_multiplayer_lobby_difficulty(uuid,uuid,text,text,bigint,uuid,uuid)') is not null as settings_rpc_ready,
  to_regprocedure('public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[],bigint)') is not null as versioned_start_ready,
  to_regprocedure('public.create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)') is not null as private_settings_ready;

select p.oid::regprocedure::text as function_name,
  not has_function_privilege('anon',p.oid,'execute')
    and not has_function_privilege('authenticated',p.oid,'execute') as browser_calls_blocked,
  has_function_privilege('service_role',p.oid,'execute') as server_can_call
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in
  ('set_multiplayer_lobby_difficulty','start_multiplayer_lobby','create_private_multiplayer_room');

select not exists (
  select 1 from public.multiplayer_rooms
  where visibility='public' and status in ('waiting','countdown')
    and (seconds_per_question<>90 or difficulty_band is null)
) as public_settings_correct;
```

The first check must return three true values. The permission query must return five rows, all true in both permission columns. The final check must be true. These checks verify configuration, not end-to-end behavior or data preservation on their own.

## Manual acceptance checks

- Join an empty public lobby with account A, then B. A alone sees difficulty controls. Save each band and confirm B sees the new selection.
- Leave with A. B becomes host and the public room remains usable. Try a stale tab: it must not change the new host's settings.
- At five seconds remaining, difficulty editing is locked and does not extend the countdown. Ready acceleration is not in this stage.
- Play a short public match; verify 90 seconds and questions within the chosen band. Confirm the replacement public lobby also uses 90 seconds.
- Create a private 180-second room, choose a band and start as host. A nonhost must not be able to change settings or start it.
- Check existing history and a previously running game's settings. This stage does not rewrite scores, ranking points, progress or bookmarks.

## Recovery boundaries

Before application, transaction failure rolls the migration back. After a successful migration, do not remove its columns or restore the old host-deletion trigger during active games. Prefer a reviewed forward fix; simply rolling back the app can block starts in new band-limited rooms. No database changes, commits, pushes or deployments are performed by the local test scripts.
