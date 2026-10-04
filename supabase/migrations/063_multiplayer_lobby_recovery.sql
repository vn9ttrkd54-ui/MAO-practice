-- Private lobby recovery + new scoring for never-started public lobbies.
-- Requires 062. Apply in a quiet lobby window before deploying the app.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

-- A deliberate host action from the directory, independent of a tab's presence.
-- Same room lock as Start: whichever wins decides; never close a running game.
-- Cancel rather than delete, preserving rows for the existing cleanup process.
create function public.close_owned_private_multiplayer_lobby(p_room_id uuid,p_user_id uuid)
returns text language plpgsql security definer set search_path='' as $$
declare r public.multiplayer_rooms%rowtype;
begin
  if p_user_id is null then raise exception 'Sign in to close your room.' using errcode='P0001'; end if;
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found then return 'closed'; end if;
  if r.visibility<>'private' or not exists (
    select 1 from public.multiplayer_players p where p.room_id=r.id and p.id=r.host_player_id
      and p.user_id=p_user_id and p.is_host and p.left_at is null
  ) then raise exception 'Only the host can close this private room.' using errcode='P0001'; end if;
  if r.status='cancelled' then return 'closed'; end if;
  if r.status not in ('waiting','countdown') or r.started_at is not null or r.current_question_number<>0
    or exists(select 1 from public.multiplayer_match_questions where room_id=r.id)
    or exists(select 1 from public.multiplayer_submissions where room_id=r.id)
    or exists(select 1 from public.multiplayer_match_results where room_id=r.id)
    or exists(select 1 from public.multiplayer_match_history where room_id=r.id)
    or exists(select 1 from public.multiplayer_players where room_id=r.id
      and (score<>0 or placement is not null or has_submitted_current_question))
  then return 'started'; end if;
  update public.multiplayer_rooms set status='cancelled',countdown_ends_at=null,state_version=state_version+1
    where id=r.id;
  return 'closed';
end;
$$;
revoke all on function public.close_owned_private_multiplayer_lobby(uuid,uuid) from public,anon,authenticated;
grant execute on function public.close_owned_private_multiplayer_lobby(uuid,uuid) to service_role;

-- Lock each candidate against simultaneous join/start. Recheck after the lock.
-- No private rooms, question records, submissions, totals, ratings or history change.
do $$
declare candidate record;
begin
  for candidate in select id from public.multiplayer_rooms
    where visibility='public' and scoring_version=1 and status in ('waiting','countdown')
    order by id for update
  loop
    update public.multiplayer_rooms r set scoring_version=2,
      settings_version=settings_version+1,state_version=state_version+1
    where r.id=candidate.id and r.visibility='public' and r.scoring_version=1
      and r.status in ('waiting','countdown') and r.started_at is null and r.current_question_number=0
      and not exists(select 1 from public.multiplayer_match_questions where room_id=r.id)
      and not exists(select 1 from public.multiplayer_submissions where room_id=r.id)
      and not exists(select 1 from public.multiplayer_match_results where room_id=r.id)
      and not exists(select 1 from public.multiplayer_match_history where room_id=r.id)
      and not exists(select 1 from public.multiplayer_players where room_id=r.id
        and (score<>0 or placement is not null or has_submitted_current_question));
    -- settings_version invalidates old Ready consent; no timer is extended.
  end loop;
end;
$$;
notify pgrst, 'reload schema';
commit;
