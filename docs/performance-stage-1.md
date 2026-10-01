# Stage 1: readable screens and recoverable connections

This is the first, reviewable stage of the architecture work. It does **not** establish 200-user capacity. No migration, new dependency, environment variable, deployment, or data cleanup is required for this stage.

## Changes

- Keep the existing light visual design in both OS color schemes. Previously, the dark-mode media query made inherited question text almost white while cards stayed light.
- Show a practice loading screen, including the division pages' previously empty Suspense fallbacks. Stream the navigation's account controls separately so their account lookup does not hold up the rest of the page. Server-side authentication and authorization checks remain unchanged.
- Use the same 30-second heartbeat freshness window for public lobby listings, join capacity checks, reconnection, and waiting/countdown player lists. Six missed five-second heartbeats allow a brief network interruption without immediately hiding the player.
- Allow rejoining an abandoned public membership even if its old `connected` flag is still true. Compare the stored timestamp during reconnection, so a concurrent successful heartbeat or rejoin is not overwritten using an older read. Recently active memberships still reject duplicate joins.
- Keep active-match membership, scores, answers, and result history intact. Lobby expiry changes presence, not membership. Waiting/countdown memberships with stale presence no longer appear as active in the personal room lookup.
- Bound lobby/spectator reads at eight seconds, including response-body reads. Display a reconnect notice and retry control, release the single-flight slot on timeout, and cancel outstanding reads on unmount. Tab-close notification remains best-effort; recovery does not depend on receiving it.
- Bound practice attempt creation, saves, and account checks at twelve seconds per operation. A timed-out write may already have committed: retry the **same** attempt ID, original answer, and original time, never mint a replacement or silently submit a second answer.

## Local validation

Verified locally: 285 automated tests, TypeScript, lint, a production build, the stage-1 browser checks, and the existing multiplayer countdown/submission browser regression all pass. These are local results, not deployed-site or 200-user measurements.

From the project directory:

```sh
npm run test:tutor-safety
npx tsc --noEmit --incremental false
npm run lint
npm run build -- --webpack
node tests/stageOne.browser.mjs
git diff --check
```

The browser test needs a fresh build for production CSS and a Playwright Chromium installation. It uses the actual lobby/spectator components with mocked APIs and an isolated local server. It makes no live database calls. The presence tests execute the real service code against an in-memory query fixture; they are not a live concurrent PostgreSQL load test.

## Review on a preview deployment before production

1. Open a question and trainer on devices using light and dark mode. Text and formulas should stay dark on light cards.
2. Slow the connection and navigate to Practice / Mu / Alpha / Theta. Check that loading feedback is visible and navigation remains available.
3. Join a public waiting room, then close the tab without pressing Leave. After more than 30 seconds from its last heartbeat, rejoin with the same account. It should reuse the membership. Immediately joining from another tab while the first is active should still be rejected.
4. Repeat with a public countdown. A departed player's stale presence should not count toward the two-player start requirement. Check that an in-progress match can still be rejoined with its score intact.
5. Interrupt networking in a lobby or spectator view. A reconnect notice should appear; restoring networking should resume updates without refreshing the page.
6. Interrupt a practice save, restore networking, and choose Retry save. The original answer should be counted once. Check that switching accounts still prevents saving another account's attempt.

## Deliberately left for later stages

- Lean question metadata, shorter navigation URLs, progressive question lists, and fewer repeated progress/auth reads.
- Removing triple lobby reads and whole-directory refreshes; tutor busy-retry backoff.
- Database-clock presence leases with per-tab fencing, explicit takeover, and independent cleanup. This stage reuses the existing `updated_at` heartbeat and is not a complete tab-ownership protocol; an old tab's leave request is not yet fenced.
- Transactional public capacity/join/start operations. Timestamp comparison protects stale reconnection only; it does not make all room admission/start steps transactional.
- Durable dashboard history reads, instrumentation, and staged 25/50/100/200-user hosted tests.

Stop after stage 1 for review. Do not apply unrelated pending migrations or deploy later stages as part of this checkpoint.
