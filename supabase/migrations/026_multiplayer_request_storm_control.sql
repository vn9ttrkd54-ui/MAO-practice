-- Keep large multiplayer rooms from turning one answer into a room-wide request storm.

begin;

alter table public.multiplayer_rooms
  add column if not exists finalization_started_at timestamptz,
  add column if not exists results_finalized_at timestamptz;

create or replace function public.version_multiplayer_room_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.state_version = old.state_version
    and (to_jsonb(new) - array['state_version', 'updated_at', 'finalization_started_at', 'results_finalized_at'])
      is distinct from
      (to_jsonb(old) - array['state_version', 'updated_at', 'finalization_started_at', 'results_finalized_at']) then
    new.state_version := old.state_version + 1;
  end if;

  return new;
end;
$$;

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
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if tg_table_name = 'multiplayer_players'
      and new.connected is not distinct from old.connected
      and new.left_at is not distinct from old.left_at
      and new.is_host is not distinct from old.is_host
      and new.user_id is not distinct from old.user_id
      and new.guest_nickname is not distinct from old.guest_nickname then
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

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function public.claim_multiplayer_result_finalization(p_room_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  room_row public.multiplayer_rooms%rowtype;
begin
  select * into room_row
  from public.multiplayer_rooms
  where id = p_room_id
  for update;

  if not found or room_row.status <> 'completed' then return 'inactive'; end if;
  if room_row.results_finalized_at is not null
    or exists (select 1 from public.multiplayer_match_results where room_id = p_room_id) then
    return 'ready';
  end if;
  if room_row.finalization_started_at is not null
    and room_row.finalization_started_at > clock_timestamp() - interval '30 seconds' then
    return 'waiting';
  end if;

  update public.multiplayer_rooms
  set finalization_started_at = clock_timestamp()
  where id = p_room_id;
  return 'claimed';
end;
$$;

revoke all on function public.claim_multiplayer_result_finalization(uuid)
  from public, anon, authenticated;
grant execute on function public.claim_multiplayer_result_finalization(uuid)
  to service_role;

commit;
