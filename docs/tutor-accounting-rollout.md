# Tutor accounting rollout

This is an operator runbook, not an automated deployment. Obtain approval for the brief tutor interruption, verify the intended Supabase and Vercel projects, and inspect the pending migration inventory first. Do not apply unrelated pending migrations or print credentials. Rehearse on disposable staging before production.

The current app additionally requires migration 046's durable daily-slot acknowledgment.
Use [the daily-slot rollout](tutor-daily-slots-rollout.md) alongside this initial
041 runbook; stopping at 041 leaves the current tutor unavailable. Keep the tutor
gated across any intermediate migration commit that restores RPC execution.

Migration 041 changes accounting semantics: the shared `tokens_used` includes confirmed usage and outstanding conservative estimates. New application code calls `reserve_ai_tutor_request_v2` and requires its version-2 acknowledgment before making a paid provider call. The legacy reservation function becomes an inert, non-executable endpoint for application roles, so older deployments cannot start new tutor work after the migration. The app and database must be deployed together; replacing old accounting functions while an old invocation is still running is not a supported zero-pause rollout.

## Gate and drain the tutor only

Using an authorized database administration connection, temporarily stop new reservations. Normal website pages, gameplay and usage reads need not stop. All application instances, including previews connected to this database, must use `service_role` for these RPCs; separately stop any owner-level jobs that call them.

```sql
revoke execute on function public.reserve_ai_tutor_request(uuid, uuid, integer, integer, integer, integer, integer)
  from service_role;
```

Commit the gate before proceeding. Let existing tutor requests finish normally and verify through the hosting platform's invocation/deployment state that old HTTP/provider invocations have completed, including older deployments and previews sharing this database. A legacy route stalled outside the database is not visible in SQL activity and must not later settle missing usage as known zero. The app has a 45-second provider timeout and reservations normally have a 90-second lease, but elapsed time or an empty lease table alone does not prove drain. If old invocation status cannot be verified, keep the tutor gated and resolve that visibility before migrating.

Immediately before the final drain check, gate settlement too:

```sql
revoke execute on function public.finish_ai_tutor_request(uuid, integer, boolean, boolean)
  from service_role;
```

Commit this gate as well. A late settlement denied by the gate leaves its reservation for conservative migration import. Verify that neither browser role nor `service_role` can execute either RPC:

```sql
select role_name, signature,
  has_function_privilege(role_name, signature, 'EXECUTE') as can_execute
from (values ('anon'), ('authenticated'), ('service_role')) r(role_name)
cross join (values
  ('public.reserve_ai_tutor_request(uuid,uuid,integer,integer,integer,integer,integer)'),
  ('public.finish_ai_tutor_request(uuid,integer,boolean,boolean)')
) f(signature);
```

All six results must be false. If another effective grant or owner-level caller can bypass the gate, stop and resolve it; do not broaden revocations without review.

An operator with visibility into all database sessions must confirm that no old invocation, queued invocation, or open accounting transaction remains. These read-only checks help identify them without displaying query bodies:

```sql
select pid, state, wait_event_type, wait_event, xact_start
from pg_stat_activity
where datname = current_database()
  and pid <> pg_backend_pid()
  and state is distinct from 'idle'
  and query ~* '(reserve|finish)_ai_tutor_request';

select distinct a.pid, a.state, a.wait_event_type, a.wait_event, a.xact_start
from pg_locks l
join pg_stat_activity a on a.pid = l.pid
where a.datname = current_database()
  and a.pid <> pg_backend_pid()
  and l.relation in (
    'public.ai_tutor_budget'::regclass,
    'public.ai_tutor_reservations'::regclass,
    'public.ai_tutor_daily_usage'::regclass
  );
```

Proceed only once these are clear and session visibility is sufficient. A single query-text check can miss wrappers or hidden queries; the gate, transaction/lock check and operator knowledge of all callers matter together. Do not terminate sessions blindly. Keep the tutor gated and investigate if any call stays blocked or visibility is incomplete.

## Deploy and resume

1. Keep both RPCs gated and deploy the reviewed application through the existing Git/Vercel workflow. Wait for the intended production deployment to be ready. Tutor requests temporarily receive their normal unavailable response.
2. Apply only the reviewed pending migrations in order, including 040 and 041. Migration 041 transactionally imports remaining reservations, installs the version-2 reservation function, and restores service-role execution for that new function and settlement at commit. Legacy reservation execution stays revoked, even for `service_role`. It does not reset the pool or refund expired holds. If it fails, the earlier revocation remains in effect: leave the tutor gated and investigate.
3. Verify migration inventory, the new ledger, RLS/grants and the intended app revision. Confirm browser roles still cannot access accounting, service-role execution works for v2 and finish, and service-role execution remains denied for the legacy reservation function. Old deployments should not be used as a fallback for tutoring: their requests fail safely. Verify existing usage plus imported holds were retained.
4. With approval, make one normal tutor request and verify reservation followed by settlement, message allowance and UI behavior. Do not induce paid timeouts or replay production submissions for testing. Check login, feedback, practice and a small private multiplayer game, including the normal countdowns and results.
5. If the app must roll back, gate the **v2** reservation function first and plan a forward-compatible rollback. Do not drop the ledger, reset counters, or regrant the retired reservation function. Legacy application logic loses the distinction between missing usage and zero; leave its tutor unavailable. Diagnose before reopening the tutor.

After 041, the tutor-only reservation gate is:

```sql
revoke execute on function public.reserve_ai_tutor_request_v2(uuid, uuid, integer, integer, integer, integer, integer)
  from service_role;
```

Restoring that permission is a separate approved operation after resolving the reason for the gate. Never use the legacy function as a replacement.

## Ongoing budget operations

- Unknown usage holds stay charged until usage is verified; there is no automatic provider reconciliation in this batch. A known-zero settlement is valid only with evidence that no usage occurred.
- Never refill by resetting `tokens_used` or deleting ledger rows. Review actual provider usage and outstanding holds before intentionally adjusting `token_limit`. The in-app pool is not a dollar billing cap or an automatically resetting monthly budget.
- Keep accounting functions restricted to trusted server callers. Do not expose them as browser-accessible reconciliation endpoints.
- Establish monitoring/reconciliation and ledger retention separately. Do not log prompts, passwords or provider credentials while investigating accounting.
