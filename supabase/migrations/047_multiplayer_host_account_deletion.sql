-- Auth deletion cascades to players. Detach the host before the existing,
-- deferred room -> player FK is checked; never cascade-delete the whole room.
begin;

create function public.detach_deleted_multiplayer_host()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.multiplayer_rooms
  set host_player_id = null,
      status = case when status in ('waiting', 'countdown') then 'cancelled' else status end,
      countdown_ends_at = case when status in ('waiting', 'countdown') then null else countdown_ends_at end
  where id = old.room_id and host_player_id = old.id;

  -- Running games are advanced by the database worker, not the host. Finished
  -- rooms and surviving players' results must remain available. A cancelled
  -- lobby retains its records but cannot be started by a departed host.
  return old;
end;
$$;

revoke all on function public.detach_deleted_multiplayer_host()
  from public, anon, authenticated, service_role;

create trigger multiplayer_players_detach_deleted_host
before delete on public.multiplayer_players
for each row execute function public.detach_deleted_multiplayer_host();

commit;
