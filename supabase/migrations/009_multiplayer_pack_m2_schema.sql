-- MAO Practice: Multiplayer Pack M2 database architecture

begin;

-- -----------------------------------------------------------------------------
-- Persistent account rating and match totals
-- -----------------------------------------------------------------------------

create table public.multiplayer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rp integer not null default 0 check (rp >= 0),
  ranked_matches_played integer not null default 0
    check (ranked_matches_played >= 0),
  ranked_wins integer not null default 0 check (ranked_wins >= 0),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint multiplayer_profiles_wins_not_above_matches
    check (ranked_wins <= ranked_matches_played)
);

create index multiplayer_profiles_rp_idx
  on public.multiplayer_profiles (rp desc, ranked_wins desc);

create trigger multiplayer_profiles_set_updated_at
before update on public.multiplayer_profiles
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Rooms
-- Public rooms are server-managed queues. Private rooms use an eight-character
-- code and may contain account or guest players.
-- -----------------------------------------------------------------------------

create table public.multiplayer_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  visibility text not null check (visibility in ('public', 'private')),
  mode text not null check (mode in ('ranked', 'unranked')),
  division text not null check (division in ('Mu', 'Alpha', 'Theta')),
  question_count integer not null check (question_count between 1 and 30),
  seconds_per_question integer not null
    check (seconds_per_question in (30, 60, 90, 120)),
  status text not null default 'waiting'
    check (status in (
      'waiting',
      'countdown',
      'in-progress',
      'completed',
      'cancelled'
    )),
  capacity integer not null check (capacity between 1 and 30),
  host_player_id uuid,
  current_question_number integer not null default 0
    check (current_question_number between 0 and question_count),
  countdown_ends_at timestamptz,
  intermission_ends_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  started_at timestamptz,
  completed_at timestamptz,

  constraint multiplayer_rooms_code_by_visibility check (
    (visibility = 'public' and code is null)
    or
    (visibility = 'private' and code ~ '^[A-Z0-9]{8}$')
  ),
  constraint multiplayer_rooms_public_configuration check (
    visibility = 'private'
    or (
      mode = 'ranked'
      and question_count in (5, 15, 30)
      and seconds_per_question = 60
      and capacity = 20
      and host_player_id is null
    )
  ),
  constraint multiplayer_rooms_private_capacity check (
    visibility = 'public' or capacity <= 30
  ),
  constraint multiplayer_rooms_ranked_minimum_questions check (
    mode = 'unranked' or question_count >= 5
  ),
  constraint multiplayer_rooms_time_order check (
    (started_at is null or started_at >= created_at)
    and (completed_at is null or started_at is not null)
    and (completed_at is null or completed_at >= started_at)
  )
);

create index multiplayer_rooms_public_lobby_idx
  on public.multiplayer_rooms (
    division,
    question_count,
    status,
    created_at
  )
  where visibility = 'public';

create index multiplayer_rooms_ongoing_public_idx
  on public.multiplayer_rooms (started_at desc)
  where visibility = 'public' and status = 'in-progress';

create unique index multiplayer_rooms_one_waiting_public_slot
  on public.multiplayer_rooms (division, question_count)
  where visibility = 'public'
    and status in ('waiting', 'countdown');

create trigger multiplayer_rooms_set_updated_at
before update on public.multiplayer_rooms
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Players and spectators
-- Exactly one of user_id or guest_nickname identifies a player. Reconnect-token
-- hashes are stored for guests; raw reconnect tokens never enter the database.
-- -----------------------------------------------------------------------------

create table public.multiplayer_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.multiplayer_rooms(id)
    on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  guest_nickname text,
  reconnect_token_hash text,
  is_host boolean not null default false,
  connected boolean not null default true,
  score integer not null default 0 check (score >= 0),
  placement integer check (placement is null or placement >= 1),
  has_submitted_current_question boolean not null default false,
  joined_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  left_at timestamptz,

  constraint multiplayer_players_identity check (
    (user_id is not null and guest_nickname is null
      and reconnect_token_hash is null)
    or
    (user_id is null and guest_nickname is not null
      and reconnect_token_hash is not null)
  ),
  constraint multiplayer_players_guest_nickname_format check (
    guest_nickname is null
    or guest_nickname ~ '^[A-Za-z0-9_ ]{3,20}$'
  ),
  constraint multiplayer_players_left_state check (
    left_at is null or connected = false
  ),
  unique (room_id, id),
  unique (room_id, id, user_id)
);

create unique index multiplayer_players_room_user_unique
  on public.multiplayer_players (room_id, user_id)
  where user_id is not null;

create unique index multiplayer_players_room_guest_nickname_unique
  on public.multiplayer_players (room_id, lower(guest_nickname))
  where guest_nickname is not null;

create index multiplayer_players_room_score_idx
  on public.multiplayer_players (room_id, score desc, joined_at);

create trigger multiplayer_players_set_updated_at
before update on public.multiplayer_players
for each row execute function public.set_updated_at();

alter table public.multiplayer_rooms
  add constraint multiplayer_rooms_host_player_fkey
  foreign key (id, host_player_id)
  references public.multiplayer_players (room_id, id)
  deferrable initially deferred;

create table public.multiplayer_spectators (
  room_id uuid not null references public.multiplayer_rooms(id)
    on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default timezone('utc', now()),

  primary key (room_id, user_id)
);

-- -----------------------------------------------------------------------------
-- Server-selected questions and immutable answers
-- Correct answers and solutions remain in code and are never exposed here.
-- -----------------------------------------------------------------------------

create table public.multiplayer_match_questions (
  room_id uuid not null references public.multiplayer_rooms(id)
    on delete cascade,
  question_number integer not null check (question_number between 1 and 30),
  question_id integer not null,
  difficulty integer not null check (difficulty between 1 and 5),
  started_at timestamptz,
  ends_at timestamptz,
  intermission_ends_at timestamptz,

  primary key (room_id, question_number),
  unique (room_id, question_id),
  unique (room_id, question_number, question_id),
  constraint multiplayer_match_questions_time_order check (
    (started_at is null and ends_at is null)
    or (started_at is not null and ends_at >= started_at)
  )
);

create table public.multiplayer_submissions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.multiplayer_rooms(id)
    on delete cascade,
  question_number integer not null,
  question_id integer not null,
  player_id uuid not null,
  selected_answer text not null check (selected_answer in ('A', 'B', 'C', 'D', 'E')),
  correct boolean not null,
  answer_time_ms integer not null check (answer_time_ms >= 0),
  points_earned integer not null check (points_earned between 0 and 1500),
  submitted_at timestamptz not null default timezone('utc', now()),

  constraint multiplayer_submissions_question_fkey
    foreign key (room_id, question_number, question_id)
    references public.multiplayer_match_questions (
      room_id,
      question_number,
      question_id
    )
    on delete cascade,
  constraint multiplayer_submissions_player_fkey
    foreign key (room_id, player_id)
    references public.multiplayer_players (room_id, id)
    on delete cascade,
  constraint multiplayer_submissions_score_shape check (
    (correct = true and points_earned between 1000 and 1500)
    or (correct = false and points_earned = 0)
  ),
  unique (room_id, question_number, player_id)
);

create index multiplayer_submissions_round_leaderboard_idx
  on public.multiplayer_submissions (
    room_id,
    question_number,
    points_earned desc,
    submitted_at
  );

-- -----------------------------------------------------------------------------
-- Finalized results and rating audit data
-- -----------------------------------------------------------------------------

create table public.multiplayer_match_results (
  room_id uuid not null references public.multiplayer_rooms(id)
    on delete cascade,
  player_id uuid not null,
  user_id uuid references auth.users(id) on delete cascade,
  placement integer not null check (placement >= 1),
  final_score integer not null check (final_score >= 0),
  ranked boolean not null,
  previous_rp integer check (previous_rp is null or previous_rp >= 0),
  rp_change integer,
  new_rp integer check (new_rp is null or new_rp >= 0),
  opponent_adjustment numeric,
  performance_index numeric check (
    performance_index is null
    or performance_index between 0 and 1
  ),
  completion_factor numeric not null check (
    completion_factor between 0 and 1
  ),
  finalized_at timestamptz not null default timezone('utc', now()),

  primary key (room_id, player_id),
  constraint multiplayer_match_results_player_fkey
    foreign key (room_id, player_id)
    references public.multiplayer_players (room_id, id)
    on delete cascade,
  constraint multiplayer_match_results_user_fkey
    foreign key (room_id, player_id, user_id)
    references public.multiplayer_players (room_id, id, user_id)
    on delete cascade,
  constraint multiplayer_match_results_rating_shape check (
    (user_id is null and previous_rp is null and rp_change is null
      and new_rp is null and opponent_adjustment is null
      and performance_index is null)
    or
    (user_id is not null and ranked = false
      and previous_rp is null and rp_change is null
      and new_rp is null and opponent_adjustment is null
      and performance_index is null)
    or
    (user_id is not null and ranked = true
      and previous_rp is not null and rp_change is not null
      and new_rp is not null and opponent_adjustment is not null
      and performance_index is not null)
  )
);

create index multiplayer_match_results_user_idx
  on public.multiplayer_match_results (user_id, finalized_at desc)
  where user_id is not null;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- All writes remain server-managed. M3+ will add narrowly scoped read functions
-- for private/guest room state and sanitized realtime payloads.
-- -----------------------------------------------------------------------------

alter table public.multiplayer_profiles enable row level security;
alter table public.multiplayer_rooms enable row level security;
alter table public.multiplayer_players enable row level security;
alter table public.multiplayer_spectators enable row level security;
alter table public.multiplayer_match_questions enable row level security;
alter table public.multiplayer_submissions enable row level security;
alter table public.multiplayer_match_results enable row level security;

create policy "Users can read their own multiplayer profile"
on public.multiplayer_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Anyone can browse public multiplayer rooms"
on public.multiplayer_rooms
for select
to anon, authenticated
using (visibility = 'public');

create policy "Users can read private rooms they joined"
on public.multiplayer_rooms
for select
to authenticated
using (
  visibility = 'private'
  and exists (
    select 1
    from public.multiplayer_players
    where multiplayer_players.room_id = multiplayer_rooms.id
      and multiplayer_players.user_id = (select auth.uid())
  )
);

create policy "Users can read their own multiplayer player rows"
on public.multiplayer_players
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read their own multiplayer results"
on public.multiplayer_match_results
for select
to authenticated
using ((select auth.uid()) = user_id);

grant select on public.multiplayer_profiles to authenticated;
grant select on public.multiplayer_rooms to anon, authenticated;
grant select on public.multiplayer_players to authenticated;
grant select on public.multiplayer_match_results to authenticated;

-- Realtime is limited to safe room-presence tables. Submissions and final
-- rating audit rows are deliberately excluded.
alter publication supabase_realtime add table public.multiplayer_rooms;
alter publication supabase_realtime add table public.multiplayer_players;
alter publication supabase_realtime add table public.multiplayer_spectators;
alter publication supabase_realtime add table public.multiplayer_match_questions;

commit;
