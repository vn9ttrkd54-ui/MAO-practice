# Stage 4: batched Daily Trainer selection

Local implementation checkpoint only. No migration, new dependency, database
cleanup, commit, push, or deployment was performed. Preserve the earlier Question
Bank improvements, Practice theme, and unrelated security/account-deletion files.

## Changes

- Trainer's server page supplies only ID, number, division, topic and difficulty
  metadata. Neither the initial selector nor summary imports the full catalog.
  All 1,010 metadata entries serialize to 83,803 bytes, versus 710,032 bytes for
  the full catalog, before transport compression. Full metadata still travels in
  the page payload; this is not server-side pagination.
- Each selection reads the current account's progress in ordered 500-row pages,
  scoped by the indexed user/question range and filtered to exact division IDs.
  Read only selection fields, not timing arrays, bookmarks or session history.
  Guests use the existing in-memory snapshot and make no progress database calls.
- Current divisions fit in one page. Progress database reads per selection fall
  from 325/267/418 for Mu/Alpha/Theta to one each. Larger saved histories paginate
  explicitly; the regression covers 1,105 entries. These are progress-read counts,
  not total HTTP requests: session handling, question delivery and verified
  attempt/result requests still have their own work.
- Read the starting level once when starting, alongside progress. Do not read it
  on the unused setup screen or again on every next-question click. A missing
  level row displays the existing default; the existing verified-result RPC
  initializes it on save. The selection read itself never inserts a level row.
- Selection rules are unchanged: 30-day correct-answer cooldown and existing
  all-cooled-down fallback, random starting difficulty, adaptive thresholds,
  topic weights, proficiency/review weighting, session retry queue, previous-
  question exclusion and every-tenth-question challenge.
- Deliver only the selected full question through
  `GET /api/practice/trainer/question?id=…`. This reads the checked-in public
  catalog only, returns the same question/solution already exposed by Question
  Bank, and performs no database read/write in the handler. Existing proxy
  session handling remains enabled; responses are `no-store`, not shared-cache
  responses. Invalid/unknown IDs return 400/404. No mutation method is exported.
- Guest answer checking uses the already displayed Trainer question instead of
  dynamically importing every division. Signed-in correctness, levels and saves
  remain server-verified through the existing attempt/result flow. Question Bank's
  existing guest fallback is unchanged.
- Start and Next are single-flight, display loading feedback, and have a shared
  twelve-second deadline covering authentication, progress, level and response
  body reads. Unmount cancels selection. A failed next read leaves the existing
  question, answer, solution, stats and retry button intact.
- Verify selection ownership before and after reads/delivery, pin each attempt
  to that owner before preparation, and bind history saves to the session owner.
  An account change during an active session stops selection and offers reload;
  it cannot silently attribute the session to a different account. No new shared
  personal-data cache or background polling was introduced.

## Local measurements

Baseline: production Webpack build of `a7cad0c` (Stage 3 plus Practice theme).
After: this Stage 4 build. Sum each unique JS chunk referenced by TrainerClient
once, and gzip each locally, using `scripts/measureTrainerBundles.mjs`.

| Trainer client entry | Before | After |
| --- | ---: | ---: |
| JavaScript | 1,291,542 B | 604,823 B |
| Gzipped JavaScript | 363,117 B | 173,075 B |

Approximately 53% less initial JS, 52% less gzipped JS. This does not include
layout chunks, CSS, fonts, metadata/RSC or selected-question JSON. It is not an
end-to-end latency measurement, billing estimate, or 200-user capacity claim.

## Verification

```sh
npm run test:tutor-safety
npm run lint
npx tsc --noEmit --incremental false
npm run build -- --webpack
node tests/stageFour.browser.mjs
node --experimental-strip-types tests/stageFour.next.browser.mjs
node --experimental-strip-types tests/stageThree.next.browser.mjs
node scripts/measureTrainerBundles.mjs
git diff --check
```

All 306 unit/regression tests passed locally. The selector produced identical
IDs to the pre-refactor implementation in 960 seeded cases across three divisions
and eight progress scenarios. A recorded digest preserves this comparison.
Every delivered question is compared to its original full catalog entry.

The component browser regression uses the real Trainer/services with mocked
local requests: no setup reads, double-click coalescing, start/next timeouts,
same-attempt save retries, no premature solutions, retained current question,
account changes, cancellation after unmount, and guest summaries without a
catalog download. The production Next test exercises all three divisions with
guest start/give-up/next/summary/restart. Question Bank navigation also passes.
Browser traffic cannot leave localhost and server credentials are dummy values.

## Deployment checkpoint

1. Review and commit only Stage 4 paths; do not stage unrelated audit files.
2. No SQL is required. Deploy the matching application changes through the
   existing workflow after approval, then reload open Trainer tabs.
3. Check a signed-in session and a guest in each division: start, submit/give up,
   next, end, review link, and start another session. Confirm saved levels and
   earlier history are still present.
4. Slow or interrupt the network during Start or Next. The loading state should
   stop with a retry message; Next failure must retain the prior solution/stats.
   A save retry must keep the original answer and attempt.
5. Switch accounts in another tab during a session. Trainer should offer reload,
   not show the next account's progress as part of the original session.

Rollback is the matching application commit only; no database rollback is needed.
This stage does not rewrite question content, existing progress, levels, history,
multiplayer memberships, or any live records.

## Still separate work

Trainer history's multi-write persistence/retry protocol and broader dashboard
history reads are unchanged apart from owner binding. Question Bank detail reads,
tutor busy-retry backoff, observability and authorized staging load tests at
25/50/100/200 users remain separate stages. At much larger catalog sizes, consider
server-side selection/metadata pagination and versioned static question delivery
after measuring this simpler implementation. Do not assume local tests establish
hosted database, auth, realtime or hosting-plan capacity.
