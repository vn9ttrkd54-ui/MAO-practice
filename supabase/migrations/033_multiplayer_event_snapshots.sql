begin;
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
    perform set_config('app.multiplayer_skip_state_bump', 'on', true);
    update public.multiplayer_match_questions set intermission_ends_at = next_question_starts_at
    where room_id = p_room_id and question_number = question_row.question_number;
    perform set_config('app.multiplayer_skip_state_bump', 'on', true);
    update public.multiplayer_match_questions
    set started_at = next_question_starts_at, ends_at = next_question_ends_at, hard_ends_at = next_question_ends_at
    where room_id = p_room_id and question_number = next_question_number and started_at is null;
    if not found then raise exception 'Unable to stage the next multiplayer question'; end if;
    update public.multiplayer_rooms set state_version=state_version+1 where id=p_room_id;
    perform set_config('app.multiplayer_skip_state_bump', 'off', true);
    return 'intermission';
  end if;

  if transition_time < question_row.intermission_ends_at then return 'intermission'; end if;
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
  perform set_config('app.multiplayer_skip_state_bump', 'off', true);
  return 'advanced';
end;
$$;


create or replace function public.broadcast_multiplayer_room_state()
returns trigger language plpgsql security definer set search_path = '' as $$
declare q public.multiplayer_match_questions%rowtype; event_name text;
begin
  select * into q from public.multiplayer_match_questions where room_id=new.id and question_number=new.current_question_number;
  event_name := case when new.results_finalized_at is not null then 'results_ready'
    when new.status='completed' then 'match_completed'
    when q.intermission_ends_at is not null then 'round_staged'
    when new.status='in-progress' then 'round_started' else 'room_changed' end;
  perform realtime.send(jsonb_build_object('roomId',new.id,'stateVersion',new.state_version,
    'kind',event_name,'questionNumber',new.current_question_number,
    'questionStartedAt',extract(epoch from q.started_at)*1000,
    'questionEndsAt',extract(epoch from q.ends_at)*1000,
    'intermissionEndsAt',extract(epoch from q.intermission_ends_at)*1000),
    'room_changed','multiplayer-room:'||new.id::text,false);
  return new;
end;
$$;

-- One statement / one MVCC snapshot. Explicit fields exclude reconnect tokens and answers.
create or replace function public.read_multiplayer_snapshot(p_room_id uuid,p_player_id uuid,p_known_version bigint default -1)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case when r.state_version=p_known_version then
    jsonb_build_object('unchanged',true,'stateVersion',r.state_version,'status',r.status)
  else jsonb_build_object('stateVersion',r.state_version,'status',r.status,
    'roomId',r.id,'currentPlayerId',p_player_id,'totalQuestions',r.question_count,
    'questionDurationSeconds',r.seconds_per_question,'question',to_jsonb(q),
    'upcoming',case when q.intermission_ends_at is not null then
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
commit;
