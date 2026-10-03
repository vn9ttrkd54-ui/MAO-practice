-- Apply before enabling Google in Supabase. No existing names are changed.
begin;

create table public.public_name_rules (
  term text not null check (term ~ '^[a-z]+$'),
  match_kind text not null check (match_kind in ('contains','words','allow')),
  primary key(term,match_kind)
);
alter table public.public_name_rules enable row level security;
revoke all on public.public_name_rules from public, anon, authenticated;
grant select, insert, update, delete on public.public_name_rules to service_role;

-- Kept in sync with lib/auth/publicNameRules.json by the database tests.
insert into public.public_name_rules(term,match_kind)
select jsonb_array_elements_text(value),key from jsonb_each($rules${
  "contains": ["fuck", "motherfucker", "bitch", "asshole", "dumbass", "dickhead", "bullshit", "shitty", "nigger", "nigga", "faggot", "nazihitler"],
  "words": ["ass", "shit", "cunt", "dick", "cock", "pussy", "bastard", "slut", "whore", "fag", "retard", "retarded", "hitler", "nazi"],
  "allow": ["assistant", "assassin", "assassins", "assassination", "classic", "classical", "passion", "cassidy", "scunthorpe", "dickens", "cockburn", "hancock", "shitake", "shital", "cockatoo", "cockatiel", "peacock"]
}$rules$::jsonb);

create function public.is_public_name_allowed(p_value text)
returns boolean language plpgsql stable security definer set search_path='' as $$
declare cleaned text; compact text; squeezed text; words text[];
begin
  if p_value is null or char_length(p_value) > 100 then return false; end if;
  cleaned := lower(normalize(p_value,NFKC));
  cleaned := translate(cleaned,chr(8203)||chr(8204)||chr(8205)||chr(65279),'');
  cleaned := regexp_replace(cleaned,'[0-9]+$','');
  cleaned := translate(cleaned,'01345789@$!','oieastbgasi');
  select coalesce(array_agg(m[1]),'{}') into words from regexp_matches(cleaned,'([a-z]+)','g') as m;
  compact := array_to_string(words,'');
  if exists(select 1 from public.public_name_rules where match_kind='allow' and term=compact) then return true; end if;
  squeezed := regexp_replace(compact,'(.)\1+','\1','g');
  return not exists (
    select 1 from public.public_name_rules r where
    (r.match_kind='contains' and strpos(squeezed,regexp_replace(r.term,'(.)\1+','\1','g'))>0)
    or (r.match_kind='words' and (
      squeezed=regexp_replace(r.term,'(.)\1+','\1','g') or exists (
        select 1 from unnest(words) w where regexp_replace(w,'(.)\1+','\1','g')=regexp_replace(r.term,'(.)\1+','\1','g')
      )
    ))
  );
end; $$;
revoke all on function public.is_public_name_allowed(text) from public;
grant execute on function public.is_public_name_allowed(text) to anon,authenticated,service_role;

create function public.guard_public_name()
returns trigger language plpgsql security definer set search_path='' as $$
declare name_value text;
begin
  if tg_table_name='profiles' then
    name_value := new.username;
    if tg_op='UPDATE' and new.username is not distinct from old.username then return new; end if;
  else
    name_value := new.guest_nickname;
    if name_value is null then return new; end if;
    if tg_op='UPDATE' and new.guest_nickname is not distinct from old.guest_nickname then return new; end if;
  end if;
  if not public.is_public_name_allowed(name_value) then
    raise exception 'public_name_not_allowed' using errcode='23514';
  end if;
  return new;
end; $$;
revoke all on function public.guard_public_name() from public,anon,authenticated;
create trigger profiles_public_name_guard before insert or update of username on public.profiles
for each row execute function public.guard_public_name();
create trigger guests_public_name_guard before insert or update of guest_nickname on public.multiplayer_players
for each row execute function public.guard_public_name();

-- GoTrue owns app metadata. User-editable metadata cannot skip onboarding or
-- claim that a password exists. Set these before GoTrue issues the first JWT.
create function public.prepare_google_account()
returns trigger language plpgsql set search_path='' as $$
begin
  if new.raw_app_meta_data->>'provider'='google' then
    new.raw_app_meta_data := new.raw_app_meta_data || jsonb_build_object('needs_username',true,'password_login_enabled',false);
  end if;
  return new;
end; $$;
revoke all on function public.prepare_google_account() from public,anon,authenticated;
create trigger prepare_google_account before insert on auth.users for each row execute function public.prepare_google_account();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path='' as $$
declare normalized_username text; attempt integer := 0;
begin
  if new.raw_app_meta_data->>'provider'='google' then
    -- An opaque placeholder, never a Google real name or email. Protected
    -- website routes require setup before this can be used publicly.
    loop
      normalized_username := 'g_'||substr(md5(new.id::text||':'||attempt::text),1,18);
      exit when not exists(select 1 from public.profiles where username=normalized_username);
      attempt := attempt+1;
    end loop;
  else
    normalized_username := lower(trim(new.raw_user_meta_data->>'username'));
    if normalized_username is null or normalized_username='' then raise exception 'Username is required'; end if;
    if new.raw_user_meta_data->>'age_13_or_older' is distinct from 'true'
      or new.raw_user_meta_data->>'terms_version' is distinct from '2026-09-07'
      or new.raw_user_meta_data->>'privacy_version' is distinct from '2026-09-07'
      or nullif(new.raw_user_meta_data->>'terms_accepted_at','') is null then
      raise exception 'Age and legal agreement are required';
    end if;
  end if;
  insert into public.profiles(id,username,display_name)
  values(new.id,normalized_username,case when new.raw_app_meta_data->>'provider'='google' then null else normalized_username end);
  insert into public.user_levels(user_id) values(new.id);
  return new;
end; $$;

-- One atomic write for profile + Auth display name + Google legal onboarding.
create function public.set_account_username(p_user_id uuid,p_username text,p_complete_setup boolean default false,p_legal_version text default null)
returns void language plpgsql security definer set search_path='' as $$
declare account auth.users%rowtype;
begin
  select * into account from auth.users where id=p_user_id for update;
  if not found then raise exception 'Account not found'; end if;
  if p_username is null or p_username !~ '^[a-z0-9_]{3,20}$' then raise exception 'Invalid username' using errcode='23514'; end if;
  if account.raw_app_meta_data->>'needs_username'='true' then
    if not p_complete_setup or p_legal_version is distinct from '2026-09-07' then raise exception 'Complete account setup first'; end if;
  elsif p_complete_setup then raise exception 'Account already set up';
  end if;
  update public.profiles set username=p_username,display_name=p_username where id=p_user_id;
  if not found then raise exception 'Profile not found'; end if;
  update auth.users set
    raw_user_meta_data=coalesce(raw_user_meta_data,'{}'::jsonb)||jsonb_build_object('username',p_username,'display_name',p_username,'full_name',p_username)
      ||case when p_complete_setup then jsonb_build_object('age_13_or_older',true,'terms_accepted_at',clock_timestamp(),'terms_version',p_legal_version,'privacy_version',p_legal_version) else '{}'::jsonb end,
    raw_app_meta_data=raw_app_meta_data||case when p_complete_setup then jsonb_build_object('needs_username',false) else '{}'::jsonb end
  where id=p_user_id;
end; $$;
revoke all on function public.set_account_username(uuid,text,boolean,text) from public,anon,authenticated;
grant execute on function public.set_account_username(uuid,text,boolean,text) to service_role;

-- Only a digest is stored. A deletion proof is account/session-bound and can
-- be consumed once; each successful Google verification replaces the last.
create table public.google_delete_verifications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  session_id uuid not null,
  token_hash text not null check(token_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null
);
create index google_delete_verifications_expiry on public.google_delete_verifications(expires_at);
alter table public.google_delete_verifications enable row level security;
revoke all on public.google_delete_verifications from public,anon,authenticated;
grant select on public.google_delete_verifications to service_role;
create function public.issue_google_delete_verification(p_user_id uuid,p_session_id uuid,p_token_hash text)
returns void language plpgsql security definer set search_path='' as $$
begin
  delete from public.google_delete_verifications where expires_at<=clock_timestamp();
  insert into public.google_delete_verifications(user_id,session_id,token_hash,expires_at)
  values(p_user_id,p_session_id,p_token_hash,clock_timestamp()+interval '5 minutes')
  on conflict(user_id) do update set session_id=excluded.session_id,token_hash=excluded.token_hash,expires_at=excluded.expires_at;
end; $$;
create function public.consume_google_delete_verification(p_user_id uuid,p_session_id uuid,p_token_hash text)
returns boolean language plpgsql security definer set search_path='' as $$
declare affected integer;
begin
  delete from public.google_delete_verifications where user_id=p_user_id and session_id=p_session_id
    and token_hash=p_token_hash and expires_at>clock_timestamp();
  get diagnostics affected=row_count;
  return affected=1;
end; $$;
revoke all on function public.issue_google_delete_verification(uuid,uuid,text) from public,anon,authenticated;
revoke all on function public.consume_google_delete_verification(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.issue_google_delete_verification(uuid,uuid,text) to service_role;
grant execute on function public.consume_google_delete_verification(uuid,uuid,text) to service_role;
commit;
