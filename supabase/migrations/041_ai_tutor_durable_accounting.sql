-- Keep provider spend accountable after a request times out or its concurrency lease expires.
begin;

-- Serialize the legacy accounting snapshot with outstanding RPC transactions.
-- These locks and every imported debit roll back together if deployment is interrupted.
lock table public.ai_tutor_budget, public.ai_tutor_reservations,
  public.ai_tutor_daily_usage in access exclusive mode;

create table public.ai_tutor_usage_ledger (
  request_id uuid primary key,
  user_id uuid references auth.users(id) on delete set null,
  usage_date date not null,
  reserved_tokens integer not null check (reserved_tokens > 0),
  daily_message_limit integer not null check (daily_message_limit between 1 and 1000),
  actual_tokens integer check (actual_tokens >= 0),
  message_counted boolean not null default false,
  created_at timestamptz not null default clock_timestamp(),
  settled_at timestamptz,
  constraint ai_tutor_usage_ledger_settlement_shape check (
    (actual_tokens is null and settled_at is null)
    or (actual_tokens is not null and settled_at is not null)
  )
);

create index ai_tutor_usage_ledger_user_date_idx
  on public.ai_tutor_usage_ledger (user_id, usage_date);

alter table public.ai_tutor_usage_ledger enable row level security;
revoke all on public.ai_tutor_usage_ledger from public, anon, authenticated;
grant all on public.ai_tutor_usage_ledger to service_role;

-- The old schema did not retain per-request limits; its default is the only
-- recoverable value for legacy reservations. Expired leases still represent
-- potentially billed work and must be imported before any lease cleanup.
insert into public.ai_tutor_usage_ledger (
  request_id, user_id, usage_date, reserved_tokens, daily_message_limit, created_at
)
select request_id, user_id, (created_at at time zone 'America/New_York')::date,
  reserved_tokens, 15, created_at
from public.ai_tutor_reservations;

do $$
begin
  if not exists (select 1 from public.ai_tutor_budget where id = 1) then
    raise exception 'Tutor budget is missing; existing holds cannot be migrated safely';
  end if;
end;
$$;

update public.ai_tutor_budget
set tokens_used = tokens_used + (
    select coalesce(sum(reserved_tokens), 0) from public.ai_tutor_usage_ledger
  ), updated_at = clock_timestamp()
where id = 1;

-- Retain an inert legacy signature so old deployments can never authorize new
-- provider work, even if an owner-level caller bypasses execution privileges.
create or replace function public.reserve_ai_tutor_request(
  target_user_id uuid,
  target_request_id uuid,
  token_reservation integer default 5000,
  daily_message_limit integer default 15,
  concurrent_limit integer default 3,
  per_user_minute_limit integer default 3,
  global_minute_limit integer default 12
)
returns jsonb
language sql
immutable
security invoker
set search_path = ''
as $$ select jsonb_build_object('status', 'invalid'); $$;

create or replace function public.reserve_ai_tutor_request_v2(
  target_user_id uuid,
  target_request_id uuid,
  token_reservation integer default 5000,
  daily_message_limit integer default 15,
  concurrent_limit integer default 3,
  per_user_minute_limit integer default 3,
  global_minute_limit integer default 12
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  budget public.ai_tutor_budget%rowtype;
  usage public.ai_tutor_daily_usage%rowtype;
  request_time timestamptz;
  today_et date;
  active_count bigint;
begin
  if target_user_id is null or target_request_id is null
    or token_reservation is null or token_reservation not between 1 and 1000000
    or daily_message_limit is null or daily_message_limit not between 1 and 1000
    or concurrent_limit is null or concurrent_limit not between 1 and 100
    or per_user_minute_limit is null or per_user_minute_limit not between 1 and 1000
    or global_minute_limit is null or global_minute_limit not between 1 and 10000 then
    return jsonb_build_object('status', 'invalid');
  end if;

  -- Every accounting RPC takes this lock before ledger, leases, and daily usage.
  select * into budget from public.ai_tutor_budget where id = 1 for update;
  if not found then return jsonb_build_object('status', 'unavailable'); end if;
  -- A queued caller starts its lease and daily window when it actually reserves.
  request_time := clock_timestamp();
  today_et := (request_time at time zone 'America/New_York')::date;
  if not exists (select 1 from auth.users where id = target_user_id) then
    return jsonb_build_object('status', 'invalid');
  end if;
  -- A repeated ID must never authorize a second provider call, even after expiry.
  if exists (select 1 from public.ai_tutor_usage_ledger where request_id = target_request_id) then
    return jsonb_build_object('status', 'duplicate');
  end if;

  delete from public.ai_tutor_reservations where expires_at <= request_time;
  if exists (select 1 from public.ai_tutor_reservations where user_id = target_user_id) then
    return jsonb_build_object('status', 'active');
  end if;

  insert into public.ai_tutor_daily_usage (user_id, usage_date)
  values (target_user_id, today_et) on conflict (user_id, usage_date) do nothing;
  select * into usage from public.ai_tutor_daily_usage
    where user_id = target_user_id and usage_date = today_et for update;

  if usage.messages_used >= daily_message_limit then
    return jsonb_build_object('status', 'daily_limit', 'messages_remaining', 0);
  end if;
  if usage.minute_window_started_at <= request_time - interval '1 minute' then
    update public.ai_tutor_daily_usage
      set minute_window_started_at = request_time, minute_window_count = 0
      where user_id = target_user_id and usage_date = today_et;
    usage.minute_window_count := 0;
  end if;
  if usage.minute_window_count >= per_user_minute_limit then
    return jsonb_build_object('status', 'rate_limited');
  end if;
  if budget.global_window_started_at <= request_time - interval '1 minute' then
    update public.ai_tutor_budget
      set global_window_started_at = request_time, global_window_count = 0 where id = 1;
    budget.global_window_count := 0;
  end if;
  if budget.global_window_count >= global_minute_limit then
    return jsonb_build_object('status', 'busy');
  end if;

  select count(*) into active_count from public.ai_tutor_reservations;
  if active_count >= concurrent_limit then return jsonb_build_object('status', 'busy'); end if;
  -- tokens_used already includes every unsettled estimate; do not add leases again.
  if budget.tokens_used::numeric + token_reservation + budget.safety_tokens > budget.token_limit then
    return jsonb_build_object('status', 'pool_exhausted');
  end if;

  insert into public.ai_tutor_usage_ledger (
    request_id, user_id, usage_date, reserved_tokens, daily_message_limit, created_at
  ) values (target_request_id, target_user_id, today_et, token_reservation, daily_message_limit, request_time);
  insert into public.ai_tutor_reservations (request_id, user_id, reserved_tokens, created_at, expires_at)
    values (target_request_id, target_user_id, token_reservation, request_time, request_time + interval '90 seconds');
  update public.ai_tutor_daily_usage set minute_window_count = minute_window_count + 1
    where user_id = target_user_id and usage_date = today_et;
  update public.ai_tutor_budget
    set tokens_used = tokens_used + token_reservation,
      global_window_count = global_window_count + 1, updated_at = request_time where id = 1;

  return jsonb_build_object('status', 'reserved',
    'accounting_version', 2,
    'messages_remaining', daily_message_limit - usage.messages_used);
end;
$$;

create or replace function public.finish_ai_tutor_request(
  target_request_id uuid,
  actual_tokens integer,
  count_message boolean,
  charge_tokens boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  entry public.ai_tutor_usage_ledger%rowtype;
  budget public.ai_tutor_budget%rowtype;
  used_messages integer;
  known_usage boolean;
begin
  if target_request_id is null or count_message is null or charge_tokens is null
    or (actual_tokens is not null and actual_tokens not between 0 and 1000000) then
    return jsonb_build_object('status', 'invalid');
  end if;
  known_usage := charge_tokens and actual_tokens is not null;
  select * into budget from public.ai_tutor_budget where id = 1 for update;
  if not found then return jsonb_build_object('status', 'unavailable'); end if;
  select * into entry from public.ai_tutor_usage_ledger
    where request_id = target_request_id for update;
  if not found then return jsonb_build_object('status', 'missing'); end if;

  -- Expiry and uncertain failures release concurrency, never a potentially billed hold.
  delete from public.ai_tutor_reservations where request_id = target_request_id;
  if entry.actual_tokens is null then
    if known_usage then
      -- Fail closed if an external counter reset removed an outstanding hold.
      if budget.tokens_used < entry.reserved_tokens then
        raise exception 'Tutor budget no longer contains this request hold';
      end if;
      update public.ai_tutor_budget
        set tokens_used = tokens_used - entry.reserved_tokens + actual_tokens,
          updated_at = clock_timestamp() where id = 1;
      update public.ai_tutor_usage_ledger
        set actual_tokens = finish_ai_tutor_request.actual_tokens, settled_at = clock_timestamp()
        where request_id = target_request_id;
    end if;
    if count_message and not entry.message_counted then
      if entry.user_id is not null then
        insert into public.ai_tutor_daily_usage (user_id, usage_date, messages_used)
          values (entry.user_id, entry.usage_date, 1)
        on conflict (user_id, usage_date) do update
          set messages_used = public.ai_tutor_daily_usage.messages_used + 1;
      end if;
      update public.ai_tutor_usage_ledger set message_counted = true where request_id = target_request_id;
    end if;
  end if;
  -- Once exact usage settles, retries (including conflicting flags) cannot mutate it.
  select messages_used into used_messages from public.ai_tutor_daily_usage
    where user_id = entry.user_id and usage_date = entry.usage_date;
  return jsonb_build_object('status', 'finished',
    'accounting', case when entry.actual_tokens is not null or known_usage then 'settled' else 'held' end,
    'messages_remaining', greatest(0, entry.daily_message_limit - coalesce(used_messages, 0)));
end;
$$;

revoke all on function public.reserve_ai_tutor_request(uuid, uuid, integer, integer, integer, integer, integer)
  from public, anon, authenticated, service_role;
revoke all on function public.reserve_ai_tutor_request_v2(uuid, uuid, integer, integer, integer, integer, integer)
  from public, anon, authenticated;
revoke all on function public.finish_ai_tutor_request(uuid, integer, boolean, boolean)
  from public, anon, authenticated;
grant execute on function public.reserve_ai_tutor_request_v2(uuid, uuid, integer, integer, integer, integer, integer)
  to service_role;
grant execute on function public.finish_ai_tutor_request(uuid, integer, boolean, boolean) to service_role;

commit;
