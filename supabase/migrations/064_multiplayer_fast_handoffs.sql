-- Fast first-question and result handoffs. Requires 063.
-- No existing room, answer, score, rating or history rows are rewritten.
begin;
set local lock_timeout='5s';
set local statement_timeout='30s';

create or replace function public.start_multiplayer_lobby(
  p_room_id uuid,p_user_id uuid,p_guest_hash text,p_question_ids integer[],p_difficulties integer[],p_settings_version bigint
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.multiplayer_rooms%rowtype; p public.multiplayer_players%rowtype;
  active_count integer; started timestamptz;
begin
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found then return null; end if;
  select * into p from public.multiplayer_players where id=public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash);
  if not found then return null; end if;
  if r.visibility='private' and not p.is_host then raise exception 'Only the host can start this room.'; end if;
  if r.status not in ('waiting','countdown') then return to_jsonb(r); end if;
  started := clock_timestamp();
  if not p.connected or p.updated_at < started-interval '30 seconds' then
    raise exception 'Reconnect to the lobby before starting.';
  end if;
  select count(*) into active_count from public.multiplayer_players
    where room_id=p_room_id and left_at is null and connected and updated_at >= started-interval '30 seconds';
  if r.visibility='public' then
    if r.status<>'countdown' then return to_jsonb(r); end if;
    if active_count<2 then
      update public.multiplayer_rooms set status='waiting',countdown_ends_at=null,state_version=state_version+1
        where id=p_room_id returning * into r;
      return to_jsonb(r);
    end if;
    if r.countdown_ends_at is null or r.countdown_ends_at>started then return to_jsonb(r); end if;
  end if;
  if cardinality(p_question_ids) is distinct from r.question_count
    or cardinality(p_difficulties) is distinct from r.question_count
    or (select count(distinct id) from unnest(p_question_ids) id)<>r.question_count
    or exists(select 1 from unnest(p_question_ids) id where id is null or id<=0)
    or exists(select 1 from unnest(p_difficulties) d where d is null or d not between 1 and 5) then
    raise exception 'Invalid question selection.';
  end if;
  if (p_settings_version is null and r.difficulty_band is not null)
    or (p_settings_version is not null and p_settings_version<>r.settings_version) then
    raise exception 'Room settings changed. Reload the lobby and retry.';
  end if;
  if r.difficulty_band is not null and exists(select 1 from unnest(p_difficulties) d
    where d<left(r.difficulty_band,1)::integer or d>right(r.difficulty_band,1)::integer) then
    raise exception 'Questions do not match the selected difficulty.';
  end if;
  -- Server-selected questions, membership, room transition and replacement queue
  -- either all commit or all roll back. Leave and join use this same room lock.
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  update public.multiplayer_players set left_at=started,connected=false
    where room_id=p_room_id and left_at is null
      and (not connected or updated_at < started-interval '30 seconds');
  -- First question uses one shared schedule: 3s preparation + 5s countdown.
  -- Readiness ACKs cannot postpone it. Subsequent rounds keep their existing gate.
  insert into public.multiplayer_match_questions(room_id,question_number,question_id,difficulty,
    preparation_deadline_at,started_at,ends_at,hard_ends_at)
    select p_room_id,n,p_question_ids[n],p_difficulties[n],
      case when n=1 then started+interval '3 seconds' end,
      case when n=1 then started+interval '8 seconds' end,
      case when n=1 then started+make_interval(secs=>8+r.seconds_per_question+5) end,
      case when n=1 then started+make_interval(secs=>8+r.seconds_per_question+5) end
    from generate_series(1,r.question_count) n;
  update public.multiplayer_rooms set status='in-progress',started_at=started,countdown_ends_at=null,
    current_question_number=1,mode=case when active_count=1 then 'unranked' else mode end,
    state_version=state_version+1 where id=p_room_id returning * into r;
  if r.visibility='public' then
    insert into public.multiplayer_rooms(visibility,mode,division,question_count,seconds_per_question,status,capacity)
      values('public','ranked',r.division,r.question_count,90,'waiting',20);
  end if;
  perform set_config('app.multiplayer_skip_state_bump','off',true);
  return to_jsonb(r);
end;
$$;
revoke all on function public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[],bigint) from public,anon,authenticated;
grant execute on function public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[],bigint) to service_role;


-- One authenticated actor check + one consistent snapshot, without per-row HTTP reads.
create function public.read_multiplayer_round_for_actor(
  p_room_id uuid,p_user_id uuid,p_guest_hash text,p_known_version bigint default -1
) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare player_id uuid; snapshot jsonb;
begin
  player_id:=public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash);
  if player_id is null then return null; end if;
  snapshot:=public.read_multiplayer_snapshot(p_room_id,player_id,p_known_version);
  if snapshot is null or snapshot->>'status'<>'in-progress' or snapshot->>'unchanged'='true' then return snapshot; end if;
  return snapshot || jsonb_build_object('spectators',coalesce((
    select jsonb_agg(jsonb_build_object('user_id',s.user_id,'joined_at',s.joined_at,
      'display_name',coalesce(p.username,'Spectator'),'rp',coalesce(m.rp,0)) order by s.joined_at,s.user_id)
    from public.multiplayer_spectators s left join public.profiles p on p.id=s.user_id
    left join public.multiplayer_profiles m on m.user_id=s.user_id
    where s.room_id=p_room_id and s.last_seen_at>=statement_timestamp()-interval '10 seconds'
  ),'[]'::jsonb));
end;
$$;
revoke all on function public.read_multiplayer_round_for_actor(uuid,uuid,text,bigint) from public,anon,authenticated;
grant execute on function public.read_multiplayer_round_for_actor(uuid,uuid,text,bigint) to service_role;

-- Only finalized results. Raw submissions are limited to the verified viewer.
-- Public completed-match spectators retain their existing signed-in access.
create function public.read_multiplayer_result_snapshot(p_room_id uuid,p_user_id uuid,p_guest_hash text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype; viewer_id uuid; own_result jsonb; spectator boolean;
begin
  select * into r from public.multiplayer_rooms where id=p_room_id;
  if not found then return null; end if;
  viewer_id:=public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash);
  spectator:=viewer_id is null;
  if spectator and not (r.visibility='public' and r.status='completed' and p_user_id is not null) then return null; end if;
  if r.status<>'completed' then return null; end if;
  if not spectator and exists(select 1 from public.multiplayer_result_receipts
    where room_id=p_room_id and player_id=viewer_id) then return null; end if;
  if r.results_finalized_at is null then
    return jsonb_build_object('status','pending','isHost',coalesce((select is_host from public.multiplayer_players where id=viewer_id),false));
  end if;
  select to_jsonb(m) into own_result from public.multiplayer_match_results m
    where room_id=p_room_id and player_id=viewer_id;
  if not spectator and own_result is null then raise exception 'Finalized player result is missing.'; end if;
  return jsonb_build_object('status','ready','viewerMode',case when spectator then 'spectator' else 'player' end,
    'result',own_result,'scoreboard',public.read_multiplayer_scoreboard(p_room_id),
    'placements',coalesce((select jsonb_agg(jsonb_build_object('player_id',player_id,'placement',placement))
      from public.multiplayer_match_results where room_id=p_room_id),'[]'::jsonb),
    'submissions',coalesce((select jsonb_agg(jsonb_build_object(
      'question_number',question_number,'question_id',question_id,'selected_answer',selected_answer,
      'correct',correct,'answer_time_ms',answer_time_ms,'points_earned',points_earned) order by question_number)
      from public.multiplayer_submissions where room_id=p_room_id and player_id=viewer_id),'[]'::jsonb),
    'questions',coalesce((select jsonb_agg(jsonb_build_object('question_number',question_number,
      'question_id',question_id,'difficulty',difficulty) order by question_number)
      from public.multiplayer_match_questions where room_id=p_room_id),'[]'::jsonb));
end;
$$;
revoke all on function public.read_multiplayer_result_snapshot(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.read_multiplayer_result_snapshot(uuid,uuid,text) to service_role;
notify pgrst, 'reload schema';
commit;

