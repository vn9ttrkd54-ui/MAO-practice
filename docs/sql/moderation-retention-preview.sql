-- Read-only impact summary. No identifiers, usernames, or audit reasons returned.
-- Requires 068. Use the correct project's SQL Editor as postgres.
begin read only;
set local statement_timeout = '5s';
select current_user='postgres' as trusted_operator,
  to_regprocedure('cron.schedule(text,text,text)') is not null as scheduler_available,
  pg_size_pretty(pg_total_relation_size('public.account_moderation_audit')) as audit_storage;
select count(*) as audit_rows,
  count(*) filter(where a.created_at<=statement_timestamp()-interval '90 days') as routine_expired,
  count(*) filter(where not exists(select 1 from auth.users u where u.id=a.target_id)) as deleted_target_rows_to_remove,
  count(*) filter(where not exists(select 1 from auth.users u where u.id=a.actor_id)) as deleted_actor_rows_to_redact,
  count(*) filter(where a.created_at>statement_timestamp()-interval '24 hours'
    and exists(select 1 from auth.users u where u.id=a.actor_id)) as recent_security_receipts_to_backfill
from public.account_moderation_audit a;
rollback;
