begin;
alter table public.daily_challenges add column division text;
update public.daily_challenges set division=case
  when question_id in ('CH-0001','CH-0004') then 'Mu'
  when question_id in ('CH-0002','CH-0005') then 'Alpha'
  when question_id in ('CH-0003','CH-0006') then 'Theta' end;
-- Unknown historical assignments must be mapped explicitly, never guessed.
alter table public.daily_challenges alter column division set not null;
alter table public.daily_challenges add constraint daily_challenges_division_check check (division in ('Mu','Alpha','Theta'));
alter table public.daily_challenges drop constraint daily_challenges_challenge_date_key;
alter table public.daily_challenges add constraint daily_challenges_date_division_unique unique(challenge_date,division);
alter table public.challenge_attempts drop constraint challenge_attempts_user_date_unique;
alter table public.challenge_attempts add constraint challenge_attempts_user_date_question_unique unique(user_id,challenge_date,question_id);
comment on table public.daily_challenges is 'One code-defined question per UTC date and division.';
comment on table public.challenge_attempts is 'One immutable answer per user and daily question; one correct division earns daily streak credit.';

create or replace function public.submit_challenge_attempt(
 p_user_id uuid,p_challenge_date date,p_question_id text,p_selected_answer text,p_correct boolean
) returns public.challenge_attempts language plpgsql security definer set search_path=public,pg_temp as $$
declare
 submitted_attempt public.challenge_attempts;
 current_days integer;
 longest_days integer;
begin
 if p_challenge_date <> (timezone('utc',now()))::date then raise exception 'Only today''s Challenge can be submitted.'; end if;
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
revoke all on function public.submit_challenge_attempt(uuid,date,text,text,boolean) from public,anon,authenticated;
grant execute on function public.submit_challenge_attempt(uuid,date,text,text,boolean) to service_role;
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
          (timezone('utc', now()))::date - 1
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
        and attempts.challenge_date=(timezone('utc',now()))::date
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

revoke all on function public.get_challenge_leaderboard()
from public, anon, authenticated;

grant execute on function public.get_challenge_leaderboard()
to service_role;


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
          (timezone('utc', now()))::date - 1
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
        and attempts.challenge_date=(timezone('utc',now()))::date
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

revoke all on function public.get_challenge_leaderboard_position(uuid)
from public, anon, authenticated;

grant execute on function public.get_challenge_leaderboard_position(uuid)
to service_role;


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
          (timezone('utc', now()))::date - 1
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
        and attempts.challenge_date=(timezone('utc',now()))::date
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

revoke all on function public.get_my_challenge_leaderboard_position()
from public, anon;

grant execute on function public.get_my_challenge_leaderboard_position()
to authenticated;


grant execute on function public.get_challenge_leaderboard() to anon,authenticated;
commit;
