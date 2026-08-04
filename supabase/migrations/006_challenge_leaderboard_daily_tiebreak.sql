-- Rank equal active streaks by today's submission time.

begin;

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
    left join public.challenge_attempts today_attempt
      on today_attempt.user_id = statistics.user_id
      and today_attempt.challenge_date = (timezone('utc', now()))::date
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

commit;
