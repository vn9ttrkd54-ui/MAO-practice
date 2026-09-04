-- Prevent presence heartbeats from producing room-state Realtime loops.

begin;

create or replace function public.bump_multiplayer_room_state_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_room_id uuid;
begin
  if tg_op = 'UPDATE' then
    if tg_table_name = 'multiplayer_players'
      and (to_jsonb(new) - 'updated_at') = (to_jsonb(old) - 'updated_at') then
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

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create or replace function public.broadcast_multiplayer_room_state()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('state_version', new.state_version),
    'room_changed',
    'multiplayer-room:' || new.id::text,
    false
  );

  return new;
end;
$$;

revoke all on function public.broadcast_multiplayer_room_state()
  from public, anon, authenticated;

create trigger multiplayer_rooms_broadcast_state
after update on public.multiplayer_rooms
for each row
when (old.state_version is distinct from new.state_version)
execute function public.broadcast_multiplayer_room_state();

commit;
