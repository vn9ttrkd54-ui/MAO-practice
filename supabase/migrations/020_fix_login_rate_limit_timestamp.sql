-- Avoid colliding with PostgreSQL's CURRENT_TIME keyword in login throttling.

create or replace function public.consume_login_attempt(
  attempt_identifier text,
  max_attempts integer default 8,
  window_seconds integer default 900,
  block_seconds integer default 900
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  entry public.login_rate_limits%rowtype;
  now_at timestamptz := now();
begin
  insert into public.login_rate_limits(identifier, attempt_count, window_started_at)
  values (attempt_identifier, 0, now_at)
  on conflict (identifier) do nothing;

  select * into entry
  from public.login_rate_limits
  where identifier = attempt_identifier
  for update;

  if entry.blocked_until is not null and entry.blocked_until > now_at then
    return false;
  end if;

  if entry.window_started_at <= now_at - make_interval(secs => window_seconds) then
    update public.login_rate_limits
    set attempt_count = 1,
        window_started_at = now_at,
        blocked_until = null
    where identifier = attempt_identifier;
    return true;
  end if;

  if entry.attempt_count + 1 > max_attempts then
    update public.login_rate_limits
    set attempt_count = entry.attempt_count + 1,
        blocked_until = now_at + make_interval(secs => block_seconds)
    where identifier = attempt_identifier;
    return false;
  end if;

  update public.login_rate_limits
  set attempt_count = entry.attempt_count + 1
  where identifier = attempt_identifier;
  return true;
end;
$$;

revoke all on function public.consume_login_attempt(text, integer, integer, integer) from public;
grant execute on function public.consume_login_attempt(text, integer, integer, integer) to service_role;
