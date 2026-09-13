-- Delivery acknowledgments are client-controlled signals, not evidence of when
-- a player first saw a question. Use one server clock for time, points and ties.
-- Keep the existing shared hard deadline (including transport grace), countdowns,
-- acceptance ordering, immutable retries and atomic score/round updates.
begin;

create or replace function public.accept_multiplayer_answer(
  p_room_id uuid, p_player_id uuid, p_question_id integer,
  p_selected_answer text, p_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  room_row public.multiplayer_rooms%rowtype;
  question_row public.multiplayer_match_questions%rowtype;
  existing public.multiplayer_submissions%rowtype;
  received_at timestamptz := clock_timestamp();
  elapsed_ms integer;
  earlier_correct integer;
  earned integer := 0;
begin
  -- Keep the receipt clock above the room lock: lock contention is not solve time.
  select * into room_row from public.multiplayer_rooms where id = p_room_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'Room not found.'; end if;
  if not exists (select 1 from public.multiplayer_players
    where room_id = p_room_id and id = p_player_id and left_at is null) then
    raise exception using errcode = 'P0001', message = 'Player is not in this room.';
  end if;
  if p_selected_answer is null or p_selected_answer not in ('A','B','C','D','E') or p_correct is null then
    raise exception using errcode = 'P0001', message = 'Choose a valid answer.';
  end if;

  -- Retrying can recover the original receipt, never replace an accepted answer.
  select * into existing from public.multiplayer_submissions
  where room_id = p_room_id and player_id = p_player_id and question_id = p_question_id;
  if not found then
    perform public.advance_multiplayer_round_state(p_room_id);
    select * into room_row from public.multiplayer_rooms where id=p_room_id;
    select * into question_row from public.multiplayer_match_questions
    where room_id = p_room_id and question_number = room_row.current_question_number for update;
    if room_row.status <> 'in-progress' or not found
      or question_row.question_id <> p_question_id or question_row.started_at is null
      or question_row.round_finished_at is not null or question_row.ends_at is null or question_row.intermission_ends_at is not null then
      raise exception using errcode = 'P0001', message = 'This question is closed.';
    end if;
    if received_at < question_row.started_at then
      raise exception using errcode = 'P0001', message = 'This question has not started yet.';
    end if;

    -- Grace is shared by every player. A late/missing/repeated delivery ACK must
    -- not extend the cutoff or reset speed credit. The visible timer is unchanged.
    if received_at > coalesce(question_row.hard_ends_at, question_row.ends_at) then
      raise exception using errcode = 'P0001', message = 'Time has expired for this question.';
    end if;
    elapsed_ms := greatest(0, floor(extract(epoch from (received_at - question_row.started_at)) * 1000)::integer);
    if p_correct then
      select count(*)::integer into earlier_correct from public.multiplayer_submissions
      where room_id = p_room_id and question_number = question_row.question_number and correct;
      earned := greatest(1000, 1030 + round(470::numeric *
        (1 - least(elapsed_ms, room_row.seconds_per_question * 1000)::numeric /
        (room_row.seconds_per_question * 1000)))::integer - least(29, earlier_correct));
    end if;
    insert into public.multiplayer_submissions
      (room_id, question_number, question_id, player_id, selected_answer, correct,
       answer_time_ms, points_earned, submitted_at)
    values (p_room_id, question_row.question_number, p_question_id, p_player_id,
      p_selected_answer, p_correct, elapsed_ms, earned, received_at)
    returning * into existing;
    update public.multiplayer_players set score = score + earned, has_submitted_current_question = true
    where room_id = p_room_id and id = p_player_id;
    perform public.advance_multiplayer_round_state(p_room_id);
  end if;
  -- No correctness or score information is disclosed before the round closes.
  return jsonb_build_object('accepted', true, 'questionId', existing.question_id,
    'questionNumber', existing.question_number, 'selectedAnswer', existing.selected_answer);
end;
$$;

revoke all on function public.accept_multiplayer_answer(uuid, uuid, integer, text, boolean)
  from public, anon, authenticated;
grant execute on function public.accept_multiplayer_answer(uuid, uuid, integer, text, boolean)
  to service_role;

commit;
