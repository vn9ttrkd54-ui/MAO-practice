# Stage 2: confirmed lobby leave and lightweight live updates

This is a local implementation checkpoint, not a production deployment or a
200-user capacity certification. Keep Stage 1's loading/contrast/request-deadline
changes. Do not include unrelated account-deletion or security work accidentally.

## Behavior

- Leave Room shows “Leaving room…” immediately and navigates away only after the
  server confirms removal. Private hosts explicitly confirm closing their lobby.
- A missing response times out after eight seconds. Retry leave uses the same
  connection ID, so a committed leave with a lost response is safe to check again.
  Heartbeats stop while leaving, including after an ambiguous timeout.
  A guest's now-inert room cookie is retained until its existing one-day expiry
  or rejoin so losing the response body cannot remove the ability to retry. The
  deleted database membership, not cookie deletion, revokes room access.
- Join, connect, disconnect, leave and start serialize on the room row. If leave
  commits first, that player is excluded. If start commits first, the client says
  the game already started and offers Rejoin Game; it does not pretend to leave.
- Start saves the selected questions, final roster, initial readiness deadline,
  room transition and replacement public queue in one transaction. A failure
  rolls back all of them. Scoring, question selection rules and game clocks are
  unchanged; disconnected private-lobby members are excluded as well as public ones.
- Reloads use a stable tab ID plus a fresh connection ID and increasing generation.
  Old disconnect/heartbeat/leave requests cannot affect a newer connection. A
  disconnect that arrives before its connect also prevents that delayed connect
  from restoring the departed page.
  Presence is also bound to the current player-row ID. A deliberate public
  stale-seat rejoin replaces that old lobby-only seat, so an abandoned page cannot
  claim the new membership before its new browser connection arrives.
- Normal navigation/tab close sends a best-effort disconnect. Crashes, network
  loss and browser-throttled tabs still use a 30-second freshness window, plus the
  next successful viewer refresh. Neither tab-close delivery nor exact latency is
  guaranteed. A stale tab cannot exceed capacity even with a late heartbeat.
- Disconnect only expires lobby presence. Explicit leave removes the lobby
  membership. Neither operation removes a player from a game that already started.

## Request and update costs

- Lobby live events are hints: coalesce for 100 ms, then read one authenticated,
  read-only database snapshot. Never apply arbitrary broadcast payloads as roster
  truth. Actual snapshot versions reject older updates.
- Ordinary lobby presence requests use one verified identity lookup and one RPC
  per handler instead of repeated room/player/name/rating requests. A due start
  additionally calls the atomic start and rereads its resulting snapshot.
- Keep the existing five-second lobby heartbeat as recovery; no one-second poll.
  Routine heartbeat timestamps and connection metadata do not broadcast roster
  changes. Actual roster transitions bump the room version once.
- Public room events refresh just the cards from a public-only endpoint, not the
  entire server-rendered multiplayer page. Bursts coalesce; one trailing read
  after the one-second shared CDN cache expires avoids holding a stale icon.
  A mount-time followup covers events missed before subscribing, and a newer
  room version already on a card cannot be replaced by an older cached roster.
- The endpoint has no personalized fields or cookies, bypasses session refresh
  only for its exact GET/HEAD path, and marks errors non-cacheable. Other endpoints
  and mutations retain session handling. Confirm CDN cache behavior in preview;
  local browser mocks do not validate Vercel's cache.
- Directory backup reads stay at ten seconds. History/rating/ongoing sections
  refresh on observed match-phase changes and a sixty-second backup, not every
  roster or answer event. Hidden directories do not issue background refreshes.

The normal-network target is roughly 1–3 seconds for an accepted leave to become
visible to other viewers. Timeouts, missed events and network outages use slower
recovery paths. This is a target, not a measured hosted latency promise. At 200
lobby clients the five-second heartbeat alone averages about 40 presence requests
per second, before auth, live-event reads, directory traffic and game actions.
Actual plan limits, extra tabs/spectators, fan-out, database latency and cache hit
rate still require a representative staging load test before claiming capacity.

## Validation

- `npm run test:tutor-safety`: unit and regression suite, including new route,
  identity, connection-generation, shared-cache and session-bypass checks.
- `node tests/stageOne.browser.mjs`: actual components with mocked APIs and a
  controlled clock; leave confirmation, lost-response retry, start-wins feedback,
  navigation fencing, 200-event burst coalescing, directory updates, timeout
  recovery and original light/dark readability. An event burst is not 200 users.
- `node tests/multiplayerClient.browser.mjs`: existing active-match UI regression.
- `node tests/multiplayerLobby.database.mjs /path/to/@electric-sql/pglite/dist/index.js`:
  actual migrations in isolated PostgreSQL; ordered leave/start outcomes,
  transactional rollback, capacity/expiry, stale generations, host close, guest
  isolation, non-broadcasting heartbeat and function grants. PGlite exercises
  transaction orderings, not simultaneous multi-connection contention.
- Existing `multiplayerArchitecture.database.mjs` with the same PGlite argument
  checks scoring, readiness, scheduled rounds, finalization and retry safety.
- TypeScript, lint, production Webpack build and diff-whitespace checks.

## Reviewed deployment sequence (not executed here)

1. Review the local diff and pending migration list. Back up as usual. Confirm
   predecessor migrations, especially the room-lifecycle schema in 049, exist on
   the target. A SQL-Editor-applied migration may need separate history review;
   do not blindly reapply or repair migration history.
2. Test migration `051_multiplayer_confirmed_lobby_transitions.sql` on staging.
   It adds three player connection fields and service-role-only functions; it
   creates no cron job and does not remove existing room/player data.
3. Review a linked dry run. Apply the approved database migration before the app
   deployment. Do not blindly push unrelated pending migrations.
4. Deploy the matching app change during a quiet lobby window. Reload open lobby
   tabs: the new protocol uses POST for fenced presence, GET only for reading,
   and DELETE with a connection ID for explicit confirmed leave. Old GET-only
   lobby clients no longer renew presence and old bodyless DELETE calls are rejected.
5. In two browsers, test public leave, private guest leave, private-host close,
   quick navigation/reload, duplicate tabs, network loss, and leave at game start.
   Verify room-list icons and counts disappear after acceptance; verify a
   start-wins response retains a working Rejoin Game link.
6. Confirm public responses never set account cookies, private lobby responses
   remain `no-store`, new RPCs deny anon/authenticated execution, and check actual
   notification latency and request/error rates. Run an authorized staging load
   test with 200 realistic users before widening rollout.

If the app needs rollback, retain the additive database columns/functions and
roll back the matching app deployment together. Do not drop live connection data
or reset production room tables. The earlier app does not provide this stage's
confirmed-leave and atomic-start guarantees.
