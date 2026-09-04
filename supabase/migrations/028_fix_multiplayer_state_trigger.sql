-- Keep table-specific trigger fields inside table-specific branches.

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
  if current_setting('app.multiplayer_skip_state_bump', true) = 'on' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if tg_table_name = 'multiplayer_players' then
      if new.connected is not distinct from old.connected
        and new.left_at is not distinct from old.left_at
        and new.is_host is not distinct from old.is_host
        and new.user_id is not distinct from old.user_id
        and new.guest_nickname is not distinct from old.guest_nickname then
        return new;
      end if;
    elsif tg_table_name = 'multiplayer_spectators' then
      if (to_jsonb(new) - 'last_seen_at') = (to_jsonb(old) - 'last_seen_at') then
        return new;
      end if;
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

commit;
