-- Admins/owners bypass private-room creation quotas. All other limits stay intact.
-- Requires 064. No existing games, memberships, progress, scores or roles are changed.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

-- Creation-time metadata, NOT authorization: every request checks profiles.role.
-- Existing rooms remain non-exempt; promotion does not require rewriting them.
alter table public.multiplayer_rooms
  add column creation_limit_exempt boolean not null default false;

-- Keep the uniqueness backstop for ordinary rooms while allowing privileged hosts
-- to retain host_user_id on every room (including for account-deletion handling).
drop index public.multiplayer_one_active_private_host;
create unique index multiplayer_one_active_private_host
  on public.multiplayer_rooms(host_user_id)
  where visibility = 'private' and status in ('waiting', 'countdown', 'in-progress')
    and host_user_id is not null and not creation_limit_exempt;

create or replace function public.create_private_multiplayer_room(
  p_user_id uuid, p_code text, p_mode text, p_division text,
  p_question_count integer, p_seconds_per_question integer, p_difficulty_band text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  new_room_id uuid;
  new_host_id uuid;
  privileged_creator boolean;
begin
  if p_difficulty_band is null or p_difficulty_band not in ('1-3','2-4','3-5') then
    raise exception 'Choose a valid difficulty range.';
  end if;

  -- Serialize creation and role changes for this verified account across servers.
  -- Never trust a supplied role, user metadata or an existing room's exemption.
  select coalesce(role in ('admin', 'owner'), false) into privileged_creator
    from public.profiles where id = p_user_id for update;
  if not found then
    raise exception 'Sign in to create a room.' using errcode = 'P0001';
  end if;

  if not privileged_creator then
    -- Count previously exempt rooms too after demotion; preserve legacy rooms
    -- whose host_user_id was not backfilled, using their host membership.
    if exists (
      select 1 from public.multiplayer_rooms r
      where r.visibility = 'private' and r.status in ('waiting', 'countdown', 'in-progress')
        and (r.host_user_id = p_user_id or exists (
          select 1 from public.multiplayer_players p
          where p.room_id = r.id and p.user_id = p_user_id
            and p.is_host and p.left_at is null
        ))
    ) then
      raise exception 'Close or finish your current room before creating another.' using errcode = 'P0001';
    end if;

    if (select count(*) from public.multiplayer_room_creations
        where user_id = p_user_id and created_at > clock_timestamp() - interval '10 minutes') >= 3 then
      raise exception 'You can create up to 3 rooms every 10 minutes. Please try again shortly.' using errcode = 'P0001';
    end if;
  end if;

  insert into public.multiplayer_rooms
    (code, visibility, mode, division, question_count, seconds_per_question,
     capacity, host_user_id, difficulty_band, creation_limit_exempt)
  values (p_code, 'private', p_mode, p_division, p_question_count,
    p_seconds_per_question, 30, p_user_id, p_difficulty_band, privileged_creator)
  returning id into new_room_id;

  insert into public.multiplayer_players(room_id, user_id, is_host)
  values (new_room_id, p_user_id, true) returning id into new_host_id;
  update public.multiplayer_rooms set host_player_id = new_host_id where id = new_room_id;
  -- Keep the ledger for every role so demotion restores the rolling quota.
  insert into public.multiplayer_room_creations(user_id) values (p_user_id);
  return new_room_id;
end;
$$;
revoke all on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)
  from public, anon, authenticated;
grant execute on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)
  to service_role;

-- The six-argument compatibility wrapper from 059 delegates to this function.
notify pgrst, 'reload schema';
commit;
