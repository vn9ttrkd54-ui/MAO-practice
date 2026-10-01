-- Apply before the matching application deployment. No scheduled polling job is added.
begin;

alter table public.multiplayer_players
  add column lobby_tab_id uuid,
  add column lobby_connection_id uuid,
  add column lobby_generation bigint not null default 0;

-- Only trusted server functions may supply an authenticated identity or guest hash.
create function public.multiplayer_lobby_player_id(p_room_id uuid, p_user_id uuid, p_guest_hash text)
returns uuid language sql stable security definer set search_path = '' as $$
  select id from public.multiplayer_players
  where room_id=p_room_id and left_at is null and
    ((p_user_id is not null and user_id=p_user_id) or
     (p_user_id is null and user_id is null and p_guest_hash is not null and reconnect_token_hash=p_guest_hash));
$$;
revoke all on function public.multiplayer_lobby_player_id(uuid,uuid,text) from public,anon,authenticated,service_role;

-- One read-only snapshot, explicitly omitting connection fencing keys and guest secrets.
create function public.read_multiplayer_lobby(p_room_id uuid,p_user_id uuid,p_guest_hash text)
returns jsonb language sql stable security definer set search_path = '' as $$
  with viewer as (
    select public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash) id
  ), roster as (
    select p.id,p.connected,p.updated_at,p.joined_at,
      jsonb_build_object('id',p.id,'user_id',p.user_id,'guest_nickname',p.guest_nickname,
        'is_host',p.is_host,'connected',p.connected,'score',p.score,'placement',p.placement,
        'has_submitted_current_question',p.has_submitted_current_question,
        'display_name',coalesce(n.username,p.guest_nickname,'Player'),'rp',coalesce(m.rp,0)) value
    from public.multiplayer_players p
    left join public.profiles n on n.id=p.user_id
    left join public.multiplayer_profiles m on m.user_id=p.user_id
    where p.room_id=p_room_id and p.left_at is null
  )
  select jsonb_build_object('room',to_jsonb(r),
    'currentPlayer',(select value from roster where id=(select id from viewer)),
    'players',coalesce((select jsonb_agg(value order by joined_at) from roster
      where r.status not in ('waiting','countdown') or
        (connected and updated_at >= statement_timestamp()-interval '30 seconds')),'[]'::jsonb))
  from public.multiplayer_rooms r where r.id=p_room_id and (select id from viewer) is not null;
$$;
revoke all on function public.read_multiplayer_lobby(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.read_multiplayer_lobby(uuid,uuid,text) to service_role;

create function public.change_multiplayer_lobby_presence(
  p_room_id uuid,p_user_id uuid,p_guest_hash text,p_action text,p_tab_id uuid,p_connection_id uuid,p_generation bigint,p_player_id uuid
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.multiplayer_rooms%rowtype; p public.multiplayer_players%rowtype;
  active_count integer; expired_count integer; changed boolean; next_status text;
begin
  if p_action is null or p_action not in ('connect','heartbeat','disconnect') or p_tab_id is null or p_connection_id is null or p_player_id is null
    or p_generation is null or p_generation<1 or p_generation>9007199254740991 then
    raise exception 'Invalid lobby presence request';
  end if;
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found then return jsonb_build_object('status','left'); end if;
  select * into p from public.multiplayer_players where id=public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash);
  if not found then return jsonb_build_object('status','left'); end if;
  if p.id<>p_player_id then return jsonb_build_object('status','left'); end if;
  if r.status not in ('waiting','countdown') then
    return jsonb_build_object('status','started','lobby',public.read_multiplayer_lobby(p_room_id,p_user_id,p_guest_hash));
  end if;
  if p_action='connect' then
    if p.lobby_tab_id=p_tab_id and (p_generation<p.lobby_generation or
      (p_generation=p.lobby_generation and p.lobby_connection_id is distinct from p_connection_id)) then
      return jsonb_build_object('status','conflict');
    end if;
    if p.connected and p.updated_at >= clock_timestamp()-interval '30 seconds'
      and p.lobby_tab_id is not null and p.lobby_tab_id<>p_tab_id then
      return jsonb_build_object('status','conflict');
    end if;
    if p.lobby_tab_id=p_tab_id and p_generation=p.lobby_generation and not p.connected then
      return jsonb_build_object('status','disconnected');
    end if;
  elsif p_action='disconnect' then
    -- Navigation can overtake its initial connect request. Store a tombstone for
    -- that generation so the delayed connect cannot bring the departed page back.
    if p.lobby_tab_id is not null and (p.lobby_tab_id<>p_tab_id or p_generation<p.lobby_generation or
      (p_generation=p.lobby_generation and p.lobby_connection_id is distinct from p_connection_id)) then
      return jsonb_build_object('status','conflict');
    end if;
  elsif p.lobby_connection_id is distinct from p_connection_id or p.lobby_tab_id is distinct from p_tab_id
    or p_generation<>p.lobby_generation then
    return jsonb_build_object('status','conflict');
  elsif p_action='heartbeat' and not p.connected then
    return jsonb_build_object('status','disconnected');
  end if;
  -- A throttled tab's late heartbeat is also a seat reacquisition. It must not
  -- overfill a room that admitted replacements while that tab was stale.
  if p_action<>'disconnect' and (not p.connected or p.updated_at < clock_timestamp()-interval '30 seconds') then
    select count(*) into active_count from public.multiplayer_players
      where room_id=p_room_id and id<>p.id and left_at is null and connected
        and updated_at >= clock_timestamp()-interval '30 seconds';
    if active_count>=r.capacity then return jsonb_build_object('status','full'); end if;
  end if;

  -- Heartbeats cannot revive a disconnected generation. A reload must explicitly
  -- connect; its new generation fences delayed disconnects from the old page.
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  changed := p.connected is distinct from (p_action<>'disconnect') or
    (p_action<>'disconnect' and p.updated_at < clock_timestamp()-interval '30 seconds');
  update public.multiplayer_players set connected=(p_action<>'disconnect'),
    lobby_tab_id=p_tab_id,lobby_connection_id=p_connection_id,lobby_generation=p_generation where id=p.id;
  update public.multiplayer_players set connected=false
    where room_id=p_room_id and left_at is null and connected
      and updated_at < clock_timestamp()-interval '30 seconds';
  get diagnostics expired_count=row_count;
  select count(*) into active_count from public.multiplayer_players
    where room_id=p_room_id and left_at is null and connected
      and updated_at >= clock_timestamp()-interval '30 seconds';
  next_status := case when r.visibility='public' then
    case when active_count<2 then 'waiting' else 'countdown' end else r.status end;
  if changed or expired_count>0 or next_status<>r.status then
    update public.multiplayer_rooms set status=next_status,
      countdown_ends_at=case when next_status='waiting' then null
        when r.visibility='public' and active_count>=r.capacity then clock_timestamp()
        when r.status='waiting' and next_status='countdown' then clock_timestamp()+interval '60 seconds'
        else countdown_ends_at end,
      state_version=state_version+1 where id=p_room_id;
  end if;
  perform set_config('app.multiplayer_skip_state_bump','off',true);
  return jsonb_build_object('status',case when p_action='disconnect' then 'disconnected' else 'connected' end,
    'lobby',case when p_action<>'disconnect' then public.read_multiplayer_lobby(p_room_id,p_user_id,p_guest_hash) end);
end;
$$;
revoke all on function public.change_multiplayer_lobby_presence(uuid,uuid,text,text,uuid,uuid,bigint,uuid) from public,anon,authenticated;
grant execute on function public.change_multiplayer_lobby_presence(uuid,uuid,text,text,uuid,uuid,bigint,uuid) to service_role;

create function public.leave_multiplayer_lobby(p_room_id uuid,p_user_id uuid,p_guest_hash text,p_connection_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare r public.multiplayer_rooms%rowtype; p public.multiplayer_players%rowtype; active_count integer;
begin
  if p_connection_id is null then return 'conflict'; end if;
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found then return 'left'; end if;
  select * into p from public.multiplayer_players where id=public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash);
  if not found then
    -- An account switch must not look like a successful leave from the previous
    -- account's still-active connection. Missing membership after deletion is
    -- otherwise the idempotent success case.
    if p_connection_id is not null and exists(select 1 from public.multiplayer_players
      where room_id=p_room_id and left_at is null and lobby_connection_id=p_connection_id) then return 'conflict'; end if;
    return 'left';
  end if;
  if p.lobby_connection_id is distinct from p_connection_id then return 'conflict'; end if;
  if r.status not in ('waiting','countdown') then return 'started'; end if;
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  if r.visibility='private' and p.is_host then
    -- Notify existing viewers before the normal FK cascade removes this lobby.
    update public.multiplayer_rooms set status='cancelled',countdown_ends_at=null,state_version=state_version+1 where id=p_room_id;
    delete from public.multiplayer_rooms where id=p_room_id;
  else
    delete from public.multiplayer_players where id=p.id;
    select count(*) into active_count from public.multiplayer_players
      where room_id=p_room_id and left_at is null and connected
        and updated_at >= clock_timestamp()-interval '30 seconds';
    update public.multiplayer_rooms set
      status=case when visibility='public' and active_count<2 then 'waiting' else status end,
      countdown_ends_at=case when visibility='public' and active_count<2 then null else countdown_ends_at end,
      state_version=state_version+1 where id=p_room_id;
  end if;
  perform set_config('app.multiplayer_skip_state_bump','off',true);
  return 'left';
end;
$$;
revoke all on function public.leave_multiplayer_lobby(uuid,uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.leave_multiplayer_lobby(uuid,uuid,text,uuid) to service_role;

create function public.start_multiplayer_lobby(
  p_room_id uuid,p_user_id uuid,p_guest_hash text,p_question_ids integer[],p_difficulties integer[]
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
    if active_count<r.capacity and (r.countdown_ends_at is null or r.countdown_ends_at>started) then return to_jsonb(r); end if;
  end if;
  if cardinality(p_question_ids) is distinct from r.question_count
    or cardinality(p_difficulties) is distinct from r.question_count
    or (select count(distinct id) from unnest(p_question_ids) id)<>r.question_count
    or exists(select 1 from unnest(p_question_ids) id where id is null or id<=0)
    or exists(select 1 from unnest(p_difficulties) d where d is null or d not between 1 and 5) then
    raise exception 'Invalid question selection.';
  end if;
  -- Server-selected questions, membership, room transition and replacement queue
  -- either all commit or all roll back. Leave and join use this same room lock.
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  update public.multiplayer_players set left_at=started,connected=false
    where room_id=p_room_id and left_at is null
      and (not connected or updated_at < started-interval '30 seconds');
  insert into public.multiplayer_match_questions(room_id,question_number,question_id,difficulty,preparation_deadline_at)
    select p_room_id,n,p_question_ids[n],p_difficulties[n],case when n=1 then started+interval '15 seconds' end
    from generate_series(1,r.question_count) n;
  update public.multiplayer_rooms set status='in-progress',started_at=started,countdown_ends_at=null,
    current_question_number=1,mode=case when active_count=1 then 'unranked' else mode end,
    state_version=state_version+1 where id=p_room_id returning * into r;
  if r.visibility='public' then
    insert into public.multiplayer_rooms(visibility,mode,division,question_count,seconds_per_question,status,capacity)
      values('public','ranked',r.division,r.question_count,60,'waiting',20);
  end if;
  perform set_config('app.multiplayer_skip_state_bump','off',true);
  return to_jsonb(r);
end;
$$;
revoke all on function public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[]) from public,anon,authenticated;
grant execute on function public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[]) to service_role;

create function public.join_public_multiplayer_lobby(p_room_id uuid,p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.multiplayer_rooms%rowtype; p public.multiplayer_players%rowtype; active_count integer;
begin
  if p_user_id is null or not exists(select 1 from public.profiles where id=p_user_id) then raise exception 'Sign in to join public rooms.'; end if;
  select * into r from public.multiplayer_rooms where id=p_room_id and visibility='public' for update;
  if not found then raise exception 'Public room not found.'; end if;
  if r.status not in ('waiting','countdown') then raise exception 'That public room has already started.'; end if;
  select * into p from public.multiplayer_players where room_id=p_room_id and user_id=p_user_id;
  if found and p.connected and p.left_at is null and p.updated_at >= clock_timestamp()-interval '30 seconds' then
    raise exception 'This account is active in another tab. Close it and try again in 30 seconds.';
  end if;
  select count(*) into active_count from public.multiplayer_players
    where room_id=p_room_id and left_at is null and connected and updated_at >= clock_timestamp()-interval '30 seconds';
  if active_count>=r.capacity then raise exception 'That public room is full.'; end if;
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  insert into public.multiplayer_profiles(user_id) values(p_user_id) on conflict(user_id) do nothing;
  -- A deliberate stale-seat rejoin creates a new membership incarnation. Any
  -- delayed request from the abandoned page is bound to the old player ID and
  -- cannot claim or disconnect this replacement, even before its first connect.
  if p.id is not null then delete from public.multiplayer_players where id=p.id; end if;
  insert into public.multiplayer_players(room_id,user_id) values(p_room_id,p_user_id);
  active_count := active_count+1;
  update public.multiplayer_rooms set
    status=case when active_count>=2 then 'countdown' else 'waiting' end,
    countdown_ends_at=case when active_count<2 then null when active_count>=capacity then clock_timestamp()
      when r.status='waiting' then clock_timestamp()+interval '60 seconds' else countdown_ends_at end,
    state_version=state_version+1 where id=p_room_id returning * into r;
  perform set_config('app.multiplayer_skip_state_bump','off',true);
  return to_jsonb(r)||jsonb_build_object('player_count',active_count);
end;
$$;
revoke all on function public.join_public_multiplayer_lobby(uuid,uuid) from public,anon,authenticated;
grant execute on function public.join_public_multiplayer_lobby(uuid,uuid) to service_role;

commit;
