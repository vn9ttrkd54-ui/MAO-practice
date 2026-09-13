# Practice attempt rollout

Local implementation only. Obtain deployment approval, verify the intended Supabase/Vercel projects, and rehearse using disposable staging accounts. Migration 043 and its matching application must ship together. Do not apply unrelated pending migrations or run automated probes against real accounts.

The current app also requires migration044 and the [bounded timing rollout](./practice-timing-rollout.md). That migration replaces the v1 finish RPC with v2 and adds lifetime timing fields; coordinate the combined change rather than deploying this older phase alone.

## Coordinate the change

The new client opens a server-owned attempt when a question is displayed. The result endpoint accepts that attempt only for the authenticated owner, original question, and original practice/trainer mode. Retries cannot increment progress again. The old scoring RPC is retired because otherwise an old deployment could keep accepting unguarded results.

1. Inspect the pending migrations and deployed revisions, including previews sharing this database. The earlier tutor accounting migration 041 has its own required [gate/drain procedure](./tutor-accounting-rollout.md); this document does not replace it.
2. Temporarily gate legacy practice writes using an authorized database administrator connection, then commit:

   ```sql
   revoke execute on function public.record_verified_practice_result(uuid, integer, text, integer, boolean)
     from public, anon, authenticated, service_role;
   ```

3. Verify effective execution permission is false for all application roles, and drain any already-running or queued legacy scoring invocations/transactions. Verify hosting invocation status and database activity/locks with sufficient visibility; a fixed sleep does not prove drain. Investigate owner-level callers or other grants rather than assuming the gate covers them. Do not terminate sessions blindly. During the brief gate, pages remain readable but practice saves are unavailable.
4. Deploy the reviewed application while writes are gated, then apply the reviewed migrations in order. The new app against the old database fails closed: it cannot create an attempt or silently fall back to legacy scoring. Migration 043 grants only the guarded begin/finish RPCs to the server role. Leave legacy execution revoked.
5. Refresh older open practice tabs. An old client has no attempt ID and cannot save through the new endpoint. It must start a fresh question attempt after reloading; do not add a compatibility fallback that creates attempts on submission.

## Verify on staging, then ordinary production smoke checks

- Signed-in question bank: open, answer, save, view solution/tutor access, then use Try Again to record a genuine new attempt.
- Trainer: correct, incorrect, Give Up, Next, end session, and existing level progression. Multiplayer RP and countdowns are not changed.
- Response-loss test on disposable staging: allow the server to commit, discard the response, and retry. There must be one increment, not two; a changed answer or mode must not overwrite the first result.
- Guest practice remains local. Two tabs can have independent attempts. Switching accounts mid-question must require restarting it, never saving into the other account.
- Confirm browser roles cannot read/write the attempt tables or execute either RPC. Confirm the retired scoring RPC remains denied even to `service_role`.
- Per-account limits are rolling 60 new starts and 30 new results per minute, not IP-based bans or daily quotas. Matching retries are exempt. Verify window expiry and independent accounts locally/staging, not with a production burst.
- An unfinished attempt expires after 24 hours; a completed result is retryable for 24 hours after submission. Cleanup happens opportunistically for that account. A pruned attempt ID is invalid and can never be resubmitted for credit.

If rollback is needed, keep practice writes gated and use a forward-compatible fix. Never reopen the retired RPC as a workaround or drop recorded progress/attempt records. No production changes have been performed by the local test suite.

## Limits of this protection

Attempt IDs provide replay protection, not proof of a human. A bot can still request fresh attempts at permitted rates, and practice answers remain intentionally public. Practice elapsed time remains client-reported and is not used as a reason to ban fast users. Provider/edge bot controls and stronger server-controlled trainer selection remain separate work. Bounded timing storage is implemented in migration044 and its matching app/runbook. Expired rows belonging to an inactive account remain until its next request or account deletion; a scheduled cleanup policy is still a follow-up.
