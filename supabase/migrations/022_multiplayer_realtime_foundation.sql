-- Multiplayer Realtime foundation
--
-- This migration does not switch the client away from polling. It adds the
-- authoritative state markers and delivery receipts needed to do that safely.

begin;

alter table public.multiplayer_rooms
  add column state_version bigint not null default 0
    check (state_version >= 0);

alter table public.multiplayer_match_questions
  add column hard_ends_at timestamptz;

alter table public.multiplayer_match_questions
  add constraint multiplayer_match_questions_hard_deadline_order check (
    hard_ends_at is null
    or (started_at is not null and hard_ends_at >= started_at)
  );

create table public.multiplayer_question_deliveries (
  room_id uuid not null,
  question_number integer not null,
  player_id uuid not null,
  delivered_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now()),

  primary key (room_id, question_number, player_id),
  constraint multiplayer_question_deliveries_question_fkey
    foreign key (room_id, question_number)
    references public.multiplayer_match_questions (room_id, question_number)
    on delete cascade,
  constraint multiplayer_question_deliveries_player_fkey
    foreign key (room_id, player_id)
    references public.multiplayer_players (room_id, id)
    on delete cascade,
  constraint multiplayer_question_deliveries_time_order check (
    last_seen_at >= delivered_at
  )
);

create index multiplayer_question_deliveries_player_idx
  on public.multiplayer_question_deliveries (player_id, delivered_at desc);

alter table public.multiplayer_question_deliveries enable row level security;
revoke all on public.multiplayer_question_deliveries from anon, authenticated;

-- Only trusted server code can acknowledge delivery. The first receipt is
-- preserved so reconnects and duplicate requests cannot reset a player's timer.
create or replace function public.acknowledge_multiplayer_question_delivery(
  p_room_id uuid,
  p_question_number integer,
  p_player_id uuid
)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  receipt_time timestamptz;
begin
  if not exists (
    select 1
    from public.multiplayer_rooms room
    join public.multiplayer_match_questions question
      on question.room_id = room.id
     and question.question_number = p_question_number
    join public.multiplayer_players player
      on player.room_id = room.id
     and player.id = p_player_id
    where room.id = p_room_id
      and room.status = 'in-progress'
      and room.current_question_number = p_question_number
      and player.left_at is null
      and question.started_at is not null
      and question.intermission_ends_at is null
  ) then
    raise exception 'Question is not available for delivery';
  end if;

  insert into public.multiplayer_question_deliveries (
    room_id,
    question_number,
    player_id
  ) values (
    p_room_id,
    p_question_number,
    p_player_id
  )
  on conflict (room_id, question_number, player_id)
  do update set last_seen_at = timezone('utc', now())
  returning delivered_at into receipt_time;

  return receipt_time;
end;
$$;

revoke all on function public.acknowledge_multiplayer_question_delivery(
  uuid,
  integer,
  uuid
) from public, anon, authenticated;
grant execute on function public.acknowledge_multiplayer_question_delivery(
  uuid,
  integer,
  uuid
) to service_role;

-- A single monotonic version lets Realtime clients discard stale events and
-- recover the complete state through HTTP only when an event was missed.
create or replace function public.bump_multiplayer_room_state_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_room_id uuid;
begin
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

revoke all on function public.bump_multiplayer_room_state_version()
  from public, anon, authenticated;

create or replace function public.version_multiplayer_room_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.state_version = old.state_version then
    new.state_version := old.state_version + 1;
  end if;

  return new;
end;
$$;

revoke all on function public.version_multiplayer_room_update()
  from public, anon, authenticated;

create trigger multiplayer_rooms_version_state_update
before update on public.multiplayer_rooms
for each row execute function public.version_multiplayer_room_update();

create trigger multiplayer_players_bump_room_state
after insert or update or delete on public.multiplayer_players
for each row execute function public.bump_multiplayer_room_state_version();

create trigger multiplayer_match_questions_bump_room_state
after insert or update or delete on public.multiplayer_match_questions
for each row execute function public.bump_multiplayer_room_state_version();

create trigger multiplayer_spectators_bump_room_state
after insert or update or delete on public.multiplayer_spectators
for each row execute function public.bump_multiplayer_room_state_version();

commit;
