begin;
alter table public.multiplayer_match_questions
  add column preparation_deadline_at timestamptz,
  add column round_finished_at timestamptz;

create table public.multiplayer_question_readiness (
  room_id uuid not null,
  question_number integer not null,
  player_id uuid not null,
  ready_at timestamptz not null default clock_timestamp(),
  primary key(room_id,question_number,player_id),
  foreign key(room_id,question_number) references public.multiplayer_match_questions(room_id,question_number) on delete cascade,
  foreign key(room_id,player_id) references public.multiplayer_players(room_id,id) on delete cascade
);
alter table public.multiplayer_question_readiness enable row level security;
revoke all on public.multiplayer_question_readiness from public,anon,authenticated;
grant all on public.multiplayer_question_readiness to service_role;

-- Always lock the room first. Readiness writes do not broadcast roster-sized updates.
create or replace function public.schedule_ready_multiplayer_question(p_room_id uuid,p_question_number integer)
returns boolean language plpgsql security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype; q public.multiplayer_match_questions%rowtype; reveal_at timestamptz;
begin
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found or r.status<>'in-progress' then return false; end if;
  select * into q from public.multiplayer_match_questions where room_id=p_room_id and question_number=p_question_number for update;
  if not found or q.preparation_deadline_at is null then return false; end if;
  if q.started_at is not null then return true; end if;
  if clock_timestamp()<q.preparation_deadline_at and exists(
    select 1 from public.multiplayer_players p where p.room_id=p_room_id and p.left_at is null
    and not exists(select 1 from public.multiplayer_question_readiness a
      where a.room_id=p_room_id and a.question_number=p_question_number and a.player_id=p.id)
  ) then return false; end if;
  -- Five seconds to distribute the schedule, followed by the full shared 10/5 seconds.
  reveal_at:=clock_timestamp()+make_interval(secs=>5+case when p_question_number=1 then 10 else 5 end);
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  update public.multiplayer_match_questions set started_at=reveal_at,
    ends_at=reveal_at+make_interval(secs=>r.seconds_per_question+5),
    hard_ends_at=reveal_at+make_interval(secs=>r.seconds_per_question+5)
    where room_id=p_room_id and question_number=p_question_number;
  if p_question_number>r.current_question_number then
    update public.multiplayer_match_questions set intermission_ends_at=reveal_at
      where room_id=p_room_id and question_number=r.current_question_number;
  end if;
  update public.multiplayer_rooms set state_version=state_version+1 where id=p_room_id;
  perform set_config('app.multiplayer_skip_state_bump','off',true);
  return true;
end;
$$;

create or replace function public.advance_multiplayer_round_state(p_room_id uuid)
returns text language plpgsql security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype; q public.multiplayer_match_questions%rowtype;
  transition_time timestamptz:=clock_timestamp(); submission_count bigint; player_count bigint;
begin
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found or r.status<>'in-progress' then return 'inactive'; end if;
  select * into q from public.multiplayer_match_questions
    where room_id=p_room_id and question_number=r.current_question_number for update;
  if not found then return 'preparing'; end if;
  if q.started_at is null then
    perform public.schedule_ready_multiplayer_question(p_room_id,q.question_number);
    return 'preparing';
  end if;
  if q.round_finished_at is null and q.intermission_ends_at is null then
    select count(*) into submission_count from public.multiplayer_submissions
      where room_id=p_room_id and question_number=q.question_number;
    select count(*) into player_count from public.multiplayer_players where room_id=p_room_id and left_at is null;
    if transition_time<coalesce(q.hard_ends_at,q.ends_at)
      and (player_count=0 or submission_count<player_count) then return 'active'; end if;
    if q.question_number>=r.question_count then
      update public.multiplayer_rooms set status='completed',completed_at=transition_time where id=p_room_id;
      return 'completed';
    end if;
    perform set_config('app.multiplayer_skip_state_bump','on',true);
    update public.multiplayer_match_questions set round_finished_at=transition_time
      where room_id=p_room_id and question_number=q.question_number;
    update public.multiplayer_match_questions set preparation_deadline_at=transition_time+interval '15 seconds'
      where room_id=p_room_id and question_number=q.question_number+1 and started_at is null;
    if not found then raise exception 'Unable to prepare the next multiplayer question'; end if;
    update public.multiplayer_rooms set state_version=state_version+1 where id=p_room_id;
    perform set_config('app.multiplayer_skip_state_bump','off',true);
    return 'preparing';
  end if;
  if q.intermission_ends_at is null then
    perform public.schedule_ready_multiplayer_question(p_room_id,q.question_number+1);
    return 'preparing';
  end if;
  if transition_time<q.intermission_ends_at then return 'intermission'; end if;
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  update public.multiplayer_players set has_submitted_current_question=false where room_id=p_room_id and left_at is null;
  update public.multiplayer_rooms set current_question_number=q.question_number+1 where id=p_room_id;
  perform set_config('app.multiplayer_skip_state_bump','off',true);
  return 'advanced';
end;
$$;

create or replace function public.acknowledge_multiplayer_question_ready(p_room_id uuid,p_player_id uuid,p_question_number integer)
returns void language plpgsql security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype; q public.multiplayer_match_questions%rowtype;
begin
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found or r.status<>'in-progress' or not exists(
    select 1 from public.multiplayer_players where room_id=p_room_id and id=p_player_id and left_at is null
  ) then raise exception using errcode='P0001',message='Player is not in an active room.'; end if;
  select * into q from public.multiplayer_match_questions where room_id=p_room_id and question_number=p_question_number;
  if not found or q.preparation_deadline_at is null
    or p_question_number not in (r.current_question_number,r.current_question_number+1) then
    raise exception using errcode='P0001',message='Question is not preparing.';
  end if;
  insert into public.multiplayer_question_readiness(room_id,question_number,player_id)
    values(p_room_id,p_question_number,p_player_id) on conflict do nothing;
  perform public.schedule_ready_multiplayer_question(p_room_id,p_question_number);
end;
$$;
revoke all on function public.schedule_ready_multiplayer_question(uuid,integer) from public,anon,authenticated;
revoke all on function public.acknowledge_multiplayer_question_ready(uuid,uuid,integer) from public,anon,authenticated;
grant execute on function public.schedule_ready_multiplayer_question(uuid,integer) to service_role;
grant execute on function public.acknowledge_multiplayer_question_ready(uuid,uuid,integer) to service_role;
-- One statement / one MVCC snapshot. Explicit fields exclude reconnect tokens and answers.
create or replace function public.read_multiplayer_snapshot(p_room_id uuid,p_player_id uuid,p_known_version bigint default -1)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case when r.state_version=p_known_version then
    jsonb_build_object('unchanged',true,'stateVersion',r.state_version,'status',r.status)
  else jsonb_build_object('stateVersion',r.state_version,'status',r.status,
    'roomId',r.id,'currentPlayerId',p_player_id,'totalQuestions',r.question_count,
    'questionDurationSeconds',r.seconds_per_question,'question',to_jsonb(q),
    'upcoming',case when q.round_finished_at is not null or q.intermission_ends_at is not null then
      (select to_jsonb(n) from public.multiplayer_match_questions n where n.room_id=r.id and n.question_number=q.question_number+1) end,
    'players',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'user_id',p.user_id,
      'guest_nickname',p.guest_nickname,'is_host',p.is_host,'connected',p.connected,'score',p.score,
      'placement',p.placement,'has_submitted_current_question',exists(select 1 from public.multiplayer_submissions s
        where s.room_id=r.id and s.player_id=p.id and s.question_number=q.question_number),
      'display_name',coalesce(profile.username,p.guest_nickname,'Player'),'rp',rating.rp) order by p.joined_at)
      from public.multiplayer_players p left join public.profiles profile on profile.id=p.user_id
      left join public.multiplayer_profiles rating on rating.user_id=p.user_id
      where p.room_id=r.id and p.left_at is null),'[]'::jsonb)) end
  from public.multiplayer_rooms r left join public.multiplayer_match_questions q
    on q.room_id=r.id and q.question_number=r.current_question_number
  where r.id=p_room_id and exists(select 1 from public.multiplayer_players p
    where p.room_id=r.id and p.id=p_player_id and p.left_at is null);
$$;
revoke all on function public.read_multiplayer_snapshot(uuid,uuid,bigint) from public,anon,authenticated;
grant execute on function public.read_multiplayer_snapshot(uuid,uuid,bigint) to service_role;
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
      or question_row.round_finished_at is not null or question_row.ends_at is null or question_row.intermission_ends_at is not null then
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


create or replace function public.tick_multiplayer_rooms()
returns void language plpgsql security definer set search_path = '' as $$
declare target record;
begin
  if not pg_try_advisory_xact_lock(824193,1) then return; end if;
  for target in select r.id from public.multiplayer_rooms r
    left join public.multiplayer_match_questions q on q.room_id=r.id and q.question_number=r.current_question_number
    where ((r.status='in-progress' and clock_timestamp()>=case when q.started_at is null then q.preparation_deadline_at when q.round_finished_at is not null and q.intermission_ends_at is null then (select n.preparation_deadline_at from public.multiplayer_match_questions n where n.room_id=r.id and n.question_number=q.question_number+1) else coalesce(q.intermission_ends_at,q.hard_ends_at,q.ends_at) end)
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
