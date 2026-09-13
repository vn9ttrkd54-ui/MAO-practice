-- A daily slot outlives the short concurrency lease, just like its token hold.
-- Gate/drain accounting calls before replacing the functions (see rollout guide).
begin;

lock table public.ai_tutor_budget, public.ai_tutor_usage_ledger,
  public.ai_tutor_reservations, public.ai_tutor_daily_usage in access exclusive mode;

-- Existing ledger state already distinguishes unresolved work from confirmed
-- failures and counted answers. No history is deleted, rewritten or refunded.
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
  pending_messages bigint;
begin
  if target_user_id is null or target_request_id is null
    or token_reservation is null or token_reservation not between 1 and 1000000
    or daily_message_limit is null or daily_message_limit not between 1 and 1000
    or concurrent_limit is null or concurrent_limit not between 1 and 100
    or per_user_minute_limit is null or per_user_minute_limit not between 1 and 1000
    or global_minute_limit is null or global_minute_limit not between 1 and 10000 then
    return jsonb_build_object('status', 'invalid');
  end if;

  -- Same lock order as settlement: serialize slot and token admission together.
  select * into budget from public.ai_tutor_budget where id = 1 for update;
  if not found then return jsonb_build_object('status', 'unavailable'); end if;
  request_time := clock_timestamp();
  today_et := (request_time at time zone 'America/New_York')::date;
  if not exists (select 1 from auth.users where id = target_user_id) then
    return jsonb_build_object('status', 'invalid');
  end if;
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

  -- Unknown outcomes can still finish successfully later. Releasing their lease
  -- must not free a daily slot. Counted successes are already in messages_used;
  -- settled failures (including known zero) no longer occupy an uncounted slot.
  select count(*) into pending_messages from public.ai_tutor_usage_ledger
    where user_id = target_user_id and usage_date = today_et
      and actual_tokens is null and not message_counted;
  if usage.messages_used::bigint + pending_messages >= daily_message_limit then
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

  -- Preserve the pre-current-request remaining convention for older v2 callers.
  return jsonb_build_object('status', 'reserved',
    'accounting_version', 2, 'daily_slot_version', 1,
    'messages_remaining', daily_message_limit - usage.messages_used - pending_messages);
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
  pending_messages bigint;
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

  delete from public.ai_tutor_reservations where request_id = target_request_id;
  if entry.actual_tokens is null then
    if known_usage then
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
  -- Monetary and message settlements remain immutable once exact usage settles.
  -- Calculate after the writes, so a pending slot converts to a counted message
  -- once, and known failures release only their own slot.
  select messages_used into used_messages from public.ai_tutor_daily_usage
    where user_id = entry.user_id and usage_date = entry.usage_date;
  select count(*) into pending_messages from public.ai_tutor_usage_ledger pending
    where pending.user_id = entry.user_id and pending.usage_date = entry.usage_date
      and pending.actual_tokens is null and not pending.message_counted;
  return jsonb_build_object('status', 'finished', 'daily_slot_version', 1,
    'accounting', case when entry.actual_tokens is not null or known_usage then 'settled' else 'held' end,
    'messages_remaining', greatest(0, entry.daily_message_limit - coalesce(used_messages, 0) - pending_messages));
end;
$$;

-- Read only: one statement snapshot for both used and unresolved slots. Do not
-- derive the day from a browser clock or mutate leases/counters during a GET.
create or replace function public.get_ai_tutor_allowance(
  target_user_id uuid,
  daily_message_limit integer default 15
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when target_user_id is null or daily_message_limit is null
      or daily_message_limit not between 1 and 1000
      or not exists (select 1 from auth.users where id = target_user_id)
      then jsonb_build_object('status', 'invalid')
    when not exists (select 1 from public.ai_tutor_budget where id = 1)
      then jsonb_build_object('status', 'unavailable')
    else jsonb_build_object('status', 'available', 'daily_slot_version', 1,
      'messages_remaining', greatest(0, daily_message_limit - coalesce((
        select messages_used from public.ai_tutor_daily_usage
        where user_id = target_user_id
          and usage_date = (statement_timestamp() at time zone 'America/New_York')::date
      ), 0)::bigint - (
        select count(*) from public.ai_tutor_usage_ledger
        where user_id = target_user_id
          and usage_date = (statement_timestamp() at time zone 'America/New_York')::date
          and actual_tokens is null and not message_counted
      )))
  end;
$$;

revoke all on function public.reserve_ai_tutor_request_v2(uuid, uuid, integer, integer, integer, integer, integer)
  from public, anon, authenticated;
revoke all on function public.finish_ai_tutor_request(uuid, integer, boolean, boolean)
  from public, anon, authenticated;
revoke all on function public.get_ai_tutor_allowance(uuid, integer)
  from public, anon, authenticated;
grant execute on function public.reserve_ai_tutor_request_v2(uuid, uuid, integer, integer, integer, integer, integer)
  to service_role;
grant execute on function public.finish_ai_tutor_request(uuid, integer, boolean, boolean) to service_role;
grant execute on function public.get_ai_tutor_allowance(uuid, integer) to service_role;

commit;
