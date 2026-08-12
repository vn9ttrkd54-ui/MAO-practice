-- Server-verified practice progress and durable login throttling.

create table if not exists public.login_rate_limits (
  identifier text primary key,
  attempt_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz
);

alter table public.login_rate_limits enable row level security;

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
  current_time timestamptz := now();
begin
  insert into public.login_rate_limits(identifier, attempt_count, window_started_at)
  values (attempt_identifier, 0, current_time)
  on conflict (identifier) do nothing;

  select * into entry
  from public.login_rate_limits
  where identifier = attempt_identifier
  for update;

  if entry.blocked_until is not null and entry.blocked_until > current_time then
    return false;
  end if;

  if entry.window_started_at <= current_time - make_interval(secs => window_seconds) then
    update public.login_rate_limits
    set attempt_count = 1,
        window_started_at = current_time,
        blocked_until = null
    where identifier = attempt_identifier;
    return true;
  end if;

  if entry.attempt_count + 1 > max_attempts then
    update public.login_rate_limits
    set attempt_count = entry.attempt_count + 1,
        blocked_until = current_time + make_interval(secs => block_seconds)
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

create or replace function public.clear_login_attempts(attempt_identifier text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.login_rate_limits where identifier = attempt_identifier;
$$;

revoke all on function public.clear_login_attempts(text) from public;
grant execute on function public.clear_login_attempts(text) to service_role;

create or replace function public.record_verified_practice_result(
  target_user_id uuid,
  target_question_id integer,
  result_value text,
  elapsed_ms integer,
  award_trainer_level boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := target_user_id;
  progress_row public.question_progress%rowtype;
  level_row public.user_levels%rowtype;
  old_level integer;
  old_progress integer;
begin
  if current_user_id is null then raise exception 'User is required'; end if;
  if result_value not in ('correct', 'incorrect', 'give-up') then raise exception 'Invalid result'; end if;
  if elapsed_ms < 0 or elapsed_ms > 86400000 then raise exception 'Invalid elapsed time'; end if;

  insert into public.question_progress(user_id, question_id, attempts, correct, correct_times_ms, last_result, last_attempted_at, last_correct_at)
  values (
    current_user_id,
    target_question_id,
    1,
    case when result_value = 'correct' then 1 else 0 end,
    case when result_value = 'correct' then array[elapsed_ms] else '{}'::integer[] end,
    result_value,
    now(),
    case when result_value = 'correct' then now() else null end
  )
  on conflict (user_id, question_id) do update set
    attempts = question_progress.attempts + 1,
    correct = question_progress.correct + case when result_value = 'correct' then 1 else 0 end,
    correct_times_ms = case when result_value = 'correct'
      then coalesce(question_progress.correct_times_ms, '{}'::integer[]) || elapsed_ms
      else question_progress.correct_times_ms end,
    last_result = result_value,
    last_attempted_at = now(),
    last_correct_at = case when result_value = 'correct' then now() else question_progress.last_correct_at end
  returning * into progress_row;

  if award_trainer_level then
    insert into public.user_levels(user_id) values (current_user_id)
    on conflict (user_id) do nothing;

    select * into level_row from public.user_levels
    where user_id = current_user_id for update;
    old_level := level_row.level;
    old_progress := level_row.progress;

    if result_value = 'correct' and level_row.progress + 1 >= 30 then
      update public.user_levels set level = level + 1, progress = 0
      where user_id = current_user_id returning * into level_row;
    elsif result_value = 'correct' then
      update public.user_levels set progress = progress + 1
      where user_id = current_user_id returning * into level_row;
    else
      update public.user_levels set progress = greatest(0, progress - 1)
      where user_id = current_user_id returning * into level_row;
    end if;
  end if;

  return jsonb_build_object(
    'progress', jsonb_build_object(
      'attempts', progress_row.attempts,
      'correct', progress_row.correct,
      'times', coalesce(progress_row.correct_times_ms, '{}'::integer[]),
      'lastResult', progress_row.last_result,
      'lastCorrectAt', case when progress_row.last_correct_at is null then null else extract(epoch from progress_row.last_correct_at) * 1000 end
    ),
    'levelChange', case when award_trainer_level then jsonb_build_object(
      'previousLevel', old_level,
      'previousProgress', old_progress,
      'level', level_row.level,
      'progress', level_row.progress,
      'leveledUp', level_row.level > old_level
    ) else null end
  );
end;
$$;

revoke all on function public.record_verified_practice_result(uuid, integer, text, integer, boolean) from public;
grant execute on function public.record_verified_practice_result(uuid, integer, text, integer, boolean) to service_role;

drop policy if exists "Users can insert their own question progress" on public.question_progress;
drop policy if exists "Users can update their own question progress" on public.question_progress;
drop policy if exists "Users can delete their own question progress" on public.question_progress;
drop policy if exists "Users can update their own level" on public.user_levels;
