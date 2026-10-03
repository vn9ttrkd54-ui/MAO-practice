-- Multiplayer settings, Stage 1. No scoring, Ready, or loading changes.
-- Apply during a quiet lobby window, then deploy the matching app.
begin;

alter table public.multiplayer_rooms
  add column difficulty_band text check (difficulty_band in ('1-3','2-4','3-5')),
  add column settings_version bigint not null default 0;
-- Existing active/private rooms keep NULL = their original unrestricted pool.
alter table public.multiplayer_rooms alter column difficulty_band set default '2-4';
alter table public.multiplayer_rooms drop constraint multiplayer_rooms_seconds_per_question_check;
alter table public.multiplayer_rooms add constraint multiplayer_rooms_seconds_per_question_check
  check (seconds_per_question in (30,60,90,120,150,180));
alter table public.multiplayer_rooms drop constraint multiplayer_rooms_public_configuration;
update public.multiplayer_rooms set seconds_per_question=90,difficulty_band='2-4',
  settings_version=settings_version+1,state_version=state_version+1
  where visibility='public' and status in ('waiting','countdown');
alter table public.multiplayer_rooms add constraint multiplayer_rooms_public_configuration check (
  visibility='private' or (mode='ranked' and question_count in (5,15,30) and capacity=20
    and (seconds_per_question=90 or status not in ('waiting','countdown'))));

-- Called only inside trusted lobby operations. Lock ordering stays room -> players.
-- Keep a fresh incumbent; otherwise choose the earliest eligible remaining joiner.
create function public.sync_public_multiplayer_host(p_room_id uuid,p_exclude_player uuid default null)
returns void language plpgsql security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype; next_host uuid; previous_skip text;
begin
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found or r.visibility<>'public' or r.status not in ('waiting','countdown') then return; end if;
  select id into next_host from public.multiplayer_players
    where room_id=p_room_id and left_at is null and connected
      and updated_at>=clock_timestamp()-interval '30 seconds'
      and id is distinct from p_exclude_player
    order by (id=r.host_player_id) desc,joined_at,id limit 1;
  if next_host is not distinct from r.host_player_id then return; end if;
  previous_skip := current_setting('app.multiplayer_skip_state_bump',true);
  perform set_config('app.multiplayer_skip_state_bump','on',true);
  -- Never renew an expired host's presence merely by changing their badge.
  -- Do not update the row being deleted from its BEFORE DELETE trigger.
  update public.multiplayer_players set is_host=coalesce(id=next_host,false),
    connected=connected and left_at is null and updated_at>=clock_timestamp()-interval '30 seconds'
    where room_id=p_room_id and id is distinct from p_exclude_player
      and is_host is distinct from coalesce(id=next_host,false);
  update public.multiplayer_rooms set host_player_id=next_host,state_version=state_version+1
    where id=p_room_id;
  perform set_config('app.multiplayer_skip_state_bump',coalesce(previous_skip,'off'),true);
end;
$$;
revoke all on function public.sync_public_multiplayer_host(uuid,uuid) from public,anon,authenticated,service_role;

create or replace function public.detach_deleted_multiplayer_host()
returns trigger language plpgsql security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype;
begin
  select * into r from public.multiplayer_rooms where id=old.room_id and host_player_id=old.id for update;
  if not found then return old; end if;
  if r.visibility='public' and r.status in ('waiting','countdown') then
    perform public.sync_public_multiplayer_host(old.room_id,old.id);
  else
    update public.multiplayer_rooms set host_player_id=null,
      status=case when visibility='private' and status in ('waiting','countdown') then 'cancelled' else status end,
      countdown_ends_at=case when visibility='private' and status in ('waiting','countdown') then null else countdown_ends_at end,
      state_version=state_version+1 where id=old.room_id;
  end if;
  return old;
end;
$$;
revoke all on function public.detach_deleted_multiplayer_host() from public,anon,authenticated,service_role;

create function public.set_multiplayer_lobby_difficulty(
  p_room_id uuid,p_user_id uuid,p_guest_hash text,p_difficulty_band text,
  p_settings_version bigint,p_connection_id uuid,p_player_id uuid
) returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype; p public.multiplayer_players%rowtype;
begin
  if p_difficulty_band is null or p_difficulty_band not in ('1-3','2-4','3-5') then
    raise exception 'Choose difficulty 1–3, 2–4, or 3–5.';
  end if;
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found or r.status not in ('waiting','countdown') then raise exception 'This room has already started or closed.'; end if;
  select * into p from public.multiplayer_players where id=public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash);
  if not found or p.id is distinct from p_player_id or not p.is_host or r.host_player_id is distinct from p.id
    or not p.connected or p.updated_at<clock_timestamp()-interval '30 seconds'
    or p_connection_id is null or p.lobby_connection_id is distinct from p_connection_id then
    raise exception 'Only the connected host can change difficulty.';
  end if;
  -- Safe retry of a committed, lost-response save, without extending any timer.
  if r.difficulty_band=p_difficulty_band then return public.read_multiplayer_lobby(p_room_id,p_user_id,p_guest_hash); end if;
  if r.settings_version is distinct from p_settings_version then raise exception 'Settings changed. Reload the lobby and try again.'; end if;
  if r.countdown_ends_at is not null and r.countdown_ends_at<=clock_timestamp()+interval '10 seconds' then
    raise exception 'Difficulty is locked during the final 10 seconds.';
  end if;
  update public.multiplayer_rooms set difficulty_band=p_difficulty_band,
    settings_version=settings_version+1,state_version=state_version+1 where id=p_room_id;
  return public.read_multiplayer_lobby(p_room_id,p_user_id,p_guest_hash);
end;
$$;
revoke all on function public.set_multiplayer_lobby_difficulty(uuid,uuid,text,text,bigint,uuid,uuid) from public,anon,authenticated;
grant execute on function public.set_multiplayer_lobby_difficulty(uuid,uuid,text,text,bigint,uuid,uuid) to service_role;
create or replace function public.change_multiplayer_lobby_presence(
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
  perform public.sync_public_multiplayer_host(p_room_id);
  return jsonb_build_object('status',case when p_action='disconnect' then 'disconnected' else 'connected' end,
    'lobby',case when p_action<>'disconnect' then public.read_multiplayer_lobby(p_room_id,p_user_id,p_guest_hash) end);
end;
$$;
revoke all on function public.change_multiplayer_lobby_presence(uuid,uuid,text,text,uuid,uuid,bigint,uuid) from public,anon,authenticated;
grant execute on function public.change_multiplayer_lobby_presence(uuid,uuid,text,text,uuid,uuid,bigint,uuid) to service_role;

create or replace function public.leave_multiplayer_lobby(p_room_id uuid,p_user_id uuid,p_guest_hash text,p_connection_id uuid)
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
  perform public.sync_public_multiplayer_host(p_room_id);
  return 'left';
end;
$$;
revoke all on function public.leave_multiplayer_lobby(uuid,uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.leave_multiplayer_lobby(uuid,uuid,text,uuid) to service_role;

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
    if active_count<r.capacity and (r.countdown_ends_at is null or r.countdown_ends_at>started) then return to_jsonb(r); end if;
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
  insert into public.multiplayer_match_questions(room_id,question_number,question_id,difficulty,preparation_deadline_at)
    select p_room_id,n,p_question_ids[n],p_difficulties[n],case when n=1 then started+interval '15 seconds' end
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

create or replace function public.join_public_multiplayer_lobby(p_room_id uuid,p_user_id uuid)
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
  perform public.sync_public_multiplayer_host(p_room_id);
  select * into r from public.multiplayer_rooms where id=p_room_id;
  return to_jsonb(r)||jsonb_build_object('player_count',active_count);
end;
$$;
revoke all on function public.join_public_multiplayer_lobby(uuid,uuid) from public,anon,authenticated;
grant execute on function public.join_public_multiplayer_lobby(uuid,uuid) to service_role;


create or replace function public.create_private_multiplayer_room(
  p_user_id uuid, p_code text, p_mode text, p_division text,
  p_question_count integer, p_seconds_per_question integer, p_difficulty_band text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare new_room_id uuid; new_host_id uuid;
begin
  if p_difficulty_band is null or p_difficulty_band not in ('1-3','2-4','3-5') then raise exception 'Choose a valid difficulty range.'; end if;
  -- The row lock serializes requests from the same account across app instances.
  perform 1 from public.profiles where id = p_user_id for update;
  if not found then
    raise exception 'Sign in to create a room.' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.multiplayer_players p
    join public.multiplayer_rooms r on r.id = p.room_id
    where p.user_id = p_user_id and p.is_host and p.left_at is null
      and r.visibility = 'private'
      and r.status in ('waiting', 'countdown', 'in-progress')
  ) then
    raise exception 'Close or finish your current room before creating another.' using errcode = 'P0001';
  end if;

  if (select count(*) from public.multiplayer_room_creations
      where user_id = p_user_id and created_at > clock_timestamp() - interval '10 minutes') >= 3 then
    raise exception 'You can create up to 3 rooms every 10 minutes. Please try again shortly.' using errcode = 'P0001';
  end if;

  insert into public.multiplayer_rooms
    (code, visibility, mode, division, question_count, seconds_per_question,
     capacity, host_user_id, difficulty_band)
  values (p_code, 'private', p_mode, p_division, p_question_count,
    p_seconds_per_question, 30, p_user_id, p_difficulty_band)
  returning id into new_room_id;

  insert into public.multiplayer_players(room_id, user_id, is_host)
  values (new_room_id, p_user_id, true) returning id into new_host_id;
  update public.multiplayer_rooms set host_player_id = new_host_id where id = new_room_id;
  insert into public.multiplayer_room_creations(user_id) values (p_user_id);
  return new_room_id;
end;
$$;
revoke all on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)
  from public, anon, authenticated;
grant execute on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)
  to service_role;


-- Keep old signatures during the rollout. Old starts cannot bypass selected bands.
create or replace function public.start_multiplayer_lobby(
  p_room_id uuid,p_user_id uuid,p_guest_hash text,p_question_ids integer[],p_difficulties integer[]
) returns jsonb language sql security definer set search_path='' as $$
  select public.start_multiplayer_lobby(p_room_id,p_user_id,p_guest_hash,p_question_ids,p_difficulties,null);
$$;
revoke all on function public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[]) from public,anon,authenticated;
grant execute on function public.start_multiplayer_lobby(uuid,uuid,text,integer[],integer[]) to service_role;

create or replace function public.create_private_multiplayer_room(
  p_user_id uuid,p_code text,p_mode text,p_division text,p_question_count integer,p_seconds_per_question integer
) returns uuid language sql security definer set search_path='' as $$
  select public.create_private_multiplayer_room(p_user_id,p_code,p_mode,p_division,p_question_count,p_seconds_per_question,'2-4');
$$;
revoke all on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer) to service_role;

do $$ declare r record; begin
  for r in select id from public.multiplayer_rooms where visibility='public' and status in ('waiting','countdown')
  loop perform public.sync_public_multiplayer_host(r.id); end loop;
end $$;
notify pgrst, 'reload schema';
commit;
