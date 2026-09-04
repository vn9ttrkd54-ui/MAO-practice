-- Make multiplayer round transitions atomic and server-authoritative.

begin;

create or replace function public.bump_multiplayer_room_state_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_room_id uuid;
begin
  if current_setting('app.multiplayer_skip_state_bump', true) = 'on' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if tg_table_name = 'multiplayer_players'
      and (to_jsonb(new) - 'updated_at') = (to_jsonb(old) - 'updated_at') then
      return new;
    end if;

    if tg_table_name = 'multiplayer_spectators'
      and (to_jsonb(new) - 'last_seen_at') = (to_jsonb(old) - 'last_seen_at') then
      return new;
    end if;
  end if;

  if tg_op = 'DELETE' then
    affected_room_id := old.room_id;
  else
    affected_room_id := new.room_id;
  end if;

  update public.multiplayer_rooms
  set state_version = state_version + 1
  where id = affected_room_id;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
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
  current_time timestamptz := clock_timestamp();
  submission_count bigint;
  player_count bigint;
  next_question_number integer;
  next_question_ends_at timestamptz;
begin
  select * into room_row
  from public.multiplayer_rooms
  where id = p_room_id
  for update;

  if not found or room_row.status <> 'in-progress' then
    return 'inactive';
  end if;

  select * into question_row
  from public.multiplayer_match_questions
  where room_id = p_room_id
    and question_number = room_row.current_question_number
  for update;

  if not found or question_row.started_at is null or question_row.ends_at is null then
    return 'preparing';
  end if;

  if question_row.intermission_ends_at is null then
    select count(*) into submission_count
    from public.multiplayer_submissions
    where room_id = p_room_id
      and question_number = question_row.question_number;

    select count(*) into player_count
    from public.multiplayer_players
    where room_id = p_room_id
      and left_at is null;

    if current_time < coalesce(question_row.hard_ends_at, question_row.ends_at)
      and (player_count = 0 or submission_count < player_count) then
      return 'active';
    end if;

    if question_row.question_number >= room_row.question_count then
      update public.multiplayer_rooms
      set status = 'completed', completed_at = current_time
      where id = p_room_id;
      return 'completed';
    end if;

    update public.multiplayer_match_questions
    set intermission_ends_at = current_time + interval '5 seconds'
    where room_id = p_room_id
      and question_number = question_row.question_number;
    return 'intermission';
  end if;

  if current_time < question_row.intermission_ends_at then
    return 'intermission';
  end if;

  if question_row.question_number >= room_row.question_count then
    update public.multiplayer_rooms
    set status = 'completed', completed_at = current_time
    where id = p_room_id;
    return 'completed';
  end if;

  next_question_number := question_row.question_number + 1;
  next_question_ends_at := current_time
    + make_interval(secs => room_row.seconds_per_question + 5);

  perform set_config('app.multiplayer_skip_state_bump', 'on', true);

  update public.multiplayer_match_questions
  set started_at = current_time,
      ends_at = next_question_ends_at,
      hard_ends_at = next_question_ends_at
  where room_id = p_room_id
    and question_number = next_question_number
    and started_at is null;

  if not found then
    raise exception 'Unable to start the next multiplayer question';
  end if;

  update public.multiplayer_players
  set has_submitted_current_question = false
  where room_id = p_room_id
    and left_at is null;

  update public.multiplayer_rooms
  set current_question_number = next_question_number
  where id = p_room_id;

  return 'advanced';
end;
$$;

revoke all on function public.advance_multiplayer_round_state(uuid)
  from public, anon, authenticated;
grant execute on function public.advance_multiplayer_round_state(uuid)
  to service_role;

commit;
