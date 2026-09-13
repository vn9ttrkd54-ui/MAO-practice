# Bounded practice timing rollout

Local implementation, not an executed deployment. Obtain approval, identify the intended database and hosting projects, and rehearse on disposable staging first. This is a coordinated application/database update, not a zero-downtime `db push` by itself. Earlier migrations 040–043 and the tutor/attempt rollout guides still apply if pending.

## What changes

- Migration 044 backfills lifetime timing sample count, total whole seconds, and best whole seconds. Each old millisecond sample is floored separately, matching the existing Best/Average display exactly. `correct` is not assumed to equal the number of timing samples. Empty timing history stays empty; legacy null samples keep the old zero-second behavior.
- The active question-progress row retains the most recent 100 samples. Every nonempty pre-migration array is copied to `practice_timing_legacy_archive` first, including short histories that might roll out of the recent window later. The archive has RLS, no browser/server-role access, and no gameplay append path. An authorized database administrator can recover the original samples. Account deletion cascades to the archive.
- Existing attempts, correct counts, level/RP values, and progress timestamps are not reset. Archived data is not sent to the page. New guest sessions use the same bounded-history/lifetime-metrics approach in local memory.
- Results use `finish_practice_attempt_v2`. The old `finish_practice_attempt` becomes inert and loses application-role execution, so an older app cannot append samples without maintaining the aggregates. The earlier `record_verified_practice_result` remains retired. Begin-attempt behavior and all replay/burst rules remain unchanged.
- Replayed receipts keep their original counters, correctness and level change, while their timing fields describe the current lifetime history, consistent with the previous current-history-on-retry behavior. Pre-044 receipts do not need to be deleted or re-awarded.

## Gate, drain, migrate, verify

1. Review pending migrations, backup/recovery readiness and the size of existing histories/archive copy. Rehearse the transaction duration on a representative staging copy. Migration 044 takes exclusive locks on practice state, attempts and progress while it backfills. Unexpected negative/out-of-range or multidimensional historical samples cause the transaction to fail rather than silently changing them. Review those rows before retrying; do not erase them as a shortcut.
2. If 043 is already installed, gate its result writer with an authorized database administrator connection and commit:

   ```sql
   revoke execute on function public.finish_practice_attempt(uuid, uuid, integer, boolean, text, text, integer)
     from public, anon, authenticated, service_role;
   ```

   If 043 is not yet installed, follow [the attempt rollout](./practice-attempt-rollout.md) to gate the original legacy writer instead. Keep all retired writers denied. Verify effective execution permissions, caller inventory, and hosting/database activity; drain already-running or queued old invocations and open transactions before replacing functions. A fixed sleep alone is insufficient. Do not terminate sessions blindly.
3. Coordinate promotion of the matching application and reviewed migrations during the practice maintenance window. The new result route fails closed against the old database, and old pages must not remain the active version after arrays are shortened: they would compute statistics from only the retained samples. Refresh older open practice tabs. The new signed-in reader requires the aggregate fields and does not silently use recent samples as lifetime metrics.
4. Apply only reviewed pending migrations in order. Migration 044 atomically archives existing nonempty histories, computes aggregates, normalizes/caps active arrays, installs constraints, and enables only the v2 result writer. It requires the ordinary `updated_at` trigger to have its expected enabled configuration, temporarily disables only that trigger during backfill, and re-enables it within the same transaction to preserve existing timestamps. No scoring/authorization trigger is disabled.
5. Verify on staging: old-vs-new Best/Average including fractional milliseconds, empty and null-containing arrays, an old best time outside the last 100 samples, one new correct result, incorrect/Give Up, a lost-response retry, 043-era receipts, and guest practice. Confirm active arrays are capped, archive copies match their originals, browser access to the archive is denied, direct progress writes stay denied, and old RPC execution remains denied. Unit/PGlite tests are not a hosted or multi-connection test.
6. With approval, perform ordinary production smoke checks after promotion: read existing statistics, complete a question, use Try Again, and check Trainer progress. Do not generate production bursts or replay real players' submissions as an automated security test.

## Recovery and retention

Do not roll back to an app that derives lifetime averages from the recent array. Gate the v2 writer and use a forward-compatible correction. Keep the archive and aggregate fields: the archive preserves pre-migration samples, but does not contain every new sample recorded after the migration. Reconstructing a full chronological post-migration history is not supported; that is intentionally replaced by lifetime aggregates plus the recent 100 samples. Never replace aggregates from the recent window or regrant the retired RPC to restore writes.

The archive is a fixed historical copy, not ongoing event storage. Its eventual removal/retention requires a separate decision and verified backup. No production data has been trimmed, archived or deleted by this local implementation.
