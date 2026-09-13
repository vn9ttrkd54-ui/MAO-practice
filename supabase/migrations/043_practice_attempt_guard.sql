-- Server-issued attempts make network retries idempotent. The per-account burst
-- limits are not a human/bot classifier, daily quota, IP ban or minimum solve time.
-- Deploy with the matching app; legacy result writes deliberately fail closed.
begin;

create table public.practice_attempt_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  recent_starts timestamptz[] not null default '{}',
  recent_finishes timestamptz[] not null default '{}',
  constraint practice_start_window_bounded check (cardinality(recent_starts) <= 60),
  constraint practice_finish_window_bounded check (cardinality(recent_finishes) <= 30)
);

create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_request_id uuid not null,
  question_id integer not null,
  award_trainer_level boolean not null,
  created_at timestamptz not null,
  expires_at timestamptz not null,
  completed_at timestamptz,
  selected_answer text check (selected_answer in ('A', 'B', 'C', 'D', 'E')),
  result_value text check (result_value in ('correct', 'incorrect', 'give-up')),
  elapsed_ms integer check (elapsed_ms between 0 and 86400000),
  -- Never duplicate the growing timing history in each receipt. Counters and
  -- level change are immutable; responses attach current times, even on replay.
  response_snapshot jsonb,
  unique (user_id, client_request_id),
  constraint practice_attempt_lifetime check (expires_at > created_at),
  constraint practice_attempt_completion check (
    (completed_at is null and selected_answer is null and result_value is null
      and elapsed_ms is null and response_snapshot is null)
    or (completed_at is not null and result_value is not null and elapsed_ms is not null
      and response_snapshot is not null
      and ((result_value = 'give-up' and selected_answer is null)
        or (result_value in ('correct', 'incorrect') and selected_answer is not null)))
  )
);
create index practice_attempts_user_expiry_idx on public.practice_attempts(user_id, expires_at) where completed_at is null;
create index practice_attempts_user_completed_idx on public.practice_attempts(user_id, completed_at) where completed_at is not null;
alter table public.practice_attempt_state enable row level security;
alter table public.practice_attempts enable row level security;
-- No browser policies or direct API grants: even the server uses the RPCs.
revoke all on public.practice_attempt_state, public.practice_attempts from public, anon, authenticated, service_role;

create or replace function public.begin_practice_attempt(
  target_user_id uuid, target_question_id integer,
  award_trainer_level boolean, client_request_id uuid
)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  attempt_row public.practice_attempts%rowtype;
  state_row public.practice_attempt_state%rowtype;
  found_attempt boolean;
  operation_time timestamptz;
  starts timestamptz[];
  finishes timestamptz[];
begin
  if target_user_id is null or target_question_id is null or target_question_id <= 0
    or award_trainer_level is null or client_request_id is null then
    return jsonb_build_object('status', 'invalid');
  end if;
  -- Shared by both RPCs, per account. Clock is captured after acquiring locks.
  perform pg_catalog.pg_advisory_xact_lock(1936024437, pg_catalog.hashtext(target_user_id::text));
  if not exists (select 1 from auth.users where id = target_user_id) then
    return jsonb_build_object('status', 'invalid');
  end if;
  insert into public.practice_attempt_state(user_id) values (target_user_id) on conflict (user_id) do nothing;
  select * into state_row from public.practice_attempt_state where user_id = target_user_id for update;
  operation_time := clock_timestamp();
  select * into attempt_row from public.practice_attempts a
  where a.user_id = target_user_id and a.client_request_id = begin_practice_attempt.client_request_id;
  found_attempt := found;
  -- Activity-driven retention: completed retry receipts live at least 24h after
  -- submission, even when the original attempt deadline has already passed.
  delete from public.practice_attempts a where a.user_id = target_user_id
    and ((a.completed_at is null and a.expires_at <= operation_time)
      or a.completed_at <= operation_time - interval '24 hours');
  if found_attempt then
    if attempt_row.question_id <> target_question_id or attempt_row.award_trainer_level <> award_trainer_level then
      return jsonb_build_object('status', 'conflict');
    end if;
    if (attempt_row.completed_at is null and attempt_row.expires_at <= operation_time)
      or attempt_row.completed_at <= operation_time - interval '24 hours' then
      return jsonb_build_object('status', 'expired');
    end if;
    return jsonb_build_object('status', 'started', 'attemptId', attempt_row.id);
  end if;
  select coalesce(array_agg(event), '{}'::timestamptz[]) into starts
  from unnest(state_row.recent_starts) event where event > operation_time - interval '1 minute';
  select coalesce(array_agg(event), '{}'::timestamptz[]) into finishes
  from unnest(state_row.recent_finishes) event where event > operation_time - interval '1 minute';
  if cardinality(starts) >= 60 then return jsonb_build_object('status', 'rate_limited'); end if;
  insert into public.practice_attempts(user_id, client_request_id, question_id, award_trainer_level, created_at, expires_at)
  values (target_user_id, client_request_id, target_question_id, award_trainer_level, operation_time, operation_time + interval '24 hours')
  returning * into attempt_row;
  update public.practice_attempt_state set recent_starts = starts || operation_time, recent_finishes = finishes
  where user_id = target_user_id;
  return jsonb_build_object('status', 'started', 'attemptId', attempt_row.id);
end;
$$;

create or replace function public.finish_practice_attempt(
  target_user_id uuid, target_attempt_id uuid, target_question_id integer,
  award_trainer_level boolean, selected_answer text, result_value text, elapsed_ms integer
)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  attempt_row public.practice_attempts%rowtype;
  state_row public.practice_attempt_state%rowtype;
  progress_row public.question_progress%rowtype;
  level_row public.user_levels%rowtype;
  old_level integer;
  old_progress integer;
  found_attempt boolean;
  operation_time timestamptz;
  starts timestamptz[];
  finishes timestamptz[];
  snapshot jsonb;
  timing_history bigint[];
begin
  if target_user_id is null or target_attempt_id is null
    or target_question_id is null or target_question_id <= 0 or award_trainer_level is null
    or result_value is null or result_value not in ('correct', 'incorrect', 'give-up')
    or elapsed_ms is null or elapsed_ms < 0 or elapsed_ms > 86400000
    or (result_value = 'give-up' and selected_answer is not null)
    or (result_value <> 'give-up' and (selected_answer is null or selected_answer not in ('A', 'B', 'C', 'D', 'E'))) then
    return jsonb_build_object('status', 'invalid');
  end if;
  perform pg_catalog.pg_advisory_xact_lock(1936024437, pg_catalog.hashtext(target_user_id::text));
  -- A missing, foreign or pruned ID never creates a replacement attempt.
  if not exists (select 1 from public.practice_attempt_state where user_id = target_user_id) then
    return jsonb_build_object('status', 'invalid');
  end if;
  select * into state_row from public.practice_attempt_state where user_id = target_user_id for update;
  operation_time := clock_timestamp();
  select * into attempt_row from public.practice_attempts
  where id = target_attempt_id and user_id = target_user_id for update;
  found_attempt := found;
  delete from public.practice_attempts a where a.user_id = target_user_id
    and ((a.completed_at is null and a.expires_at <= operation_time)
      or a.completed_at <= operation_time - interval '24 hours');
  if not found_attempt then return jsonb_build_object('status', 'invalid'); end if;
  if attempt_row.question_id <> target_question_id or attempt_row.award_trainer_level <> award_trainer_level then
    return jsonb_build_object('status', 'conflict');
  end if;
  if (attempt_row.completed_at is null and attempt_row.expires_at <= operation_time)
    or attempt_row.completed_at <= operation_time - interval '24 hours' then
    return jsonb_build_object('status', 'expired');
  end if;
  if attempt_row.completed_at is not null then
    if attempt_row.selected_answer is distinct from selected_answer
      or attempt_row.elapsed_ms <> elapsed_ms then
      return jsonb_build_object('status', 'conflict');
    end if;
    select correct_times_ms into timing_history from public.question_progress
    where user_id = target_user_id and question_id = target_question_id;
    return jsonb_set(attempt_row.response_snapshot, '{progress,times}', to_jsonb(coalesce(timing_history, '{}'::bigint[])));
  end if;
  select coalesce(array_agg(event), '{}'::timestamptz[]) into starts
  from unnest(state_row.recent_starts) event where event > operation_time - interval '1 minute';
  select coalesce(array_agg(event), '{}'::timestamptz[]) into finishes
  from unnest(state_row.recent_finishes) event where event > operation_time - interval '1 minute';
  if cardinality(finishes) >= 30 then return jsonb_build_object('status', 'rate_limited'); end if;

  -- Existing scoring, reachable only through a bound, uncompleted attempt.
  -- Correctness is evaluated by the authenticated server against its question bank.
  insert into public.question_progress(user_id, question_id, attempts, correct, correct_times_ms, last_result, last_attempted_at, last_correct_at)
  values (target_user_id, target_question_id, 1, case when result_value = 'correct' then 1 else 0 end,
    case when result_value = 'correct' then array[elapsed_ms] else '{}'::integer[] end,
    result_value, operation_time, case when result_value = 'correct' then operation_time else null end)
  on conflict (user_id, question_id) do update set
    attempts = question_progress.attempts + 1,
    correct = question_progress.correct + case when result_value = 'correct' then 1 else 0 end,
    correct_times_ms = case when result_value = 'correct'
      then coalesce(question_progress.correct_times_ms, '{}'::bigint[]) || elapsed_ms
      else question_progress.correct_times_ms end,
    last_result = result_value,
    last_attempted_at = operation_time,
    last_correct_at = case when result_value = 'correct' then operation_time else question_progress.last_correct_at end
  returning * into progress_row;
  if award_trainer_level then
    insert into public.user_levels(user_id) values (target_user_id) on conflict (user_id) do nothing;
    select * into level_row from public.user_levels where user_id = target_user_id for update;
    old_level := level_row.level;
    old_progress := level_row.progress;
    if result_value = 'correct' and level_row.progress + 1 >= 30 then
      update public.user_levels set level = level + 1, progress = 0 where user_id = target_user_id returning * into level_row;
    elsif result_value = 'correct' then
      update public.user_levels set progress = progress + 1 where user_id = target_user_id returning * into level_row;
    else
      update public.user_levels set progress = greatest(0, progress - 1) where user_id = target_user_id returning * into level_row;
    end if;
  end if;
  snapshot := jsonb_build_object(
    'status', 'saved', 'isCorrect', result_value = 'correct',
    'progress', jsonb_build_object(
      'attempts', progress_row.attempts, 'correct', progress_row.correct, 'lastResult', progress_row.last_result,
      'lastCorrectAt', case when progress_row.last_correct_at is null then null else extract(epoch from progress_row.last_correct_at) * 1000 end
    ),
    'levelChange', case when award_trainer_level then jsonb_build_object(
      'previousLevel', old_level, 'previousProgress', old_progress,
      'level', level_row.level, 'progress', level_row.progress, 'leveledUp', level_row.level > old_level
    ) else null end
  );
  update public.practice_attempts a set
    completed_at = operation_time, selected_answer = finish_practice_attempt.selected_answer,
    result_value = finish_practice_attempt.result_value, elapsed_ms = finish_practice_attempt.elapsed_ms, response_snapshot = snapshot
  where a.id = target_attempt_id and a.user_id = target_user_id;
  update public.practice_attempt_state set recent_starts = starts, recent_finishes = finishes || operation_time
  where user_id = target_user_id;
  return jsonb_set(snapshot, '{progress,times}', to_jsonb(coalesce(progress_row.correct_times_ms, '{}'::bigint[])));
end;
$$;

-- Retire the bypass instead of leaving unrestricted scoring callable by an older
-- deployment. Even an owner call is now inert and cannot mutate progress.
create or replace function public.record_verified_practice_result(
  target_user_id uuid, target_question_id integer, result_value text,
  elapsed_ms integer, award_trainer_level boolean default false
)
returns jsonb language sql immutable security invoker set search_path = ''
as $$ select jsonb_build_object('status', 'invalid'); $$;
revoke all on function public.record_verified_practice_result(uuid, integer, text, integer, boolean) from public, anon, authenticated, service_role;
revoke all on function public.begin_practice_attempt(uuid, integer, boolean, uuid) from public, anon, authenticated, service_role;
revoke all on function public.finish_practice_attempt(uuid, uuid, integer, boolean, text, text, integer) from public, anon, authenticated, service_role;
grant execute on function public.begin_practice_attempt(uuid, integer, boolean, uuid) to service_role;
grant execute on function public.finish_practice_attempt(uuid, uuid, integer, boolean, text, text, integer) to service_role;
commit;
