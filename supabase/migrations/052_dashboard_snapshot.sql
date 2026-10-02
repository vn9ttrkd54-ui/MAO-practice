-- Additive, read-only dashboard projection. Requires the durable history in 049.
-- No table rewrite, cleanup, new cache, or change to session/result writes.
begin;

create or replace function public.get_dashboard_snapshot(p_question_ids integer[])
returns jsonb
language plpgsql stable security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_snapshot jsonb;
begin
  if v_user is null then
    raise exception 'Sign in to view your dashboard.' using errcode = '42501';
  end if;
  if p_question_ids is null or cardinality(p_question_ids) > 10000
    or array_position(p_question_ids, null) is not null then
    raise exception 'Invalid question catalog.' using errcode = '22023';
  end if;

  -- One statement snapshot, always scoped to auth.uid(). RLS still applies.
  with catalog as materialized (
    select distinct unnest(p_question_ids) as id
  ), progress as materialized (
    select p.question_id, p.last_result, p.last_attempted_at
    from public.question_progress p join catalog c on c.id = p.question_id
    where p.user_id = v_user
  ), bookmarks as materialized (
    select b.question_id, b.created_at from public.bookmarks b
    join catalog c on c.id = b.question_id where b.user_id = v_user
  ), result_counts as (
    select r.session_id, count(*) as answered,
      count(*) filter (where r.result = 'correct') as correct,
      count(*) filter (where r.result = 'incorrect') as incorrect,
      count(*) filter (where r.result = 'give-up') as give_ups
    from public.trainer_results r where r.user_id = v_user group by r.session_id
  ), sessions as materialized (
    select s.id, s.division, s.started_at, s.ended_at, s.starting_level,
      s.starting_progress, s.ending_level, s.ending_progress,
      coalesce(r.answered, 0) as answered, coalesce(r.correct, 0) as correct,
      coalesce(r.incorrect, 0) as incorrect, coalesce(r.give_ups, 0) as give_ups,
      coalesce(round(100.0 * r.correct / nullif(r.answered, 0)), 0) as accuracy
    from public.trainer_sessions s left join result_counts r on r.session_id = s.id
    where s.user_id = v_user
  ), trainer_totals as (
    select count(*) as completed, coalesce(sum(answered), 0) as answered,
      coalesce(sum(correct), 0) as correct, coalesce(sum(incorrect), 0) as incorrect,
      coalesce(sum(give_ups), 0) as give_ups,
      coalesce(round(avg(answered), 1), 0) as average_questions,
      coalesce(round(avg(greatest(0, extract(epoch from ended_at - started_at)))), 0) as average_seconds
    from sessions
  ), recent_eight as (
    select * from sessions order by ended_at desc, id desc limit 8
  ), recent_five as (
    select * from recent_eight order by ended_at desc, id desc limit 5
  ), best_session as (
    select accuracy, correct from sessions order by accuracy desc, correct desc, id desc limit 1
  ), matches as materialized (
    select h.room_id, h.placement, h.finalized_at from public.multiplayer_match_history h
    where h.user_id = v_user and h.ranked
    union all
    -- Include not-yet-archived results, without counting archived matches twice.
    select r.room_id, r.placement, r.finalized_at from public.multiplayer_match_results r
    where r.user_id = v_user and r.ranked and not exists (
      select 1 from public.multiplayer_match_history h where h.user_id = v_user and h.room_id = r.room_id
    )
  ), ordered_matches as (
    select placement, row_number() over (order by finalized_at desc, room_id desc) as position from matches
  ), activity as (
    select 'question-' || p.question_id || '-' || p.last_attempted_at as id,
      'question'::text as type, p.last_attempted_at as occurred_at,
      p.question_id, p.last_result as result, null::text as division,
      null::bigint as answered, null::numeric as accuracy
    from progress p where p.last_result is not null and p.last_attempted_at is not null
    union all
    select 'bookmark-' || b.question_id || '-' || b.created_at, 'bookmark', b.created_at,
      b.question_id, null, null, null, null from bookmarks b
    union all
    select 'trainer-' || s.id, 'trainer-session', s.ended_at, null, null,
      s.division, s.answered, s.accuracy from sessions s
  ), recent_activity as (
    select * from activity order by occurred_at desc, type, id desc limit 10
  )
  select jsonb_build_object(
    'version', 1, 'userId', v_user,
    'username', (select p.username from public.profiles p where p.id = v_user),
    'isAdmin', coalesce((select p.role in ('admin', 'owner') from public.profiles p where p.id = v_user), false),
    'level', coalesce((select jsonb_build_object('level', l.level, 'progress', l.progress)
      from public.user_levels l where l.user_id = v_user), '{"level":1,"progress":0}'::jsonb),
    'trainer', jsonb_build_object(
      'sessionsCompleted', t.completed, 'questionsAnswered', t.answered,
      'correct', t.correct, 'incorrect', t.incorrect, 'giveUps', t.give_ups,
      'accuracy', coalesce(round(100.0 * t.correct / nullif(t.answered, 0)), 0),
      'score', t.correct - t.incorrect - t.give_ups,
      'averageQuestionsPerSession', t.average_questions, 'averageSessionDurationSeconds', t.average_seconds,
      'bestSessionAccuracy', coalesce((select accuracy from best_session), 0),
      'bestSessionCorrect', coalesce((select correct from best_session), 0),
      'recentSessionAccuracy', coalesce((select jsonb_agg(jsonb_build_object(
        'id', s.id, 'endedAt', extract(epoch from s.ended_at) * 1000,
        'accuracy', s.accuracy, 'questionsAnswered', s.answered
      ) order by s.ended_at, s.id) from recent_eight s), '[]'::jsonb),
      'sessionsByDivision', (select jsonb_agg(jsonb_build_object('division', d.name,
        'sessions', (select count(*) from sessions s where s.division = d.name)) order by d.position)
        from (values ('Mu',1), ('Alpha',2), ('Theta',3)) as d(name,position))
    ),
    'questionBank', jsonb_build_object(
      'totalQuestions', (select count(*) from catalog),
      'solved', (select count(*) from progress where last_result = 'correct'),
      'attempted', (select count(*) from progress where last_result in ('incorrect', 'give-up')),
      'newQuestions', (select count(*) from catalog) - (select count(*) from progress where last_result is not null),
      'bookmarked', (select count(*) from bookmarks)
    ),
    'challenge', jsonb_build_object(
      'currentStreak', case when (select max(a.challenge_date) from public.challenge_attempts a where a.user_id = v_user)
        >= (current_timestamp at time zone 'UTC')::date - 1
        then coalesce((select s.current_streak from public.challenge_user_statistics s where s.user_id = v_user), 0) else 0 end,
      'longestStreak', coalesce((select s.longest_streak from public.challenge_user_statistics s where s.user_id = v_user), 0)
    ),
    'multiplayer', jsonb_build_object(
      'rp', coalesce((select p.rp from public.multiplayer_profiles p where p.user_id = v_user), 0),
      'rankedMatchesPlayed', coalesce((select p.ranked_matches_played from public.multiplayer_profiles p where p.user_id = v_user), 0),
      'rankedWins', coalesce((select p.ranked_wins from public.multiplayer_profiles p where p.user_id = v_user), 0),
      'averagePlacement', (select avg(placement) from matches),
      'currentStreak', (select coalesce(min(position) filter (where placement <> 1) - 1, count(*)) from ordered_matches)
    ),
    'recentTrainerSessions', coalesce((select jsonb_agg(jsonb_build_object(
      'id', s.id, 'division', s.division, 'endedAt', extract(epoch from s.ended_at) * 1000,
      'startingLevel', jsonb_build_object('level', s.starting_level, 'progress', s.starting_progress),
      'endingLevel', jsonb_build_object('level', s.ending_level, 'progress', s.ending_progress),
      'stats', jsonb_build_object('questionsAnswered', s.answered, 'correct', s.correct,
        'incorrect', s.incorrect, 'giveUps', s.give_ups, 'accuracy', s.accuracy)
    ) order by s.ended_at desc, s.id desc) from recent_five s), '[]'::jsonb),
    'recentActivity', coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
      'id', a.id, 'type', a.type, 'occurredAt', extract(epoch from a.occurred_at) * 1000,
      'questionId', a.question_id, 'result', a.result, 'division', a.division,
      'questionsAnswered', a.answered, 'accuracy', a.accuracy
    )) order by a.occurred_at desc, a.type, a.id desc) from recent_activity a), '[]'::jsonb)
  ) into v_snapshot from trainer_totals t;
  return v_snapshot;
end;
$$;

revoke all on function public.get_dashboard_snapshot(integer[]) from public, anon;
grant execute on function public.get_dashboard_snapshot(integer[]) to authenticated;
notify pgrst, 'reload schema';
commit;
