-- Stage 4: read-only, round-scoped feedback. No score or user-data rewrites.
-- Apply after 061 and before deploying the Stage 4 application.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

-- The original own-player SELECT grant also exposes the live score directly.
-- Browser clients now use verified HTTP snapshots. Keep just the identity
-- columns required by the existing private-room membership RLS policy.
revoke select on public.multiplayer_players from public,anon,authenticated;
revoke select(score) on public.multiplayer_players from public,anon,authenticated;
grant select(id,room_id,user_id) on public.multiplayer_players to authenticated;

-- Only trusted server code may call this helper, after checking room access.
-- Scores exclude the open round so their deltas cannot reveal correctness.
-- A client clock/deadline is NOT sufficient to close a round (transport grace).
create function public.read_multiplayer_scoreboard(p_room_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'stateVersion',r.state_version,'status',r.status,'roomId',r.id,
    'totalQuestions',r.question_count,'scoringVersion',r.scoring_version,
    'questionDurationSeconds',r.seconds_per_question,'question',to_jsonb(q),
    'roundClosed',closed.value,
    'upcoming',case when q.round_finished_at is not null or q.intermission_ends_at is not null then
      (select to_jsonb(n) from public.multiplayer_match_questions n
       where n.room_id=r.id and n.question_number=q.question_number+1) end,
    'players',coalesce((select jsonb_agg(jsonb_build_object(
      'id',p.id,'user_id',p.user_id,'guest_nickname',p.guest_nickname,
      'is_host',p.is_host,'connected',p.connected,'placement',p.placement,
      'score',case when closed.value then p.score else p.score-coalesce(s.points_earned,0) end,
      'has_submitted_current_question',s.player_id is not null,
      'display_name',coalesce(profile.username,p.guest_nickname,'Player'),'rp',coalesce(rating.rp,0),
      'round_result',case when closed.value and q.question_number is not null then jsonb_build_object(
        'questionNumber',q.question_number,
        'outcome',case when s.player_id is null then 'blank' when s.selected_answer is null then 'give-up'
          when s.correct then 'correct' else 'incorrect' end,
        'pointsEarned',coalesce(s.points_earned,0),'answerTimeMs',s.answer_time_ms) end
      ) order by p.joined_at,p.id)
      from public.multiplayer_players p
      left join public.profiles profile on profile.id=p.user_id
      left join public.multiplayer_profiles rating on rating.user_id=p.user_id
      left join public.multiplayer_submissions s on s.room_id=r.id and s.player_id=p.id
        and s.question_number=q.question_number
      where p.room_id=r.id and p.left_at is null),'[]'::jsonb))
  from public.multiplayer_rooms r
  left join public.multiplayer_match_questions q on q.room_id=r.id and q.question_number=r.current_question_number
  cross join lateral (select r.status='completed' or q.round_finished_at is not null
    or q.intermission_ends_at is not null as value) closed
  where r.id=p_room_id;
$$;
revoke all on function public.read_multiplayer_scoreboard(uuid) from public,anon,authenticated;
grant execute on function public.read_multiplayer_scoreboard(uuid) to service_role;

create or replace function public.read_multiplayer_snapshot(p_room_id uuid,p_player_id uuid,p_known_version bigint default -1)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case when r.state_version=p_known_version then
    jsonb_build_object('unchanged',true,'stateVersion',r.state_version,'status',r.status)
  else public.read_multiplayer_scoreboard(r.id) || jsonb_build_object('currentPlayerId',p_player_id) end
  from public.multiplayer_rooms r where r.id=p_room_id and exists(
    select 1 from public.multiplayer_players p where p.room_id=r.id and p.id=p_player_id and p.left_at is null);
$$;
revoke all on function public.read_multiplayer_snapshot(uuid,uuid,bigint) from public,anon,authenticated;
grant execute on function public.read_multiplayer_snapshot(uuid,uuid,bigint) to service_role;

-- Lobby/heartbeat responses must not offer an alternate route to live scores.
create or replace function public.read_multiplayer_lobby(p_room_id uuid,p_user_id uuid,p_guest_hash text)
returns jsonb language sql stable security definer set search_path = '' as $$
  with viewer as (
    select public.multiplayer_lobby_player_id(p_room_id,p_user_id,p_guest_hash) id
  ), scoreboard as (
    select s.value from jsonb_array_elements(case when (select id from viewer) is not null
      then public.read_multiplayer_scoreboard(p_room_id)->'players' else '[]'::jsonb end) s
  ), roster as (
    select p.id,p.connected,p.updated_at,p.joined_at,
      s.value || jsonb_build_object('lobby_ready',coalesce(
        r.visibility='public' and r.status in ('waiting','countdown') and p.connected
        and p.updated_at>=statement_timestamp()-interval '30 seconds'
        and p.lobby_ready_settings_version=r.settings_version,false)) value
    from public.multiplayer_players p join public.multiplayer_rooms r on r.id=p.room_id
    join scoreboard s on s.value->>'id'=p.id::text
    where p.room_id=p_room_id and p.left_at is null
  )
  select jsonb_build_object('room',to_jsonb(r),
    'currentPlayer',(select value from roster where id=(select id from viewer)),
    'players',coalesce((select jsonb_agg(value order by joined_at,id) from roster
      where r.status not in ('waiting','countdown') or
        (connected and updated_at>=statement_timestamp()-interval '30 seconds')),'[]'::jsonb))
  from public.multiplayer_rooms r where r.id=p_room_id and (select id from viewer) is not null;
$$;
revoke all on function public.read_multiplayer_lobby(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.read_multiplayer_lobby(uuid,uuid,text) to service_role;
commit;
