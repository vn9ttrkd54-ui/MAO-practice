# Stage 5 Llama Tutor reliability

This stage bounds Llama Tutor retries and loading states so a busy tutor cannot
keep polling indefinitely. It is an application-only change. No SQL migration,
new dependency, paid AI call, live data change, commit, push or deployment was
performed as part of this local implementation.

## Request behavior

The previous browser loop retried every 1.2 seconds for as long as the server
returned `429` with code `busy`. The new transport allows at most four attempts
per send: the initial request and three retries. Retries wait approximately
3 to 3.75, 6 to 7.5, and 12 to 15 seconds. Random variation spreads out clients
instead of repeatedly sending their retries together. Longer numeric server
hints are respected up to 15 seconds; a longer requested delay stops automatic
retries and leaves the question available for a later manual send.

Only an explicit `429 busy` response permits an automatic retry. The existing
reservation function returns that denial before starting new paid work. Network
failures, timeouts, invalid responses, other limit errors and server errors are
not automatically replayed because their outcome may be uncertain. Each accepted
POST can create a new paid request; this change does not introduce server-side
idempotency or a durable queue.

Each attempt has a 60-second deadline, covering fetch and the response body.
That leaves room for the unchanged 45-second provider deadline and server work.
The full send, including retry waits, has a 90-second deadline. Reaching a client
deadline or closing the tutor does not prove server/provider work was cancelled
and does not refund a reservation. The UI explicitly warns about uncertain usage.

## Interface and cleanup

- A synchronous in-flight guard blocks duplicate sends before React redraws.
- Busy waits show a waiting message and retain the pet's thinking bubble.
- Exhausted retries or failed replies restore the message to the input, retain
  earlier successful conversation turns, and avoid adding the failed message
  twice to the history on manual retry. This draft is temporary, not persisted.
- The allowance check has a 12-second deadline and a visible Check limit again
  action. Sending waits for a valid allowance result; failure never invents a
  full allowance. Closed tutors do not poll for allowance updates.
- Closing, hiding or unloading the page cancels browser work and clears temporary
  chat as before. Changing question or receiving an account-change notification
  also clears it. Same-account token refreshes do not interrupt a conversation.
- Old successes and errors cannot overwrite a newer panel after cancellation.
  Retry timers remove their abort listeners when finished.

Prompts, model configuration, answer protection, question content and pet artwork
are unchanged. The server retains its limits of 15 requests per account per day,
3 concurrent AI requests, 5 per account per minute and 12 globally per minute,
plus the existing shared token budget and durable accounting rules. The busy
response now provides a three-second retry hint and is explicitly not cacheable.

## Local verification

```sh
npm run test:tutor-safety
npm run lint
npx tsc --noEmit --incremental false
npm run build -- --webpack
node tests/stageFive.browser.mjs
node --experimental-strip-types tests/stageThree.next.browser.mjs
node --experimental-strip-types tests/stageFour.next.browser.mjs
git diff --check
```

The 318 unit/regression tests cover the retry cap and delays, request identity,
malformed payloads, complete-operation deadlines, cancellation, allowance limits,
unchanged accounting and unchanged budgets. A simulated 200-client all-busy wave
stops after 800 total attempts. This is an in-process transport test, not a hosted
load test or a demonstration of 200 simultaneous successful tutor conversations.

The browser regression exercises real tutor components and transport with mocked
local API/auth responses. It verifies double clicks, restored drafts, no duplicate
history, exhausted allowance, thinking/sleeping states, deadlines, manual recovery,
close/hidden/pagehide/unmount cancellation, question/account changes and stale
responses. Off-localhost requests are blocked. Waiting and error screenshots were
also inspected for readable text and layout.

All listed checks passed locally. The existing production-build browser checks
also passed for Question Bank navigation and guest Trainer sessions across Mu,
Alpha and Theta, using dummy credentials and blocked external traffic.

## Deployment checkpoint

1. Review and commit only Stage 5 paths. Leave unrelated security and account
   deletion files unstaged. No Supabase SQL or environment change is required.
2. Deploy through the existing application workflow and reload open question tabs.
3. Open the tutor while signed in. Check the daily count, send a short hint request
   and confirm the reply and updated count. This live check uses normal AI quota.
4. Check failed connections using a preview or local fixture: loading must end,
   the message must return to the input, and there must be no automatic resend
   after an ambiguous failure. Do not exhaust the production budget to test busy.
5. Close the tutor while waiting, then reopen it. Check that no old answer or
   error appears. Check account changes and next-question navigation as well.

Rollback is the matching application change only; there is no database rollback.
Saved progress, levels, match history and room memberships are not rewritten.

## Remaining scalability work

Dashboard/history reads, Trainer history persistence, Question Bank detail reads,
observability and authorized hosted load tests remain separate stages. Existing
AI capacity limits intentionally remain much lower than 200 simultaneous tutor
requests. A fair durable queue or higher AI capacity would require a separate
design and spending decision; bounded retries alone do not provide either.
