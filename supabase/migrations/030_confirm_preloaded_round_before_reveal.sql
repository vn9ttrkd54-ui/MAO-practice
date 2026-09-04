-- Let the host confirm a staged round shortly before its scheduled reveal.

begin;

create or replace function public.multiplayer_round_transition_needed(p_room_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce((
    select case
      when room.status <> 'in-progress' then false
      when question.intermission_ends_at is not null then
        clock_timestamp() >= question.intermission_ends_at - interval '4 seconds'
      when clock_timestamp() >= coalesce(question.hard_ends_at, question.ends_at) then true
      else (
        select count(*) from public.multiplayer_submissions submission
        where submission.room_id = room.id
          and submission.question_number = room.current_question_number
      ) >= (
        select count(*) from public.multiplayer_players player
        where player.room_id = room.id and player.left_at is null
      )
    end
    from public.multiplayer_rooms room
    join public.multiplayer_match_questions question
      on question.room_id = room.id and question.question_number = room.current_question_number
    where room.id = p_room_id
  ), false);
$$;

create or replace function public.advance_multiplayer_round_state(p_room_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  room_row public.multiplayer_rooms%rowtype;
  question_row public.multiplayer_match_questions%rowtype;
  transition_time timestamptz := clock_timestamp();
  submission_count bigint;
  player_count bigint;
  next_question_number integer;
  next_question_starts_at timestamptz;
  next_question_ends_at timestamptz;
begin
  select * into room_row from public.multiplayer_rooms where id = p_room_id for update;
  if not found or room_row.status <> 'in-progress' then return 'inactive'; end if;
  select * into question_row from public.multiplayer_match_questions
  where room_id = p_room_id and question_number = room_row.current_question_number for update;
  if not found or question_row.started_at is null or question_row.ends_at is null then return 'preparing'; end if;

  if question_row.intermission_ends_at is null then
    select count(*) into submission_count from public.multiplayer_submissions
    where room_id = p_room_id and question_number = question_row.question_number;
    select count(*) into player_count from public.multiplayer_players
    where room_id = p_room_id and left_at is null;
    if transition_time < coalesce(question_row.hard_ends_at, question_row.ends_at)
      and (player_count = 0 or submission_count < player_count) then return 'active'; end if;
    if question_row.question_number >= room_row.question_count then
      update public.multiplayer_rooms set status = 'completed', completed_at = transition_time where id = p_room_id;
      return 'completed';
    end if;

    next_question_number := question_row.question_number + 1;
    next_question_starts_at := transition_time + interval '5 seconds';
    next_question_ends_at := next_question_starts_at + make_interval(secs => room_row.seconds_per_question + 5);
    update public.multiplayer_match_questions set intermission_ends_at = next_question_starts_at
    where room_id = p_room_id and question_number = question_row.question_number;
    perform set_config('app.multiplayer_skip_state_bump', 'on', true);
    update public.multiplayer_match_questions
    set started_at = next_question_starts_at, ends_at = next_question_ends_at, hard_ends_at = next_question_ends_at
    where room_id = p_room_id and question_number = next_question_number and started_at is null;
    if not found then raise exception 'Unable to stage the next multiplayer question'; end if;
    return 'intermission';
  end if;

  if transition_time < question_row.intermission_ends_at - interval '4 seconds' then return 'intermission'; end if;
  next_question_number := question_row.question_number + 1;
  perform set_config('app.multiplayer_skip_state_bump', 'on', true);
  update public.multiplayer_match_questions
  set started_at = coalesce(started_at, transition_time),
      ends_at = coalesce(ends_at, transition_time + make_interval(secs => room_row.seconds_per_question + 5)),
      hard_ends_at = coalesce(hard_ends_at, transition_time + make_interval(secs => room_row.seconds_per_question + 5))
  where room_id = p_room_id and question_number = next_question_number;
  if not found then raise exception 'Unable to start the next multiplayer question'; end if;
  update public.multiplayer_players set has_submitted_current_question = false
  where room_id = p_room_id and left_at is null;
  update public.multiplayer_rooms set current_question_number = next_question_number where id = p_room_id;
  return 'advanced';
end;
$$;

commit;
