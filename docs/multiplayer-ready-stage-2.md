# Multiplayer Stage 2: public-lobby Ready

Local implementation only. Applying a migration, recording its history, and deploying the app are separate rollout steps; local tests do not verify the hosted database.

## Rules

- Every connected, signed-in public-room player can choose **I'm ready** or **Not ready**. This is not limited to the host.
- Public rooms still wait for two active players and normally count down from 60 seconds.
- With at least two active players, everyone ready shortens the remaining countdown to at most 10 seconds. A countdown already at 9 seconds, 5 seconds, or past its deadline is never extended.
- Being full no longer starts a public room immediately. An unready full room uses the regular countdown.
- Choosing Not ready or admitting another unready player does not extend a countdown that was already shortened. Dropping below two active players returns to the existing waiting state; a later second player starts a fresh countdown.
- Changing difficulty invalidates everyone's readiness. A new connection, disconnection, or stale presence invalidates that player's readiness.
- Departure, disconnection, expired presence, and account deletion re-evaluate the remaining active players. Normal heartbeats do not publish additional Ready events.
- Private rooms keep their existing host-controlled Start Game button. There is no private Ready auto-start.
- The UI displays only server-confirmed readiness and deadline changes. It does not optimistically start a countdown. An ambiguous failed request is retried with its original desired value.

No scoring, Give up, Skip, per-question results, or loading changes are included. Public 90-second questions, private maximum 180 seconds, and Stage 1 difficulty bands remain unchanged.

## Data and security

Migration `060_multiplayer_lobby_ready.sql` requires `059_multiplayer_room_settings.sql` and the earlier lobby lifecycle migrations.

The new nullable player column stores the room settings version to which the player agreed. No existing scores, answers, profiles, progress, room settings, or match history are rewritten. Readiness is true only for a fresh, connected player in a pending public room whose saved settings version matches the room.

The new POST `/api/multiplayer/rooms/[id]/lobby/ready` is distinct from the existing `/api/multiplayer/rooms/[id]/ready` question-loaded acknowledgement. It validates same-origin requests, UUIDs, an explicit boolean, a safe settings version, and a 1 KiB body limit. It derives the user identity on the server, never from the browser-supplied body.

One identity check and one service-only, room-locked RPC validate membership, connection incarnation, settings version, room visibility, freshness, and room state. Browser roles cannot execute the RPC or its internal helpers. No table grants or RLS policies are broadened. Lobby JSON exposes a readiness boolean, not raw connection credentials or the new internal readiness version.

The database deadline guard also applies to older app instances that try to start a full room. Duplicate Ready requests do not produce duplicate state changes or events. A Ready update returns its confirmed snapshot, so its initiating browser needs no extra read. Other browsers retain the existing coalesced real-time hint/read mechanism and five-second presence heartbeat; no new recurring polling is introduced.

This is bounded per-room work (public room capacity remains 20), not a proof of 200 concurrent users. Hosted concurrency, database latency, realtime delivery, and account/connection behavior still require a separate measured load test.

## Rollout order — only when authorized

1. Finish and verify the existing 057/058/059 migration-history reconciliation first. The prior guarded history-repair artifact checks the exact Stage 1 function bodies. It is intentionally incompatible with the newer bodies installed by 060; do not weaken its checks or rerun it after 060.
2. Choose a quiet window and verify the target Supabase project. Keep the existing app deployment available for rollback. Read this migration before applying it; it only changes pending-lobby behavior and adds nullable state.
3. Apply **060 only**, through the reviewed normal migration path or Supabase SQL Editor. Do not use a blanket database push while unrelated/unrecorded migrations remain. A successful SQL Editor execution does not automatically add CLI migration history.
4. Run the read-only checks below. If the migration timed out or its outcome is uncertain, inspect the database before retrying. The migration is transactional, but a lost client response does not tell you whether it committed.
5. Record 060 as applied only after its actual installation is verified. Do not mark it applied just to clear a CLI error. If the temporary CLI login path hangs again, stop and prepare a guarded history-only fallback rather than reapplying old migrations.
6. Deploy the matching app changes, then use two separate signed-in accounts for the smoke checks below. This document does not perform a commit, push, migration, or deployment.

Run this in **Supabase SQL Editor**, not Terminal. All four values should be true:

```sql
with target as (
  select to_regprocedure(
    'public.set_multiplayer_lobby_ready(uuid,uuid,boolean,bigint,uuid,uuid)'
  ) as oid
)
select
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='multiplayer_players'
      and column_name='lobby_ready_settings_version' and data_type='bigint'
  ) as ready_column_present,
  oid is not null as ready_function_present,
  coalesce(not has_function_privilege('anon',oid,'execute')
    and not has_function_privilege('authenticated',oid,'execute'),false)
    as browser_calls_blocked,
  coalesce(has_function_privilege('service_role',oid,'execute'),false)
    as server_can_update_ready
from target;
```

These checks confirm presence and permissions, not exact function bodies or behavior. Use the smoke checks too. After history recording, verify separately:

```sql
select version, name from supabase_migrations.schema_migrations
where version in ('057','058','059','060') order by version;
```

Expected names: `google_auth_public_names`, `signup_role_function_permissions`, `multiplayer_room_settings`, and `multiplayer_lobby_ready`, respectively. Never infer a migration's contents solely from its history entry.

### Live smoke checks

- Join a public lobby with two accounts. With only one ready, the normal timer continues. The other player's badge should update without refreshing.
- Ready the second player while more than 10 seconds remain: countdown becomes 10 seconds or slightly less due to delivery time, never higher than its previous value.
- In another match, Ready the last player below 5 seconds: countdown continues without jumping upward.
- Before the final 10 seconds, change difficulty as host. Everyone must confirm Ready again. Refresh one player's page and confirm only their Ready clears.
- Leave or disconnect an unready third player while two ready players remain. The remaining countdown should shorten, not restart. With fewer than two active players the lobby waits.
- A private room still starts only when its host chooses Start Game. Test entering and finishing a game with existing scores/results intact.
- Confirm the Ready response is `200` with `Cache-Control: no-store`. A stale settings/connection request should fail safely instead of changing another player's state.

### Rollback boundary

If app behavior fails, revert the app deployment first and investigate. Do not drop the readiness column, replay 059, or reset the database in a live match. The older UI will not offer Ready; 060 still enforces the regular timer for full public rooms. A database rollback would need a separate reviewed migration and authorization.

## Local verification

Implementation-run results (2026-10-03): 398 unit/regression tests passed; 12 new isolated Stage 2 database scenarios and 9 Stage 1 database scenarios passed; lint and the production webpack build passed. The standalone Playwright runner was blocked at browser launch by the macOS sandbox. Its full browser suite is therefore still pending, not passed. A separate in-app-browser check of the real lobby components with a local mocked server verified Ready badges/counts, the 10-second display, no deadline reset after the last five seconds, difficulty resets, private Start Game, and no horizontal overflow at 390 px and 1280 px. No hosted database or real multi-account session was used.

- `node --experimental-strip-types --test tests/*.test.mjs`
- `npm run lint`
- `npm run build -- --webpack`
- `node tests/multiplayerLobbyReady.database.mjs /absolute/path/to/@electric-sql/pglite/dist/index.js`
- `node tests/multiplayerSettings.database.mjs /absolute/path/to/@electric-sql/pglite/dist/index.js`
- After building: `node tests/multiplayerLobbyReady.browser.mjs`, `node tests/multiplayerSettings.browser.mjs`, `node tests/stageOne.browser.mjs`, and `node tests/multiplayerLobbyStyle.browser.mjs`.

The isolated database test exercises PostgreSQL functions and triggers, not hosted concurrency. Browser tests use real components with mocked application traffic; no Supabase writes occur. `READY_SCREENSHOT=/absolute/path.png` optionally captures the public lobby for visual review.

## Intended files

```text
app/api/multiplayer/rooms/[id]/lobby/ready/route.ts
components/multiplayer/PrivateLobby.tsx
components/multiplayer/useLobbyConnection.ts
lib/apiMetrics.ts
lib/services/multiplayerService.ts
types/multiplayer.ts
supabase/migrations/060_multiplayer_lobby_ready.sql
tests/apiMetrics.test.mjs
tests/apiMetricsRoutes.test.mjs
tests/multiplayerLobby.test.mjs
tests/multiplayerLobbyReady.database.mjs
tests/multiplayerLobbyReady.browser.mjs
docs/multiplayer-ready-stage-2.md
```

Do not stage unrelated account-deletion, security, or older migration files as part of this stage.
