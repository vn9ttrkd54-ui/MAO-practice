-- Password signup uses username aliases, not unverified real email addresses.
-- Google identity is established by GoTrue in protected app metadata.
-- INSERT ONLY: existing users, verified email changes and recovery are untouched.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

create function public.guard_password_signup_identity()
returns trigger language plpgsql set search_path='' as $$
declare normalized_username text;
begin
  if new.raw_app_meta_data->>'provider' = 'google' then
    return new;
  end if;
  normalized_username := lower(trim(new.raw_user_meta_data->>'username'));
  if normalized_username is null or normalized_username !~ '^[a-z0-9_]{3,20}$'
    or lower(new.email) is distinct from normalized_username || '@users.mao-practice.local' then
    raise exception 'Password signup requires a username email alias' using errcode='23514';
  end if;
  return new;
end; $$;
revoke all on function public.guard_password_signup_identity() from public,anon,authenticated;

create trigger guard_password_signup_identity
before insert on auth.users
for each row execute function public.guard_password_signup_identity();

commit;
