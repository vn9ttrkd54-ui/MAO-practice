# Stage 8 Question loading and bookmark reliability

Stage 8 reduces the work needed to open an individual Question Bank question and
makes failed progress reads and bookmark confirmations recoverable. Apply
`054_question_state_snapshot.sql` before deploying the matching application.
No hosted data was accessed or changed during implementation; nothing was
committed, pushed or deployed. Question text, answers, solutions and illustrations
are unchanged.

## What changed

The individual question page previously waited for a server-side user lookup just
to decide whether to show the tutor. The browser then read progress and bookmarks
separately, with another remote user lookup in the bookmark service. A failed
read silently became zero statistics and an unbookmarked icon. Progress reads
also returned timing samples that the statistics panel did not need.

The page now delivers the public question without that extra server-side lookup.
One authenticated `get_question_state` RPC returns the current user's progress
aggregates and bookmark together. Local session checks surround the request;
the complete read has a twelve-second deadline. The shared authentication proxy
and the server-verified answer and tutor endpoints remain unchanged. This does
not remove all authentication traffic or make private information public.

The question stays readable while personal data loads. Unknown statistics and
bookmark status are labelled as unavailable, not replaced with zero or false.
Submitting an answer and changing a bookmark wait for the initial state and
account to be confirmed. A failed later refresh keeps the last confirmed state
for that same account and offers Retry saved state.

Focus, page-show and visibility events refresh the snapshot, with one in-flight
request and a two-second coalescing window. There is no polling timer. Hidden
pages and unresolved bookmark changes do not start additional snapshot reads.
An older response cannot overwrite a newer answer result or bookmark change.
Account changes hide the previous account's state and require a reload; a
same-account token refresh does not discard the question. Unmounts cancel reads
and bookmark requests, and late answer confirmations cannot update another page.
Cancelling a browser request does not undo a write already received by the server.

The practice attempt is prepared only after the initial account/state check, not
again on each refresh. Existing answer-save identities, retries and server grading
remain in use. Guest answers use the question already displayed, avoiding a
deferred full-catalog download. Guest progress and bookmarks still stay in memory
for the visit and are not uploaded to a later signed-in account.

## Bookmark confirmations

The old toggle read the bookmark and then inserted or deleted it. Retrying after
a lost confirmation could reverse the user's intended change. The new flow
freezes the chosen state: add uses an insert that ignores duplicates, and remove
uses a user/question-scoped delete. There is one write and no preliminary read.

Only one bookmark request can be active. A timeout or error keeps the chosen
action for Retry bookmark; the normal toggle stays disabled until confirmation.
There are no automatic write retries. Repeating an add or remove is safe for that
same intent, but independent tabs are not a globally ordered command queue:
competing changes still depend on write order. The pending intent is held in
memory, so the notice asks the user to keep the page open until confirmed.

## Data and security boundaries

Migration 054 adds one `STABLE SECURITY INVOKER` function with an empty search
path and restricted execute grants. It requires `auth.uid()`, validates the
question ID, and explicitly filters both reads by that user, including for an
administrator. Existing table permissions and row-level security still apply.
Anonymous callers cannot execute the function. The browser validates the returned
owner, question ID and statistics before using them; local session data alone
does not authorize database access.

The function reads existing progress and bookmarks. It does not insert missing
progress, rewrite user records, change table policies, or remove data. It uses
the timing aggregates introduced by migration 044, already required by the
existing application. It returns lifetime counts and timing aggregates without
the historical timing array. A successfully read absent progress row legitimately
returns zero; a failed request never does.

Listing and detail read failures now show safe reference codes such as
`QB-PROGRESS-PERMISSION`, `QB-BOOKMARKS-SCHEMA` or `QB-DETAIL-TIMEOUT`. These identify
the read and broad failure category without displaying raw database messages,
tokens or user IDs. They are diagnostic clues, not a unique server-log ID or
proof of the root cause. The earlier hosted saved-progress warning still needs
its failed request or new reference code to diagnose.

## Measured work and bundle tradeoff

| Operation | Previous flow | Stage 8 |
| --- | --- | --- |
| Personal data on a signed-in detail page | Separate progress and bookmark reads | One compact RPC |
| Extra remote user lookups on that load path | Page lookup and bookmark-service lookup | Neither; local session checks remain |
| Bookmark action | User lookup, bookmark read, then write | Local owner checks and one explicit-state write |
| Timing data for statistics | Aggregates plus up to 100 samples | Aggregates only |

Authentication, attempt preparation and tutor activity can still make their own
requests. The snapshot uses the existing user/question keys for two scoped
lookups; it does not download the account's full history. In the local database
fixture with 1,105 saved questions, a snapshot containing 5,000 attempts and 4,000
correct answers is 245 JSON bytes, with exact lifetime timing aggregates. This
is a payload measurement, not a hosted latency or concurrent-capacity result.

Production Webpack measurements against baseline commit `ff22e4e`:

| Route entry, including its measured chunks | Before raw / gzip bytes | Stage 8 raw / gzip bytes |
| --- | --- | --- |
| Each Mu, Alpha and Theta listing | 279,579 / 77,071 | 279,964 / 77,278 |
| Individual question | 581,012 / 167,530 | 586,285 / 168,906 |

The individual question entry grows by 1,376 compressed bytes for the recovery
and account-isolation handling. This stage reduces request work and improves
failure behaviour; it is not a JavaScript bundle-size reduction. The counts use
the existing measurement script, not a claim about every byte sent on navigation.
No new runtime dependency, environment variable or subscription plan is required.

## Local verification

All 351 unit tests, lint, TypeScript and the production Webpack build passed.
The isolated PostgreSQL-compatible test applies the actual migrations and RLS
policies, excluding hosted cron migrations. Installing and reinstalling migration
054 and executing its reads leave fixture checksums unchanged across profiles,
levels, progress, bookmarks, Trainer sessions/results and practice attempts.
Tests also cover owner/admin isolation, anonymous denial, invalid IDs, duplicate
bookmark retries and cross-owner write denial. The Stage 7 database regression
passes with migration 054 present. These checks do not prove anything about the
current contents of the hosted database.

The Stage 8 browser fixture uses the real question component and services with
local authentication and network mocks. It checks slow reads, timeouts, retained
statistics, manual retries, double clicks, uncertain bookmark commits, stale
responses, account changes, unmounts, question switching, hidden tabs, guest-only
memory state and no answer-time catalog download. Desktop and mobile states are
visually checked. Existing listing and production guest navigation/Trainer
regressions are included; external browser requests are blocked.

Verification commands from the repository root:

```sh
npm run test:tutor-safety
npm run lint
npx tsc --noEmit --incremental false
npm run build -- --webpack
node scripts/measureQuestionBankBundles.mjs
node --experimental-strip-types tests/questionState.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
node --experimental-strip-types tests/trainerSessionSave.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js
node tests/stageEight.browser.mjs
node tests/stageThree.browser.mjs
node --experimental-strip-types tests/stageThree.next.browser.mjs
node --experimental-strip-types tests/stageFour.next.browser.mjs
git diff --check
```

The database tests use the existing local PGlite installation above; another
machine needs its own module path. They do not simulate 200 independent database
connections. No hosted load test was run.

## Rollout order

1. Review only Stage 8 changes. Leave unrelated account-deletion and security
   files unstaged. Confirm the previous stages, including migration 044's timing
   aggregates, are installed.
2. Apply only the reviewed `054_question_state_snapshot.sql` through the existing
   migration workflow. Inspect the dry run first; stop if unexpected migrations
   are listed. Do not reset the database or blindly push all pending migrations.
3. If the CLI connection issue returns, run the exact migration file in Supabase
   SQL Editor. Reconcile migration-history version `054` only after successful
   execution and verification; do not mark unrelated versions as applied.
4. Run the read-only SQL below in SQL Editor, not the Mac terminal. Expect one
   row with every value `true`. No row means the function is missing. Do not use
   the SQL Editor administrator session to test a normal user's personal snapshot.
5. Deploy the matching application through the existing Git/Vercel workflow,
   then reload the Question Bank.
6. With a test account that has existing progress, open a previously answered
   question. Check its attempts, accuracy, times and bookmark against the prior
   values. Add and remove a bookmark, refresh and verify the chosen state persists.
   Submit an answer, retry a question and test previous/next/back navigation.
7. In a local or preview test, interrupt a read and confirm the question stays
   readable with a retry notice rather than zeroed statistics. Interrupt a bookmark
   confirmation, restore connectivity and use Retry bookmark without reloading;
   confirm it repeats the intended add/remove. Also test account switching and
   a guest visit, including that guest activity is not uploaded after sign-in.

```sql
select
  not p.prosecdef and p.provolatile = 's' as read_only_invoker,
  has_function_privilege('authenticated', p.oid, 'execute') as signed_in_can_read,
  not has_function_privilege('anon', p.oid, 'execute') as anonymous_blocked
from pg_proc p
where p.oid = to_regprocedure('public.get_question_state(integer)');
```

If the application needs rolling back, restore the previous application
deployment. The additive read-only function can remain installed; no user-data
deletion or restore is needed to undo this application change. The older loading
and toggle limitations return until the new version is working.

## Remaining limits

The original hosted listing failure is not diagnosed from its screenshot alone.
If it recurs, record the safe reference code and the failed request's status in
the browser, without sharing credentials. This stage does not establish that
all live data is intact or that the site supports 200 simultaneous users.
Production latency/error measurements and an authorized traffic test are still
needed before making that capacity claim. No additional architecture stage is
included in this change.
