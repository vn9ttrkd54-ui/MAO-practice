# Tutor daily-slot rollout

Status: local implementation only; no hosted migration, deployment, paid request
or provider setting change. This uses the existing database and tutor budget, not
a paid Supabase feature. CAPTCHA, paywalls and paid add-ons remain excluded.

## What changes

Migration `046_ai_tutor_daily_slots.sql` closes the late-completion daily-quota
gap in 041. Admission now checks:

`counted answers + unresolved, uncounted requests < configured daily limit`

Both counts belong to the same account and the original Eastern date. An expired
90-second concurrency lease no longer frees a daily slot. Known failed outcomes
settle their token usage and free an uncounted slot; unknown outcomes keep their
token and daily holds until their outcome is resolved. A successful response
converts its pending slot into a counted answer once, including when token usage
is still unknown. Conflicting retries after exact settlement stay immutable.

The default allowance stays 15; the configured value, per-minute rates, token
pool, multiplayer scoring, manual farming and password minimum of 8 are unchanged.
Old overbooked requests/history are preserved, not truncated. Existing pending
work may already exceed a lowered allowance; available slots are clamped to zero,
and new admission stops rather than erasing earlier work. Yesterday's daily hold
does not reduce today's daily allowance, but its token debit remains accountable.

GET `/api/tutor` uses service-only `get_ai_tutor_allowance` for one database
snapshot of counted and pending slots. It returns only the signed-in user's
remaining allowance and never caches the result. Reservation and settlement now
acknowledge `daily_slot_version: 1`; the matching app fails closed against an old
database before a provider request, rather than relying only on the UI counter.

## Approved operator rollout only

1. Inspect the intended project, pending migration inventory and current app.
   Follow the earlier [tutor accounting rollout](tutor-accounting-rollout.md) if
   041 has not been applied. Do not blindly push every pending migration.
2. For an already-041 database, gate new reservations by revoking service-role
   execution on `reserve_ai_tutor_request_v2(uuid,uuid,integer,integer,integer,integer,integer)`.
   Commit that gate, let current requests settle, and verify every old production,
   preview and owner-level invocation has drained. Then gate
   `finish_ai_tutor_request(uuid,integer,boolean,boolean)` and verify no old or
   queued accounting transaction remains, using the prior runbook's activity and
   lock checks (also include `ai_tutor_usage_ledger`). Elapsed time or empty leases
   alone do not prove drain. Never terminate unrelated sessions blindly.
3. Keep tutor work gated while deploying the matching app and applying reviewed
   migrations through 046. The migration transaction takes accounting-table locks
   and restores service execution on v2 reserve, finish and the new read RPC at
   commit. Browser roles remain denied; legacy v1 reserve remains inert/denied.
   If applying 041 and 046 together, keep a separately verified tutor traffic gate
   across the intermediate 041 commit, which regrants v2. Old deployments must not
   resume in that gap. If migration fails, leave the tutor gated and investigate.
4. Verify effective grants, migration inventory, app revision, original ledger
   rows and unchanged token/day counters. With explicit approval, use a normal
   alt-account request to check allowance, one successful decrement and ordinary
   hint UX. Do not cause paid timeouts, flood endpoints or exhaust production
   allowances to test the race; use the isolated regression suite instead.
5. If rollback is necessary, gate v2 reservations again. Do not restore the old
   admission body, erase uncertain holds, reset token counters or regrant legacy
   reservation execution. Plan a forward-compatible recovery before reopening.

## Boundaries and checks

- This bounds daily admission under the existing serialized accounting RPCs; it
  does not identify bots or impose IP/account-farming bans.
- A connection failure with unknown outcome may temporarily reserve a daily slot
  without delivering an answer. Reopening the tutor refreshes available slots.
  There is no automatic provider reconciliation, and token holds do not expire
  just because the Eastern day changes.
- `get_ai_tutor_allowance` is a read-only `STABLE` SQL function. Used/pending counts
  share the calling query's snapshot. Reservation/settlement use the common
  budget-row lock; verify the normal READ COMMITTED isolation on the actual host.
  See [PostgreSQL function snapshots](https://www.postgresql.org/docs/current/xfunc-volatility.html)
  and [row locks](https://www.postgresql.org/docs/current/explicit-locking.html).
- Isolated PGlite tests model delayed and out-of-order calls, not real concurrent
  network connections. Hosted compatibility and live billing remain unverified.

Local verification on 2026-09-11: 139 application tests and 62 database security
checks passed, including a pre-fix over-admission reproduction and regression
checks for expiry, unknown/known failures, retries, midnight, rollback, prior
overbooked records and browser-role denial. Targeted lint, TypeScript, production
webpack build (35 pages) and whitespace checks also passed. No paid completions
or platform upgrades were used.
