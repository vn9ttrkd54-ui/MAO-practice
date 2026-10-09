-- Read-only installation/health check, after 069. Does not run cleanup.
begin read only;
set local statement_timeout = '5s';
select
  (select relrowsecurity from pg_class where oid='public.account_moderation_receipts'::regclass)
    as receipt_rls_enabled,
  not exists(select 1 from unnest(array['anon','authenticated','service_role','authenticator']) r(role_name)
    cross join unnest(array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) p(privilege_name)
    where has_table_privilege(r.role_name,'public.account_moderation_receipts',p.privilege_name))
    as receipts_private,
  not exists(select 1 from unnest(array['anon','authenticated','service_role','authenticator']) r(role_name)
    cross join unnest(array['public.cleanup_account_moderation_retention()','public.scrub_deleted_moderation_actor()']) f(signature)
    where has_function_privilege(r.role_name,f.signature,'EXECUTE'))
    as cleanup_operator_only,
  exists(select 1 from pg_proc where oid='public.cleanup_account_moderation_retention()'::regprocedure
    and prosecdef and pg_get_userbyid(proowner)='postgres'
    and 'search_path=""'=any(proconfig) and 'lock_timeout=250ms'=any(proconfig))
    as cleanup_hardened,
  exists(select 1 from pg_constraint where conrelid='public.account_moderation_audit'::regclass
    and conname='account_moderation_audit_target_fk' and confrelid='auth.users'::regclass and confdeltype='c' and convalidated)
    as target_audit_cascade,
  exists(select 1 from pg_constraint where conrelid='public.account_moderation_audit'::regclass
    and conname='account_moderation_audit_actor_fk' and confrelid='auth.users'::regclass and confdeltype='n' and convalidated)
    as actor_identifier_clear,
  exists(select 1 from pg_trigger where tgrelid='auth.users'::regclass
    and tgname='scrub_deleted_moderation_actor' and tgenabled='O')
    as actor_reason_scrub,
  not has_function_privilege('anon','public.moderate_account(uuid,uuid,text,text,bigint,uuid)','EXECUTE')
    and not has_function_privilege('authenticated','public.moderate_account(uuid,uuid,text,text,bigint,uuid)','EXECUTE')
    and has_function_privilege('service_role','public.moderate_account(uuid,uuid,text,text,bigint,uuid)','EXECUTE')
    as moderation_permissions_preserved,
  (select count(*)=1 from cron.job where jobname='account-moderation-retention'
    and username='postgres' and active and schedule='23 * * * *'
    and command=$job$set statement_timeout='5s'; set lock_timeout='250ms'; select public.cleanup_account_moderation_retention();$job$)
    as bounded_job_registered,
  (select count(*)=3 from pg_index where indisvalid and indrelid in (
    'public.account_moderation_audit'::regclass,'public.account_moderation_receipts'::regclass)
    and indexrelid in ('public.account_moderation_audit_expiry'::regclass,'public.account_moderation_receipts_expiry'::regclass,
      'public.account_moderation_receipts_actor'::regclass))
    as expiry_indexes_valid;

select count(*) as audits_waiting_for_cleanup from public.account_moderation_audit
where created_at<=statement_timestamp()-interval '90 days';
select count(*) as receipts_waiting_for_cleanup from public.account_moderation_receipts
where expires_at<=statement_timestamp();
-- Excludes return_message because errors can contain identifying SQL details.
select h.status,h.end_time from cron.job_run_details h join cron.job j using(jobid)
where j.jobname='account-moderation-retention' and j.username='postgres'
order by h.runid desc limit 5;
rollback;
