-- MAO Practice: Safe public username availability check
-- Returns only whether a normalized username is available.

create or replace function public.is_username_available(candidate_username text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select
    candidate_username is not null
    and lower(trim(candidate_username)) ~ '^[a-z0-9_]{3,20}$'
    and not exists (
      select 1
      from public.profiles
      where lower(username) = lower(trim(candidate_username))
    );
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;
