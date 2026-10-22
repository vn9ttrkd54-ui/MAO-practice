-- Use New York calendar days for assignments, submissions, streaks and ranks.
-- Preserve all existing assignments, attempts, statistics, timestamps and IDs.
-- Deploy together with the application's New York date helper.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '15s';

comment on table public.daily_challenges is 'One code-defined question per America/New_York calendar date and division.';

create or replace function public.submit_challenge_attempt(
 p_user_id uuid,p_challenge_date date,p_question_id text,p_selected_answer text,p_correct boolean
) returns public.challenge_attempts language plpgsql security definer set search_path=public,pg_temp as $$
declare
 submitted_attempt public.challenge_attempts;
 current_days integer;
 longest_days integer;
begin
 if p_challenge_date <> (now() at time zone 'America/New_York')::date then raise exception 'Only today''s Challenge can be submitted.'; end if;
 if p_selected_answer not in ('A','B','C','D','E') then raise exception 'Invalid answer choice.'; end if;
 -- Serialize all submissions for an account, including different divisions.
 insert into public.challenge_user_statistics(user_id) values(p_user_id) on conflict do nothing;
 perform 1 from public.challenge_user_statistics where user_id=p_user_id for update;
 insert into public.challenge_attempts(user_id,challenge_date,question_id,selected_answer,correct)
 values(p_user_id,p_challenge_date,p_question_id,p_selected_answer,p_correct)
 returning * into submitted_attempt;

 -- Collapse divisions to one successful day before calculating streaks.
 with successful_days as (
   select challenge_date d from public.challenge_attempts where user_id=p_user_id group by challenge_date having bool_or(correct)
 ), islands as (
   select d,d-(row_number() over(order by d))::integer grp from successful_days
 ), runs as (
   select max(d) last_day,count(*)::integer days from islands group by grp
 )
 select coalesce(max(days) filter(where last_day=p_challenge_date),0),coalesce(max(days),0)
 into current_days,longest_days from runs;
 update public.challenge_user_statistics set
 current_streak=current_days,longest_streak=greatest(longest_streak,longest_days),
 total_completed=(select count(*) from public.challenge_attempts where user_id=p_user_id),
 total_correct=(select count(*) from public.challenge_attempts where user_id=p_user_id and correct),
 updated_at=timezone('utc',now()) where user_id=p_user_id;
 return submitted_attempt;
end;
$$;

create or replace function public.get_challenge_leaderboard()
returns table (
  user_id uuid,
  username text,
  current_streak integer,
  longest_streak integer,
  rank bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with active_streaks as (
    select
      statistics.user_id,
      profiles.username,
      case
        when latest_attempt.challenge_date >=
          (now() at time zone 'America/New_York')::date - 1
        then statistics.current_streak
        else 0
      end as current_streak,
      statistics.longest_streak,
      today_attempt.submitted_at as today_submitted_at
    from public.challenge_user_statistics statistics
    join public.profiles on profiles.id = statistics.user_id
    left join lateral (
      select attempts.challenge_date
      from public.challenge_attempts attempts
      where attempts.user_id = statistics.user_id
      order by attempts.challenge_date desc
      limit 1
    ) latest_attempt on true
    left join lateral (
      select min(attempts.submitted_at) submitted_at
      from public.challenge_attempts attempts
      where attempts.user_id=statistics.user_id
        and attempts.challenge_date=(now() at time zone 'America/New_York')::date
        and attempts.correct
    ) today_attempt on true
  ),
  ranked as (
    select
      active_streaks.*,
      row_number() over (
        order by
          active_streaks.current_streak desc,
          active_streaks.today_submitted_at asc nulls last,
          active_streaks.username asc
      ) as rank
    from active_streaks
  )
  select
    ranked.user_id,
    ranked.username,
    ranked.current_streak,
    ranked.longest_streak,
    ranked.rank
  from ranked
  order by ranked.rank
  limit 20;
$$;

create or replace function public.get_challenge_leaderboard_position(
  p_user_id uuid
)
returns table (
  user_id uuid,
  username text,
  current_streak integer,
  longest_streak integer,
  rank bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with active_streaks as (
    select
      statistics.user_id,
      profiles.username,
      case
        when latest_attempt.challenge_date >=
          (now() at time zone 'America/New_York')::date - 1
        then statistics.current_streak
        else 0
      end as current_streak,
      statistics.longest_streak,
      today_attempt.submitted_at as today_submitted_at
    from public.challenge_user_statistics statistics
    join public.profiles on profiles.id = statistics.user_id
    left join lateral (
      select attempts.challenge_date
      from public.challenge_attempts attempts
      where attempts.user_id = statistics.user_id
      order by attempts.challenge_date desc
      limit 1
    ) latest_attempt on true
    left join lateral (
      select min(attempts.submitted_at) submitted_at
      from public.challenge_attempts attempts
      where attempts.user_id=statistics.user_id
        and attempts.challenge_date=(now() at time zone 'America/New_York')::date
        and attempts.correct
    ) today_attempt on true
  ),
  ranked as (
    select
      active_streaks.*,
      row_number() over (
        order by
          active_streaks.current_streak desc,
          active_streaks.today_submitted_at asc nulls last,
          active_streaks.username asc
      ) as rank
    from active_streaks
  )
  select
    ranked.user_id,
    ranked.username,
    ranked.current_streak,
    ranked.longest_streak,
    ranked.rank
  from ranked
  where ranked.user_id = p_user_id;
$$;

create or replace function public.get_my_challenge_leaderboard_position()
returns table (
  user_id uuid,
  username text,
  current_streak integer,
  longest_streak integer,
  rank bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with active_streaks as (
    select
      statistics.user_id,
      profiles.username,
      case
        when latest_attempt.challenge_date >=
          (now() at time zone 'America/New_York')::date - 1
        then statistics.current_streak
        else 0
      end as current_streak,
      statistics.longest_streak,
      today_attempt.submitted_at as today_submitted_at
    from public.challenge_user_statistics statistics
    join public.profiles on profiles.id = statistics.user_id
    left join lateral (
      select attempts.challenge_date
      from public.challenge_attempts attempts
      where attempts.user_id = statistics.user_id
      order by attempts.challenge_date desc
      limit 1
    ) latest_attempt on true
    left join lateral (
      select min(attempts.submitted_at) submitted_at
      from public.challenge_attempts attempts
      where attempts.user_id=statistics.user_id
        and attempts.challenge_date=(now() at time zone 'America/New_York')::date
        and attempts.correct
    ) today_attempt on true
  ),
  ranked as (
    select
      active_streaks.*,
      row_number() over (
        order by
          active_streaks.current_streak desc,
          active_streaks.today_submitted_at asc nulls last,
          active_streaks.username asc
      ) as rank
    from active_streaks
  )
  select
    ranked.user_id,
    ranked.username,
    ranked.current_streak,
    ranked.longest_streak,
    ranked.rank
  from ranked
  where ranked.user_id = (select auth.uid());
$$;

create or replace function public.get_admin_users(
 p_search text default '', p_role text default '', p_sort text default 'activity',
 p_page integer default 1, p_user_id uuid default null
) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not exists(select 1 from public.profiles where id=auth.uid() and role in ('owner','admin')) then
   raise exception 'Administrator access required' using errcode='42501';
 end if;
 with practice as (
   select user_id,sum(attempts) attempts,sum(correct) correct,max(last_attempted_at) activity
   from public.question_progress group by user_id
 ), challenges as (
   select user_id,max(submitted_at) activity,max(challenge_date) latest_day
   from public.challenge_attempts group by user_id
 ), matches as (
   select user_id,max(finalized_at) activity from public.multiplayer_match_history group by user_id
 ), players as (
   select user_id,max(joined_at) activity from public.multiplayer_players where user_id is not null group by user_id
 ), users as (
   select p.id,p.username,p.role,p.created_at,
     greatest(practice.activity,challenges.activity,matches.activity,players.activity) last_active,
     coalesce(mp.rp,0) rp,coalesce(mp.ranked_matches_played,0) ranked_matches,
     coalesce(mp.ranked_wins,0) ranked_wins,
     case when challenges.latest_day >= (now() at time zone 'America/New_York')::date-1 then coalesce(cs.current_streak,0) else 0 end current_streak,
     coalesce(cs.longest_streak,0) longest_streak,
     coalesce(practice.attempts,0) practice_attempts,coalesce(practice.correct,0) practice_correct
   from public.profiles p
   left join public.multiplayer_profiles mp on mp.user_id=p.id
   left join public.challenge_user_statistics cs on cs.user_id=p.id
   left join practice on practice.user_id=p.id left join challenges on challenges.user_id=p.id
   left join matches on matches.user_id=p.id left join players on players.user_id=p.id
   where (p_user_id is null or p.id=p_user_id)
     and (p_role='' or p.role=p_role)
     and strpos(lower(p.username),lower(left(coalesce(p_search,''),100)))>0
 ), paged as (
   select * from users order by
     case when p_sort='rp' then rp end desc nulls last,
     case when p_sort='joined' then created_at end desc nulls last,
     case when p_sort='username' then username end asc nulls last,
     case when p_sort not in ('rp','joined','username') then last_active end desc nulls last,
     username,id
   limit 50 offset ((greatest(1,least(coalesce(p_page,1),1000000))-1)::bigint*50)
 ) select jsonb_build_object('total',(select count(*) from users),'users',coalesce(jsonb_agg(to_jsonb(paged)),'[]'::jsonb)) into result from paged;
 return result;
end;
$$;

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
        >= (now() at time zone 'America/New_York')::date - 1
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

-- Retain the existing read/execute boundaries; grading stays server-only.
revoke all on function public.submit_challenge_attempt(uuid,date,text,text,boolean) from public,anon,authenticated;
grant execute on function public.submit_challenge_attempt(uuid,date,text,text,boolean) to service_role;
revoke all on function public.get_challenge_leaderboard() from public;
grant execute on function public.get_challenge_leaderboard() to anon,authenticated,service_role;
revoke all on function public.get_challenge_leaderboard_position(uuid) from public,anon,authenticated;
grant execute on function public.get_challenge_leaderboard_position(uuid) to service_role;
revoke all on function public.get_my_challenge_leaderboard_position() from public,anon;
grant execute on function public.get_my_challenge_leaderboard_position() to authenticated;
revoke all on function public.get_admin_users(text,text,text,integer,uuid) from public,anon;
grant execute on function public.get_admin_users(text,text,text,integer,uuid) to authenticated;
revoke all on function public.get_dashboard_snapshot(integer[]) from public,anon;
grant execute on function public.get_dashboard_snapshot(integer[]) to authenticated;
notify pgrst, 'reload schema';
commit;
