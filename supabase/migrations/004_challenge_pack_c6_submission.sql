-- MAO Practice: Challenge Pack C6 atomic submission

begin;

create or replace function public.submit_challenge_attempt(
  p_user_id uuid,
  p_challenge_date date,
  p_question_id text,
  p_selected_answer text,
  p_correct boolean
)
returns public.challenge_attempts
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  submitted_attempt public.challenge_attempts;
  previous_attempt public.challenge_attempts;
  next_streak integer;
begin
  select *
  into previous_attempt
  from public.challenge_attempts
  where user_id = p_user_id
    and challenge_date < p_challenge_date
  order by challenge_date desc
  limit 1;

  insert into public.challenge_attempts (
    user_id,
    challenge_date,
    question_id,
    selected_answer,
    correct
  )
  values (
    p_user_id,
    p_challenge_date,
    p_question_id,
    p_selected_answer,
    p_correct
  )
  returning * into submitted_attempt;

  if not p_correct then
    next_streak := 0;
  elsif previous_attempt.correct
    and previous_attempt.challenge_date = p_challenge_date - 1 then
    select coalesce(current_streak, 0) + 1
    into next_streak
    from public.challenge_user_statistics
    where user_id = p_user_id;

    next_streak := coalesce(next_streak, 1);
  else
    next_streak := 1;
  end if;

  insert into public.challenge_user_statistics (
    user_id,
    current_streak,
    longest_streak,
    total_completed,
    total_correct
  )
  values (
    p_user_id,
    next_streak,
    next_streak,
    1,
    case when p_correct then 1 else 0 end
  )
  on conflict (user_id) do update
  set current_streak = excluded.current_streak,
      longest_streak = greatest(
        challenge_user_statistics.longest_streak,
        excluded.current_streak
      ),
      total_completed = challenge_user_statistics.total_completed + 1,
      total_correct = challenge_user_statistics.total_correct
        + case when p_correct then 1 else 0 end,
      updated_at = timezone('utc', now());

  return submitted_attempt;
end;
$$;

revoke all on function public.submit_challenge_attempt(
  uuid, date, text, text, boolean
) from public, anon, authenticated;

grant execute on function public.submit_challenge_attempt(
  uuid, date, text, text, boolean
) to service_role;

commit;
