-- Bound active timing history while retaining exact lifetime display metrics.
-- Gate/drain practice writes and deploy with the v2 app. No deployment is run here.
begin;
lock table public.practice_attempt_state, public.practice_attempts, public.question_progress in access exclusive mode;

-- Unexpected historical values need operator review, not silent data loss.
-- Legacy null elements are supported: the old JavaScript display treated them as 0.
do $$
begin
  if not exists (select 1 from pg_catalog.pg_trigger
    where tgrelid = 'public.question_progress'::regclass
      and tgname = 'question_progress_set_updated_at' and tgenabled = 'O') then
    raise exception 'Unexpected practice timestamp trigger; review before migrating';
  end if;
  if exists (select 1 from public.question_progress where coalesce(array_ndims(correct_times_ms), 1) <> 1)
    or exists (select 1 from public.question_progress p, unnest(p.correct_times_ms) ms
      where ms is not null and (ms < 0 or ms > 86400000)) then
    raise exception 'Unexpected practice timing history; review before migrating';
  end if;
end;
$$;

create table public.practice_timing_legacy_archive (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id integer not null,
  correct_times_ms bigint[] not null,
  archived_at timestamptz not null default clock_timestamp(),
  primary key (user_id, question_id)
);
alter table public.practice_timing_legacy_archive enable row level security;
revoke all on public.practice_timing_legacy_archive from public, anon, authenticated, service_role;
-- Pre-migration samples remain recoverable by an authorized database administrator,
-- including short histories that may roll out of the recent window in the future.
-- This archive is never appended to by gameplay and never sent to browsers.
insert into public.practice_timing_legacy_archive(user_id, question_id, correct_times_ms)
select user_id, question_id, correct_times_ms from public.question_progress
where cardinality(correct_times_ms) > 0;

alter table public.question_progress
  add column timing_count bigint not null default 0,
  add column timing_total_seconds bigint not null default 0,
  add column timing_best_seconds integer;

-- Preserve existing updated_at, last-attempt/correct dates and all counters.
alter table public.question_progress disable trigger question_progress_set_updated_at;
update public.question_progress p
set (timing_count, timing_total_seconds, timing_best_seconds, correct_times_ms) = (
  select count(*), coalesce(sum(floor(coalesce(ms, 0)::numeric / 1000)), 0),
    min(floor(coalesce(ms, 0)::numeric / 1000)),
    coalesce(array_agg(ms order by ord) filter (where ord > cardinality(p.correct_times_ms) - 100), '{}'::bigint[])
  from unnest(p.correct_times_ms) with ordinality as samples(ms, ord)
);
alter table public.question_progress enable trigger question_progress_set_updated_at;

alter table public.question_progress
  add constraint practice_recent_times_bounded check (
    cardinality(correct_times_ms) <= 100 and coalesce(array_ndims(correct_times_ms), 1) = 1
    and (cardinality(correct_times_ms) = 0 or array_lower(correct_times_ms, 1) = 1)),
  add constraint practice_timing_aggregate_valid check (
    timing_count between 0 and 9007199254740991
    and timing_count >= cardinality(correct_times_ms)
    and timing_total_seconds between 0 and 9007199254740991
    and timing_total_seconds::numeric <= timing_count::numeric * 86400
    and ((timing_count = 0 and timing_total_seconds = 0 and timing_best_seconds is null)
      or (timing_count > 0 and timing_best_seconds is not null
        and timing_best_seconds between 0 and 86400
        and timing_total_seconds::numeric >= timing_count::numeric * timing_best_seconds))
  );

create or replace function public.finish_practice_attempt_v2(
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
    select * into progress_row from public.question_progress
    where user_id = target_user_id and question_id = target_question_id;
    if not found then return jsonb_build_object('status', 'invalid'); end if;
    return jsonb_set(attempt_row.response_snapshot, '{progress}', (attempt_row.response_snapshot->'progress') || jsonb_build_object(
      'times', coalesce(progress_row.correct_times_ms, '{}'::bigint[]),
      'timing', jsonb_build_object('count', progress_row.timing_count,
        'totalSeconds', progress_row.timing_total_seconds, 'bestSeconds', progress_row.timing_best_seconds)));
  end if;
  select coalesce(array_agg(event), '{}'::timestamptz[]) into starts
  from unnest(state_row.recent_starts) event where event > operation_time - interval '1 minute';
  select coalesce(array_agg(event), '{}'::timestamptz[]) into finishes
  from unnest(state_row.recent_finishes) event where event > operation_time - interval '1 minute';
  if cardinality(finishes) >= 30 then return jsonb_build_object('status', 'rate_limited'); end if;

  -- Existing scoring, reachable only through a bound, uncompleted attempt.
  -- Correctness is evaluated by the authenticated server against its question bank.
  insert into public.question_progress(user_id, question_id, attempts, correct, correct_times_ms, timing_count, timing_total_seconds, timing_best_seconds, last_result, last_attempted_at, last_correct_at)
  values (target_user_id, target_question_id, 1, case when result_value = 'correct' then 1 else 0 end,
    case when result_value = 'correct' then array[elapsed_ms] else '{}'::integer[] end,
    case when result_value = 'correct' then 1 else 0 end,
    case when result_value = 'correct' then elapsed_ms / 1000 else 0 end,
    case when result_value = 'correct' then elapsed_ms / 1000 else null end,
    result_value, operation_time, case when result_value = 'correct' then operation_time else null end)
  on conflict (user_id, question_id) do update set
    attempts = question_progress.attempts + 1,
    correct = question_progress.correct + case when result_value = 'correct' then 1 else 0 end,
    correct_times_ms = (question_progress.correct_times_ms || excluded.correct_times_ms)
      [greatest(1, cardinality(question_progress.correct_times_ms) + cardinality(excluded.correct_times_ms) - 99):],
    timing_count = question_progress.timing_count + excluded.timing_count,
    timing_total_seconds = question_progress.timing_total_seconds + excluded.timing_total_seconds,
    timing_best_seconds = least(question_progress.timing_best_seconds, excluded.timing_best_seconds),
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
    completed_at = operation_time, selected_answer = finish_practice_attempt_v2.selected_answer,
    result_value = finish_practice_attempt_v2.result_value, elapsed_ms = finish_practice_attempt_v2.elapsed_ms, response_snapshot = snapshot
  where a.id = target_attempt_id and a.user_id = target_user_id;
  update public.practice_attempt_state set recent_starts = starts, recent_finishes = finishes || operation_time
  where user_id = target_user_id;
  return jsonb_set(snapshot, '{progress}', (snapshot->'progress') || jsonb_build_object(
      'times', coalesce(progress_row.correct_times_ms, '{}'::bigint[]),
      'timing', jsonb_build_object('count', progress_row.timing_count,
        'totalSeconds', progress_row.timing_total_seconds, 'bestSeconds', progress_row.timing_best_seconds)));
end;
$$;

-- Older app deployments must not bypass aggregate maintenance.
create or replace function public.finish_practice_attempt(
  target_user_id uuid, target_attempt_id uuid, target_question_id integer,
  award_trainer_level boolean, selected_answer text, result_value text, elapsed_ms integer
)
returns jsonb language sql immutable security invoker set search_path = ''
as $$ select jsonb_build_object('status', 'invalid'); $$;
revoke all on function public.finish_practice_attempt(uuid,uuid,integer,boolean,text,text,integer) from public, anon, authenticated, service_role;
revoke all on function public.finish_practice_attempt_v2(uuid,uuid,integer,boolean,text,text,integer) from public, anon, authenticated, service_role;
grant execute on function public.finish_practice_attempt_v2(uuid,uuid,integer,boolean,text,text,integer) to service_role;
commit;
