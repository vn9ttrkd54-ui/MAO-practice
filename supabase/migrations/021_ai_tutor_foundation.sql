-- Shared budget, daily allowance, and global concurrency controls for the AI tutor.

begin;

create table if not exists public.ai_tutor_budget (
  id smallint primary key default 1 check (id = 1),
  token_limit bigint not null default 1000000 check (token_limit >= 0),
  tokens_used bigint not null default 0 check (tokens_used >= 0),
  safety_tokens bigint not null default 25000 check (safety_tokens >= 0),
  global_window_started_at timestamptz not null default now(),
  global_window_count integer not null default 0 check (global_window_count >= 0),
  updated_at timestamptz not null default now()
);

insert into public.ai_tutor_budget (id)
values (1)
on conflict (id) do nothing;

create table if not exists public.ai_tutor_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  messages_used integer not null default 0 check (messages_used >= 0),
  minute_window_started_at timestamptz not null default now(),
  minute_window_count integer not null default 0 check (minute_window_count >= 0),
  primary key (user_id, usage_date)
);

create table if not exists public.ai_tutor_reservations (
  request_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  reserved_tokens integer not null check (reserved_tokens > 0),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  unique (user_id)
);

create index if not exists ai_tutor_reservations_expires_at_idx
on public.ai_tutor_reservations (expires_at);

alter table public.ai_tutor_budget enable row level security;
alter table public.ai_tutor_daily_usage enable row level security;
alter table public.ai_tutor_reservations enable row level security;

revoke all on public.ai_tutor_budget from anon, authenticated;
revoke all on public.ai_tutor_daily_usage from anon, authenticated;
revoke all on public.ai_tutor_reservations from anon, authenticated;

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
language plpgsql
security definer
set search_path = public
as $$
declare
  budget public.ai_tutor_budget%rowtype;
  usage public.ai_tutor_daily_usage%rowtype;
  today_et date := (now() at time zone 'America/New_York')::date;
  active_count integer;
  active_reserved bigint;
begin
  if target_user_id is null or token_reservation <= 0 then
    return jsonb_build_object('status', 'invalid');
  end if;

  select * into budget
  from public.ai_tutor_budget
  where id = 1
  for update;

  delete from public.ai_tutor_reservations
  where expires_at <= now();

  if exists (
    select 1 from public.ai_tutor_reservations where user_id = target_user_id
  ) then
    return jsonb_build_object('status', 'active');
  end if;

  insert into public.ai_tutor_daily_usage (user_id, usage_date)
  values (target_user_id, today_et)
  on conflict (user_id, usage_date) do nothing;

  select * into usage
  from public.ai_tutor_daily_usage
  where user_id = target_user_id and usage_date = today_et
  for update;

  if usage.messages_used >= daily_message_limit then
    return jsonb_build_object('status', 'daily_limit', 'messages_remaining', 0);
  end if;

  if usage.minute_window_started_at <= now() - interval '1 minute' then
    update public.ai_tutor_daily_usage
    set minute_window_started_at = now(), minute_window_count = 0
    where user_id = target_user_id and usage_date = today_et;
    usage.minute_window_started_at := now();
    usage.minute_window_count := 0;
  end if;

  if usage.minute_window_count >= per_user_minute_limit then
    return jsonb_build_object('status', 'rate_limited');
  end if;

  if budget.global_window_started_at <= now() - interval '1 minute' then
    update public.ai_tutor_budget
    set global_window_started_at = now(), global_window_count = 0
    where id = 1;
    budget.global_window_started_at := now();
    budget.global_window_count := 0;
  end if;

  if budget.global_window_count >= global_minute_limit then
    return jsonb_build_object('status', 'busy');
  end if;

  select count(*), coalesce(sum(reserved_tokens), 0)
  into active_count, active_reserved
  from public.ai_tutor_reservations;

  if active_count >= concurrent_limit then
    return jsonb_build_object('status', 'busy');
  end if;

  if budget.tokens_used + active_reserved + token_reservation + budget.safety_tokens > budget.token_limit then
    return jsonb_build_object('status', 'pool_exhausted');
  end if;

  insert into public.ai_tutor_reservations (
    request_id,
    user_id,
    reserved_tokens,
    expires_at
  ) values (
    target_request_id,
    target_user_id,
    token_reservation,
    now() + interval '90 seconds'
  );

  update public.ai_tutor_daily_usage
  set minute_window_count = minute_window_count + 1
  where user_id = target_user_id and usage_date = today_et;

  update public.ai_tutor_budget
  set global_window_count = global_window_count + 1,
      updated_at = now()
  where id = 1;

  return jsonb_build_object(
    'status', 'reserved',
    'messages_remaining', daily_message_limit - usage.messages_used
  );
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
set search_path = public
as $$
declare
  reservation public.ai_tutor_reservations%rowtype;
  today_et date := (now() at time zone 'America/New_York')::date;
  remaining integer;
begin
  select * into reservation
  from public.ai_tutor_reservations
  where request_id = target_request_id
  for update;

  if reservation.request_id is null then
    return jsonb_build_object('status', 'missing');
  end if;

  delete from public.ai_tutor_reservations
  where request_id = target_request_id;

  if charge_tokens then
    update public.ai_tutor_budget
    set tokens_used = tokens_used + greatest(0, actual_tokens),
        updated_at = now()
    where id = 1;
  end if;

  if count_message then
    insert into public.ai_tutor_daily_usage (user_id, usage_date, messages_used)
    values (reservation.user_id, today_et, 1)
    on conflict (user_id, usage_date)
    do update set messages_used = public.ai_tutor_daily_usage.messages_used + 1;
  end if;

  select greatest(0, 15 - messages_used) into remaining
  from public.ai_tutor_daily_usage
  where user_id = reservation.user_id and usage_date = today_et;

  return jsonb_build_object(
    'status', 'finished',
    'messages_remaining', coalesce(remaining, 15)
  );
end;
$$;

revoke all on function public.reserve_ai_tutor_request(uuid, uuid, integer, integer, integer, integer, integer) from public;
revoke all on function public.finish_ai_tutor_request(uuid, integer, boolean, boolean) from public;
grant execute on function public.reserve_ai_tutor_request(uuid, uuid, integer, integer, integer, integer, integer) to service_role;
grant execute on function public.finish_ai_tutor_request(uuid, integer, boolean, boolean) to service_role;

commit;
