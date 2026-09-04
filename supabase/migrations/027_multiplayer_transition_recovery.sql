-- Detect a needed transition without taking the room's transition lock.

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
        clock_timestamp() >= question.intermission_ends_at
      when clock_timestamp() >= coalesce(question.hard_ends_at, question.ends_at) then true
      else (
        select count(*)
        from public.multiplayer_submissions submission
        where submission.room_id = room.id
          and submission.question_number = room.current_question_number
      ) >= (
        select count(*)
        from public.multiplayer_players player
        where player.room_id = room.id
          and player.left_at is null
      )
    end
    from public.multiplayer_rooms room
    join public.multiplayer_match_questions question
      on question.room_id = room.id
      and question.question_number = room.current_question_number
    where room.id = p_room_id
  ), false);
$$;

revoke all on function public.multiplayer_round_transition_needed(uuid)
  from public, anon, authenticated;
grant execute on function public.multiplayer_round_transition_needed(uuid)
  to service_role;

commit;
