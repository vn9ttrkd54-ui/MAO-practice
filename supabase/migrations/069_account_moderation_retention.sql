-- Apply after 068, as postgres. This removes existing orphaned audit details.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

do $$
begin
  if current_user <> 'postgres' then
    raise exception 'Retention installation requires the trusted postgres operator' using errcode='42501';
  end if;
  if to_regclass('public.account_moderation_audit') is null
    or to_regprocedure('public.moderate_account(uuid,uuid,text,text,bigint,uuid)') is null
    or to_regprocedure('cron.schedule(text,text,text)') is null then
    raise exception 'Install account moderation 068 and pg_cron before retention';
  end if;
  if exists(select 1 from cron.job where jobname='account-moderation-retention' and username<>current_user) then
    raise exception 'An unrelated retention job needs operator review';
  end if;
end $$;

-- These are pseudonymous security receipts, not anonymous records. No usernames,
-- free-text reasons, or raw account IDs are copied here. Expiry is always 24h.
create table public.account_moderation_receipts (
  request_id uuid primary key,
  request_fingerprint bytea not null check(octet_length(request_fingerprint)=32),
  actor_key bytea not null check(octet_length(actor_key)=32),
  created_at timestamptz not null default statement_timestamp(),
  expires_at timestamptz not null default statement_timestamp()+interval '24 hours',
  check(expires_at=created_at+interval '24 hours')
);
create index account_moderation_receipts_actor on public.account_moderation_receipts(actor_key,created_at desc);
create index account_moderation_receipts_expiry on public.account_moderation_receipts(expires_at,request_id);
create index account_moderation_audit_expiry on public.account_moderation_audit(created_at,request_id);
alter table public.account_moderation_receipts enable row level security;
revoke all on public.account_moderation_receipts from public,anon,authenticated,service_role,authenticator;

-- Preserve recent retries/action limits during the migration, including records
-- of already-deleted targets. Expiry stays tied to the original action time.
insert into public.account_moderation_receipts(request_id,request_fingerprint,actor_key,created_at,expires_at)
select a.request_id,
  pg_catalog.sha256(pg_catalog.convert_to(pg_catalog.jsonb_build_array(a.request_id,a.actor_id,a.target_id,a.action,btrim(a.reason))::text,'UTF8')),
  pg_catalog.sha256(pg_catalog.convert_to(a.actor_id::text,'UTF8')),
  a.created_at,a.created_at+interval '24 hours'
from public.account_moderation_audit a
where a.created_at>statement_timestamp()-interval '24 hours'
  and exists(select 1 from auth.users u where u.id=a.actor_id);

-- Remove legacy orphaned targets; preserve other users' history without the
-- deleted moderator's identifier or identifying free-text reason.
delete from public.account_moderation_audit a
where not exists(select 1 from auth.users u where u.id=a.target_id);
alter table public.account_moderation_audit alter column actor_id drop not null;
update public.account_moderation_audit a set actor_id=null,
  reason='Moderator account deleted; identifying details removed'
where not exists(select 1 from auth.users u where u.id=a.actor_id);
alter table public.account_moderation_audit
  add constraint account_moderation_audit_target_fk foreign key(target_id) references auth.users(id) on delete cascade,
  add constraint account_moderation_audit_actor_fk foreign key(actor_id) references auth.users(id) on delete set null;

create function public.scrub_deleted_moderation_actor()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  update public.account_moderation_audit set actor_id=null,
    reason='Moderator account deleted; identifying details removed'
    where actor_id=old.id;
  delete from public.account_moderation_receipts
    where actor_key=pg_catalog.sha256(pg_catalog.convert_to(old.id::text,'UTF8'));
  return old;
end; $$;
revoke all on function public.scrub_deleted_moderation_actor() from public,anon,authenticated,service_role,authenticator;
create trigger scrub_deleted_moderation_actor before delete on auth.users
for each row execute function public.scrub_deleted_moderation_actor();

-- Same authorization, locks, stale-version checks and mutations as 068. Only
-- replay detection and the 10/minute action limit move to the short-lived ledger.
create or replace function public.moderate_account(p_actor_id uuid,p_target_id uuid,p_action text,p_reason text,p_expected_version bigint,p_request_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_role text; target_role text; old_name text; replacement text;
  m public.account_moderation%rowtype; prior public.account_moderation_receipts%rowtype; attempt integer:=0;
  fingerprint bytea; actor_key_value bytea;
begin
  if p_actor_id is null or p_target_id is null or p_actor_id=p_target_id
    or p_request_id is null or p_action is null or p_action not in ('require_name_change','suspend','restore','delete')
    or p_reason is null or char_length(trim(p_reason)) not between 5 and 500 or p_expected_version is null then
    raise exception 'Invalid moderation request' using errcode='22023';
  end if;
  fingerprint:=pg_catalog.sha256(pg_catalog.convert_to(pg_catalog.jsonb_build_array(p_request_id,p_actor_id,p_target_id,p_action,btrim(p_reason))::text,'UTF8'));
  actor_key_value:=pg_catalog.sha256(pg_catalog.convert_to(p_actor_id::text,'UTF8'));
  perform 1 from public.profiles where id in (p_actor_id,p_target_id) order by id for update;
  select role into actor_role from public.profiles where id=p_actor_id;
  if actor_role is null or actor_role not in ('owner','admin') then raise exception 'Administrator access required' using errcode='42501'; end if;
  if exists(select 1 from public.account_moderation where user_id=p_actor_id and (suspended or requires_name_change)) then
    raise exception 'Account restricted' using errcode='42501';
  end if;
  if p_action='delete' and actor_role<>'owner' then raise exception 'Owner access required' using errcode='42501'; end if;
  select * into prior from public.account_moderation_receipts where request_id=p_request_id;
  if found then
    if prior.request_fingerprint<>fingerprint or prior.expires_at<=clock_timestamp() then
      raise exception 'Request conflict' using errcode='22023';
    end if;
    return jsonb_build_object('success',true,'replayed',true);
  end if;
  select role,username into target_role,old_name from public.profiles where id=p_target_id;
  if target_role is distinct from 'user' then raise exception 'Only ordinary user accounts can be moderated' using errcode='42501'; end if;
  insert into public.account_moderation(user_id) values(p_target_id) on conflict do nothing;
  select * into m from public.account_moderation where user_id=p_target_id for update;
  if m.version<>p_expected_version then raise exception 'Account changed. Refresh before trying again.' using errcode='40001'; end if;
  if (select count(*) from public.account_moderation_receipts where actor_key=actor_key_value and created_at>clock_timestamp()-interval '1 minute')>=10 then
    raise exception 'Too many moderation actions' using errcode='P0001';
  end if;
  if p_action='require_name_change' then
    if m.requires_name_change then raise exception 'A name change is already required' using errcode='22023'; end if;
    perform pg_advisory_xact_lock(hashtextextended(old_name,680));
    update public.account_moderation set requires_name_change=true,previous_login_username=old_name where user_id=p_target_id;
    loop
      replacement:='player_'||substr(md5(p_target_id::text||':'||p_request_id::text||':'||attempt::text),1,12);
      perform pg_advisory_xact_lock(hashtextextended(replacement,680));
      exit when not exists(select 1 from public.profiles where username=replacement)
        and not exists(select 1 from public.account_moderation where previous_login_username=replacement);
      attempt:=attempt+1;
    end loop;
    update public.profiles set username=replacement,display_name=replacement where id=p_target_id;
    update auth.users set raw_app_meta_data=coalesce(raw_app_meta_data,'{}')||'{"requires_name_change":true}'::jsonb,
      raw_user_meta_data=coalesce(raw_user_meta_data,'{}')||jsonb_build_object('username',replacement,'display_name',replacement,'full_name',replacement)
      where id=p_target_id;
    update public.multiplayer_players set guest_nickname=null where user_id=p_target_id;
  elsif p_action in ('suspend','restore') then
    if m.suspended=(p_action='suspend') then raise exception 'Account is already in that state' using errcode='22023'; end if;
    update public.account_moderation set suspended=(p_action='suspend') where user_id=p_target_id;
    update auth.users set raw_app_meta_data=coalesce(raw_app_meta_data,'{}')||jsonb_build_object('account_suspended',p_action='suspend') where id=p_target_id;
  end if;
  insert into public.account_moderation_receipts(request_id,request_fingerprint,actor_key)
    values(p_request_id,fingerprint,actor_key_value);
  insert into public.account_moderation_audit(request_id,actor_id,target_id,action,reason,previous_username,new_username)
    values(p_request_id,p_actor_id,p_target_id,p_action,trim(p_reason),coalesce(m.previous_login_username,old_name),replacement);
  if p_action='delete' then
    delete from auth.users where id=p_target_id;
    if not found then raise exception 'Account not found' using errcode='22023'; end if;
  else
    update public.account_moderation set version=version+1,updated_at=clock_timestamp() where user_id=p_target_id;
    update public.multiplayer_players set connected=false,lobby_ready_settings_version=null,updated_at=clock_timestamp()
      where user_id=p_target_id and left_at is null and p_action<>'restore';
    update public.multiplayer_rooms set state_version=state_version+1
      where id in (select room_id from public.multiplayer_players where user_id=p_target_id);
  end if;
  return jsonb_build_object('success',true);
end; $$;
revoke all on function public.moderate_account(uuid,uuid,text,text,bigint,uuid) from public,anon,authenticated,service_role,authenticator;
grant execute on function public.moderate_account(uuid,uuid,text,text,bigint,uuid) to service_role;

create function public.cleanup_account_moderation_retention()
returns jsonb language plpgsql security definer set search_path='' set lock_timeout='250ms' as $$
declare cutoff timestamptz:=clock_timestamp(); audits integer; receipts integer; history integer;
begin
  if not pg_try_advisory_xact_lock(690,1) then return jsonb_build_object('busy',true); end if;
  with batch as (
    select request_id from public.account_moderation_audit
    where created_at<=cutoff-interval '90 days' order by created_at,request_id limit 500 for update skip locked
  ) delete from public.account_moderation_audit a using batch b where a.request_id=b.request_id;
  get diagnostics audits=row_count;
  with batch as (
    select request_id from public.account_moderation_receipts
    where expires_at<=cutoff order by expires_at,request_id limit 500 for update skip locked
  ) delete from public.account_moderation_receipts r using batch b where r.request_id=b.request_id;
  get diagnostics receipts=row_count;
  -- pg_cron owns this table and grants SELECT/DELETE, not UPDATE or DDL.
  -- Use its existing runid primary key; never alter managed-table permissions.
  with batch as (
    select runid from cron.job_run_details where jobid in (
      select jobid from cron.job where jobname='account-moderation-retention' and username=current_user
    ) and end_time<cutoff-interval '7 days' order by runid limit 500
  ) delete from cron.job_run_details h using batch b where h.runid=b.runid;
  get diagnostics history=row_count;
  return jsonb_build_object('audits_removed',audits,'receipts_removed',receipts,'job_history_removed',history);
end; $$;
revoke all on function public.cleanup_account_moderation_retention() from public,anon,authenticated,service_role,authenticator;

select cron.schedule('account-moderation-retention','23 * * * *',
  $$set statement_timeout='5s'; set lock_timeout='250ms'; select public.cleanup_account_moderation_retention();$$);
notify pgrst,'reload schema';
commit;
