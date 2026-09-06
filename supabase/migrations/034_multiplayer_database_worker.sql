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
  delivered_at timestamptz;
  solving_started_at timestamptz;
  personal_ends_at timestamptz;
  elapsed_ms integer;
  earlier_correct integer;
  earned integer := 0;
begin
  -- Same lock order as round advancement: no transition can observe a half-saved answer.
  select * into room_row from public.multiplayer_rooms where id = p_room_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'Room not found.'; end if;
  if not exists (select 1 from public.multiplayer_players
    where room_id = p_room_id and id = p_player_id and left_at is null) then
    raise exception using errcode = 'P0001', message = 'Player is not in this room.';
  end if;
  if p_selected_answer is null or p_selected_answer not in ('A','B','C','D','E') or p_correct is null then
    raise exception using errcode = 'P0001', message = 'Choose a valid answer.';
  end if;

  -- Recover the original result before checking the current round or deadline.
  -- A different answer in a duplicate request can never replace the accepted answer.
  select * into existing from public.multiplayer_submissions
  where room_id = p_room_id and player_id = p_player_id and question_id = p_question_id;
  if not found then
    -- A prepared question can be answered at its scheduled reveal even if the
    -- one-second worker has not ticked yet. The room lock serializes this fallback.
    perform public.advance_multiplayer_round_state(p_room_id);
    select * into room_row from public.multiplayer_rooms where id=p_room_id;
    select * into question_row from public.multiplayer_match_questions
    where room_id = p_room_id and question_number = room_row.current_question_number for update;
    if room_row.status <> 'in-progress' or not found
      or question_row.question_id <> p_question_id or question_row.started_at is null
      or question_row.ends_at is null or question_row.intermission_ends_at is not null then
      raise exception using errcode = 'P0001', message = 'This question is closed.';
    end if;
    if received_at < question_row.started_at then
      raise exception using errcode = 'P0001', message = 'This question has not started yet.';
    end if;
    select delivery.delivered_at into delivered_at from public.multiplayer_question_deliveries delivery
    where delivery.room_id = p_room_id and delivery.player_id = p_player_id
      and delivery.question_number = question_row.question_number;
    solving_started_at := case when delivered_at > question_row.started_at + interval '5 seconds'
      then delivered_at else question_row.started_at end;
    personal_ends_at := least(coalesce(question_row.hard_ends_at, question_row.ends_at),
      solving_started_at + make_interval(secs => room_row.seconds_per_question));
    if received_at > personal_ends_at then
      raise exception using errcode = 'P0001', message = 'Time has expired for this question.';
    end if;
    elapsed_ms := greatest(0, floor(extract(epoch from (received_at - solving_started_at)) * 1000)::integer);
    if p_correct then
      -- Acceptance order is serialized by the room lock.
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
  -- Do not return correctness or points before the question closes.
  return jsonb_build_object('accepted', true, 'questionId', existing.question_id,
    'questionNumber', existing.question_number, 'selectedAnswer', existing.selected_answer);
end;
$$;

revoke all on function public.accept_multiplayer_answer(uuid, uuid, integer, text, boolean)
  from public, anon, authenticated;
grant execute on function public.accept_multiplayer_answer(uuid, uuid, integer, text, boolean)
  to service_role;


create table if not exists public.multiplayer_worker_errors (
  room_id uuid primary key references public.multiplayer_rooms(id) on delete cascade,
  last_error text not null, updated_at timestamptz not null default clock_timestamp()
);
alter table public.multiplayer_worker_errors enable row level security;
revoke all on public.multiplayer_worker_errors from anon,authenticated;
create index if not exists multiplayer_rooms_worker_idx on public.multiplayer_rooms(status,completed_at)
  where status='in-progress' or (status='completed' and results_finalized_at is null);

create or replace function public.tick_multiplayer_rooms()
returns void language plpgsql security definer set search_path = '' as $$
declare target record;
begin
  if not pg_try_advisory_xact_lock(824193,1) then return; end if;
  for target in select r.id from public.multiplayer_rooms r
    left join public.multiplayer_match_questions q on q.room_id=r.id and q.question_number=r.current_question_number
    where ((r.status='in-progress' and clock_timestamp()>=coalesce(q.intermission_ends_at,q.hard_ends_at,q.ends_at))
      or (r.status='completed' and r.results_finalized_at is null and r.completed_at>clock_timestamp()-interval '1 day'))
      and not exists(select 1 from public.multiplayer_worker_errors e where e.room_id=r.id
        and e.updated_at>clock_timestamp()-interval '10 seconds')
    order by r.id limit 100 for update of r skip locked
  loop
    begin
      perform public.advance_multiplayer_round_state(target.id);
      perform public.finalize_multiplayer_match(target.id);
      delete from public.multiplayer_worker_errors where room_id=target.id;
    exception when others then
      insert into public.multiplayer_worker_errors(room_id,last_error) values(target.id,sqlerrm)
      on conflict(room_id) do update set last_error=excluded.last_error,updated_at=clock_timestamp();
    end;
  end loop;
end;
$$;
revoke all on function public.tick_multiplayer_rooms() from public,anon,authenticated;
grant execute on function public.tick_multiplayer_rooms() to service_role;
commit;
