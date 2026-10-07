-- Moderation is opt-in per account. Installing this does not rename, suspend,
-- or delete any existing user. Requires 057 and the host-deletion fix 047.
begin;

insert into public.public_name_rules(term,match_kind)
select jsonb_array_elements_text(value),key from jsonb_each($rules${
  "contains": ["raper", "rapist", "raping", "pedophile", "paedophile"],
  "words": ["rape", "raped", "rapes"],
  "allow": ["grape", "grapes", "grapefruit", "grapery", "graping", "scraper", "scrapers", "scraping", "skyscraper", "skyscrapers", "draper", "drapery", "draping", "therapist", "therapists", "physiotherapist", "psychotherapist"]
}$rules$::jsonb) on conflict do nothing;

create table public.account_moderation (
  user_id uuid primary key references auth.users(id) on delete cascade,
  requires_name_change boolean not null default false,
  suspended boolean not null default false,
  previous_login_username text unique,
  version bigint not null default 0,
  updated_at timestamptz not null default clock_timestamp(),
  check (requires_name_change = (previous_login_username is not null))
);
-- Deliberately no foreign keys: deleting either account must not erase history.
create table public.account_moderation_audit (
  request_id uuid primary key,
  actor_id uuid not null,
  target_id uuid not null,
  action text not null check(action in ('require_name_change','name_changed','suspend','restore','delete')),
  reason text not null check(char_length(reason) between 5 and 500),
  previous_username text not null,
  new_username text,
  created_at timestamptz not null default clock_timestamp()
);
create index account_moderation_audit_target on public.account_moderation_audit(target_id,created_at desc);
create index account_moderation_audit_actor on public.account_moderation_audit(actor_id,created_at desc);
-- Cover the existing self-delete API too. Privileged accounts must first be
-- deliberately demoted through a separate owner-controlled process.
create function public.protect_privileged_account_deletion()
returns trigger language plpgsql security definer set search_path='' as $$
declare account_role text;
begin
  select role into account_role from public.profiles where id=old.id for update;
  if account_role in ('admin','owner') then
    raise exception 'Privileged accounts cannot be deleted' using errcode='42501';
  end if;
  return old;
end; $$;
revoke all on function public.protect_privileged_account_deletion() from public,anon,authenticated,service_role;
create trigger protect_privileged_account_deletion before delete on auth.users
for each row execute function public.protect_privileged_account_deletion();
create table public.moderation_verifications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  session_id uuid not null,
  token_hash text not null check(token_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null
);
alter table public.account_moderation enable row level security;
alter table public.account_moderation_audit enable row level security;
alter table public.moderation_verifications enable row level security;
revoke all on public.account_moderation,public.account_moderation_audit,public.moderation_verifications from public,anon,authenticated,service_role;
grant select on public.account_moderation,public.account_moderation_audit,public.moderation_verifications to service_role;

-- One indexed lookup, independent of stale JWT app_metadata. Used by RLS and
-- PostgREST (including security-definer RPCs). Anonymous guest play stays public.
create function public.account_is_active()
returns boolean language sql stable security definer set search_path='' as $$
  select auth.uid() is null or exists (
    select 1 from auth.users u where u.id=auth.uid()
      and coalesce(u.raw_app_meta_data->>'account_suspended','false') <> 'true'
      and coalesce(u.raw_app_meta_data->>'requires_name_change','false') <> 'true'
  );
$$;
revoke all on function public.account_is_active() from public,anon,authenticated,service_role;
grant execute on function public.account_is_active() to anon,authenticated,service_role;
create function public.check_account_access()
returns void language plpgsql stable security definer set search_path='' as $$
begin
  if not public.account_is_active() then
    raise sqlstate 'PT403' using message='Account restricted. Visit /auth/resolve.';
  end if;
end; $$;
revoke all on function public.check_account_access() from public,anon,authenticated,service_role;
grant execute on function public.check_account_access() to anon,authenticated,service_role;

-- Do not silently replace an unrelated installed pre-request security hook.
do $$
declare existing text; t record;
begin
  select split_part(setting,'=',2) into existing from pg_db_role_setting s
    join pg_roles r on r.oid=s.setrole cross join lateral unnest(s.setconfig) setting
    where r.rolname='authenticator' and setting like 'pgrst.db_pre_request=%'
      and split_part(setting,'=',2) not in ('','public.check_account_access') limit 1;
  if nullif(existing,'') is not null and existing <> 'public.check_account_access' then
    raise exception 'An existing PostgREST pre-request hook needs manual integration: %',existing;
  end if;
  for t in select n.nspname,c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where c.relkind='r' and c.relrowsecurity and
      (n.nspname='public' or (n.nspname='realtime' and c.relname='messages'))
  loop
    execute format('create policy account_active_required on %I.%I as restrictive for all to authenticated using ((select public.account_is_active())) with check ((select public.account_is_active()))',t.nspname,t.relname);
  end loop;
end; $$;
alter role authenticator set pgrst.db_pre_request = 'public.check_account_access';

-- A private, temporary alias preserves the old login while the public profile
-- uses a neutral name. Neither anonymous users nor signed-in users can enumerate it.
create function public.resolve_login_username(p_username text)
returns uuid language sql stable security definer set search_path='' as $$
  select id from public.profiles where username=p_username
  union all
  select user_id from public.account_moderation where requires_name_change and previous_login_username=p_username
  limit 1;
$$;
revoke all on function public.resolve_login_username(text) from public,anon,authenticated,service_role;
grant execute on function public.resolve_login_username(text) to service_role;

create or replace function public.is_username_available(candidate_username text)
returns boolean language sql stable security definer set search_path='' as $$
  select candidate_username is not null and lower(trim(candidate_username)) ~ '^[a-z0-9_]{3,20}$'
    and lower(trim(candidate_username)) !~ '^player_[0-9a-f]{12}$'
    and not exists(select 1 from public.profiles where username=lower(trim(candidate_username)))
    and not exists(select 1 from public.account_moderation where previous_login_username=lower(trim(candidate_username)))
    and not exists(select 1 from auth.users where email=lower(trim(candidate_username))||'@users.mao-practice.local');
$$;

create function public.guard_reserved_username()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_op='UPDATE' and new.username=old.username then return new; end if;
  perform pg_advisory_xact_lock(hashtextextended(new.username,680));
  if exists(select 1 from public.account_moderation where previous_login_username=new.username) then
    raise exception 'Username is reserved' using errcode='23505';
  end if;
  -- Only the moderation transaction may assign a placeholder to its exact owner.
  if new.username ~ '^player_[0-9a-f]{12}$' and not exists(
    select 1 from public.account_moderation where user_id=new.id and requires_name_change
  ) then raise exception 'Username is reserved' using errcode='23514'; end if;
  return new;
end; $$;
revoke all on function public.guard_reserved_username() from public,anon,authenticated,service_role;
create trigger profiles_reserved_username_guard before insert or update of username on public.profiles
for each row execute function public.guard_reserved_username();

create function public.issue_moderation_verification(p_user_id uuid,p_session_id uuid,p_token_hash text)
returns void language plpgsql security definer set search_path='' as $$
begin
  if not exists(select 1 from public.profiles where id=p_user_id and role in ('admin','owner')) then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  delete from public.moderation_verifications where expires_at<=clock_timestamp();
  insert into public.moderation_verifications values(p_user_id,p_session_id,p_token_hash,clock_timestamp()+interval '5 minutes')
  on conflict(user_id) do update set session_id=excluded.session_id,token_hash=excluded.token_hash,expires_at=excluded.expires_at;
end; $$;
create function public.consume_moderation_verification(p_user_id uuid,p_session_id uuid,p_token_hash text)
returns boolean language plpgsql security definer set search_path='' as $$
declare affected integer;
begin
  delete from public.moderation_verifications where user_id=p_user_id and session_id=p_session_id
    and token_hash=p_token_hash and expires_at>clock_timestamp();
  get diagnostics affected=row_count;
  return affected=1;
end; $$;
revoke all on function public.issue_moderation_verification(uuid,uuid,text),public.consume_moderation_verification(uuid,uuid,text) from public,anon,authenticated,service_role;
grant execute on function public.issue_moderation_verification(uuid,uuid,text),public.consume_moderation_verification(uuid,uuid,text) to service_role;

-- The service verifies the ACTOR's password or consumes a fresh Google proof.
-- Database checks are repeated under row locks to prevent role-change races.
create function public.moderate_account(p_actor_id uuid,p_target_id uuid,p_action text,p_reason text,p_expected_version bigint,p_request_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_role text; target_role text; old_name text; replacement text;
  m public.account_moderation%rowtype; prior public.account_moderation_audit%rowtype; attempt integer:=0;
begin
  if p_actor_id is null or p_target_id is null or p_actor_id=p_target_id
    or p_request_id is null or p_action is null or p_action not in ('require_name_change','suspend','restore','delete')
    or p_reason is null or char_length(trim(p_reason)) not between 5 and 500 or p_expected_version is null then
    raise exception 'Invalid moderation request' using errcode='22023';
  end if;
  perform 1 from public.profiles where id in (p_actor_id,p_target_id) order by id for update;
  select role into actor_role from public.profiles where id=p_actor_id;
  if actor_role is null or actor_role not in ('owner','admin') then raise exception 'Administrator access required' using errcode='42501'; end if;
  if exists(select 1 from public.account_moderation where user_id=p_actor_id and (suspended or requires_name_change)) then
    raise exception 'Account restricted' using errcode='42501';
  end if;
  if p_action='delete' and actor_role<>'owner' then raise exception 'Owner access required' using errcode='42501'; end if;
  select * into prior from public.account_moderation_audit where request_id=p_request_id;
  if found then
    if prior.actor_id<>p_actor_id or prior.target_id<>p_target_id or prior.action<>p_action or prior.reason<>trim(p_reason) then
      raise exception 'Request conflict' using errcode='22023';
    end if;
    return jsonb_build_object('success',true,'replayed',true);
  end if;
  select role,username into target_role,old_name from public.profiles where id=p_target_id;
  -- Neither admins nor owners can moderate privileged accounts, including the last owner.
  if target_role is distinct from 'user' then raise exception 'Only ordinary user accounts can be moderated' using errcode='42501'; end if;
  insert into public.account_moderation(user_id) values(p_target_id) on conflict do nothing;
  select * into m from public.account_moderation where user_id=p_target_id for update;
  if m.version<>p_expected_version then raise exception 'Account changed. Refresh before trying again.' using errcode='40001'; end if;
  if (select count(*) from public.account_moderation_audit where actor_id=p_actor_id and created_at>clock_timestamp()-interval '1 minute')>=10 then
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
    -- Registered players can carry an old guest nickname; never publish it after moderation.
    update public.multiplayer_players set guest_nickname=null where user_id=p_target_id;
  elsif p_action in ('suspend','restore') then
    if m.suspended=(p_action='suspend') then raise exception 'Account is already in that state' using errcode='22023'; end if;
    update public.account_moderation set suspended=(p_action='suspend') where user_id=p_target_id;
    update auth.users set raw_app_meta_data=coalesce(raw_app_meta_data,'{}')||jsonb_build_object('account_suspended',p_action='suspend') where id=p_target_id;
  end if;
  insert into public.account_moderation_audit(request_id,actor_id,target_id,action,reason,previous_username,new_username)
    values(p_request_id,p_actor_id,p_target_id,p_action,trim(p_reason),coalesce(m.previous_login_username,old_name),replacement);
  if p_action='delete' then
    -- One transaction: recheck authorization, record the audit, delete the Auth
    -- identity and its FK-owned records. Any failed cascade rolls everything back.
    -- Existing 047 detaches a hosted room instead of deleting other players' games.
    delete from auth.users where id=p_target_id;
    if not found then raise exception 'Account not found' using errcode='22023'; end if;
  else
    update public.account_moderation set version=version+1,updated_at=clock_timestamp() where user_id=p_target_id;
    -- Trigger room invalidation so peers get the safe name on the next snapshot.
    update public.multiplayer_players set connected=false,lobby_ready_settings_version=null,updated_at=clock_timestamp()
      where user_id=p_target_id and left_at is null and p_action<>'restore';
    update public.multiplayer_rooms set state_version=state_version+1
      where id in (select room_id from public.multiplayer_players where user_id=p_target_id);
  end if;
  return jsonb_build_object('success',true);
end; $$;
revoke all on function public.moderate_account(uuid,uuid,text,text,bigint,uuid) from public,anon,authenticated,service_role;
grant execute on function public.moderate_account(uuid,uuid,text,text,bigint,uuid) to service_role;

-- Preserve the existing setup API/signature while making required renames atomic.
create or replace function public.set_account_username(p_user_id uuid,p_username text,p_complete_setup boolean default false,p_legal_version text default null)
returns void language plpgsql security definer set search_path='' as $$
declare account auth.users%rowtype; m public.account_moderation%rowtype; old_name text;
begin
  select username into old_name from public.profiles where id=p_user_id for update;
  if not found then raise exception 'Profile not found'; end if;
  select * into account from auth.users where id=p_user_id for update;
  if not found then raise exception 'Account not found'; end if;
  insert into public.account_moderation(user_id) values(p_user_id) on conflict do nothing;
  select * into m from public.account_moderation where user_id=p_user_id for update;
  if coalesce(m.suspended,false) then raise exception 'Account suspended' using errcode='42501'; end if;
  if p_username is null or p_username !~ '^[a-z0-9_]{3,20}$' or p_username ~ '^player_[0-9a-f]{12}$' then
    raise exception 'Invalid username' using errcode='23514';
  end if;
  if coalesce(m.requires_name_change,false) and p_username in (m.previous_login_username,old_name) then
    raise exception 'Choose a different username' using errcode='23514';
  end if;
  if account.raw_app_meta_data->>'needs_username'='true' then
    if not p_complete_setup or p_legal_version is distinct from '2026-09-07' then raise exception 'Complete account setup first'; end if;
  elsif p_complete_setup then raise exception 'Account already set up'; end if;
  update public.profiles set username=p_username,display_name=p_username where id=p_user_id;
  update auth.users set
    raw_user_meta_data=coalesce(raw_user_meta_data,'{}')||jsonb_build_object('username',p_username,'display_name',p_username,'full_name',p_username)
      ||case when p_complete_setup then jsonb_build_object('age_13_or_older',true,'terms_accepted_at',clock_timestamp(),'terms_version',p_legal_version,'privacy_version',p_legal_version) else '{}'::jsonb end,
    raw_app_meta_data=coalesce(raw_app_meta_data,'{}')||jsonb_build_object('requires_name_change',false)
      ||case when p_complete_setup then jsonb_build_object('needs_username',false) else '{}'::jsonb end
    where id=p_user_id;
  if coalesce(m.requires_name_change,false) then
    insert into public.account_moderation_audit values(gen_random_uuid(),p_user_id,p_user_id,'name_changed','User completed required name change',m.previous_login_username,p_username,clock_timestamp());
  end if;
  -- Even a voluntary rename invalidates an admin page that reviewed the old name.
  if old_name is distinct from p_username then
    update public.account_moderation set requires_name_change=false,previous_login_username=null,version=version+1,updated_at=clock_timestamp() where user_id=p_user_id;
  end if;
  update public.multiplayer_players set guest_nickname=null where user_id=p_user_id;
  update public.multiplayer_rooms set state_version=state_version+1 where id in(select room_id from public.multiplayer_players where user_id=p_user_id);
end; $$;

revoke all on function public.set_account_username(uuid,text,boolean,text) from public,anon,authenticated,service_role;
grant execute on function public.set_account_username(uuid,text,boolean,text) to service_role;

notify pgrst, 'reload config';
notify pgrst, 'reload schema';
commit;
