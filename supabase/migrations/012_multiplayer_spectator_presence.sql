begin;

alter table public.multiplayer_spectators
  add column if not exists last_seen_at timestamptz not null default timezone('utc', now());

create index if not exists multiplayer_spectators_presence_idx
  on public.multiplayer_spectators (room_id, last_seen_at);

commit;
