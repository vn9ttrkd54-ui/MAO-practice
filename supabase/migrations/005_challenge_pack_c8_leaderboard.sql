-- MAO Practice: Challenge Pack C8 privacy-safe Top 20 leaderboard

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
        when exists (
          select 1
          from public.challenge_attempts attempts
          where attempts.user_id = statistics.user_id
            and attempts.challenge_date >=
              (timezone('utc', now()))::date - 1
        ) then statistics.current_streak
        else 0
      end as current_streak,
      statistics.longest_streak
    from public.challenge_user_statistics statistics
    join public.profiles on profiles.id = statistics.user_id
  ),
  ranked as (
    select
      active_streaks.*,
      row_number() over (
        order by
          active_streaks.current_streak desc,
          active_streaks.longest_streak desc,
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
