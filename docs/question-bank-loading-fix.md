# Question Bank saved-state loading repair

## What changed

The screenshots show question content already loaded while saved progress,
statistics and bookmarks wait. Both old read services awaited browser Auth before
and after fetching Supabase data. A pending initialization/refresh could consume
the read deadline without delivering any saved state. No live request trace was
available to attribute the reported 30-second delay to a particular provider call.

Signed-in listing and detail reads now use one same-origin request to
`GET /api/practice/question-bank/state`. They do not await browser `getSession()`.
The server verifies the current user once, then uses the ordinary user-scoped
Supabase client and existing RLS. Listings retain concurrent, indexed, paginated
progress/bookmark queries; details retain the compact `get_question_state` RPC.

The endpoint bounds Auth plus database work to eight seconds and cancels outbound
fetches. The browser retains its twelve-second whole-response deadline. These are
failure limits, not intentional waits or a promised hosted response time.

## Security and data preservation

- The browser cookie owner hint is only a UI race guard, never authorization.
  The server independently verifies the session, checks the requested owner, and
  enforces account setup. Forged owner hints cannot authorize database reads.
- Only this exact read-only route skips the root proxy's duplicate Auth refresh;
  it performs its own bounded authentication. Other routes are unchanged.
- Responses are `private, no-store`, vary by cookie, and contain only saved-state
  fields. No service-role key or shared user-data cache is used.
- Account changes discard stale responses. Failed reads are not empty successes;
  existing UI behavior preserves a last confirmed same-account snapshot.
- Guests keep local progress and bookmarks. Damaged session cookies fail closed.
- No tables, RLS policies, saved records, scoring or multiplayer behavior change.
  Answer submission and bookmark mutations retain their existing protections.

## Local verification

```sh
cd /path/to/mao-practice &&
node --experimental-strip-types --test tests/*.test.mjs &&
npm run build -- --webpack &&
node tests/stageThree.browser.mjs &&
node tests/stageEight.browser.mjs &&
node --experimental-strip-types tests/stageThree.next.browser.mjs
```

Coverage includes stalled browser Auth, malformed/chunked session cookies,
wrong-account requests, incomplete setup, safe errors, aborted requests, Auth and
database deadlines, more than 1,000 progress records, filtering, bookmark retries,
late responses, account switching and guest practice. Browser tests use synthetic
accounts, not production accounts. The production-navigation fixture blocks
external browser requests and uses a loopback Auth stub.

`tests/questionState.database.mjs` additionally exercises the actual migrations
and RLS in an isolated PGlite database, with record checksums before/after reads.
Its Auth fixture now includes the existing signup requirements from migration 066.

## Rollout and hosted check

Deploy the application changes together using the usual Git/Vercel workflow.
**No new SQL, migration repair or Supabase setting change is required.** Existing
migration 054 is still required, as it was before this repair.

After deployment, sign in and open each Question Bank division, then question
10238. Confirm saved markers, statistics, bookmark changes and return navigation.
Repeat a refresh and leave/return to the tab. Confirm another account cannot
inherit the prior account's state.

In Safari's Network panel, the new request is named `state`, with a URL starting
`/api/practice/question-bank/state`. Its response headers include `Server-Timing`
with `auth` and `data` durations, plus `X-Mao-Request-Id`. If it is still slow,
record those durations, status and request ID; do not share cookies or tokens.
Those distinguish time spent verifying the account from time spent reading data.
Local passing tests do not establish hosted latency.

Rollback, if needed, is an application redeploy of the previous version. No
database rollback or deletion is involved.
