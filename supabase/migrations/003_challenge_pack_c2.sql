-- MAO Practice: Challenge Pack C2 database architecture
-- Challenge question content remains in code; only question IDs are persisted.

begin;

-- -----------------------------------------------------------------------------
-- Daily challenges
-- One code-defined challenge question is assigned to each calendar date.
-- -----------------------------------------------------------------------------

create table public.daily_challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_date date not null unique,
  question_id text not null,
  created_at timestamptz not null default timezone('utc', now()),

  constraint daily_challenges_date_question_unique
    unique (challenge_date, question_id)
);

comment on table public.daily_challenges is
  'Maps each challenge date to a question ID whose content is stored in code.';

-- -----------------------------------------------------------------------------
-- Challenge attempts
-- Records each user's single allowed answer for a daily challenge.
-- -----------------------------------------------------------------------------

create table public.challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_date date not null,
  question_id text not null,
  selected_answer text not null,
  correct boolean not null,
  submitted_at timestamptz not null default timezone('utc', now()),

  constraint challenge_attempts_user_date_unique
    unique (user_id, challenge_date),
  constraint challenge_attempts_daily_challenge_fkey
    foreign key (challenge_date, question_id)
    references public.daily_challenges (challenge_date, question_id)
);

comment on table public.challenge_attempts is
  'Stores one immutable daily challenge attempt per user and date.';

create index challenge_attempts_user_id_idx
  on public.challenge_attempts (user_id);

create index challenge_attempts_challenge_date_idx
  on public.challenge_attempts (challenge_date);

-- -----------------------------------------------------------------------------
-- Challenge user statistics
-- Stores server-managed aggregate challenge statistics for each user.
-- -----------------------------------------------------------------------------

create table public.challenge_user_statistics (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  total_completed integer not null default 0 check (total_completed >= 0),
  total_correct integer not null default 0 check (total_correct >= 0),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint challenge_statistics_correct_not_above_completed
    check (total_correct <= total_completed),
  constraint challenge_statistics_longest_not_below_current
    check (longest_streak >= current_streak)
);

comment on table public.challenge_user_statistics is
  'Stores server-managed challenge streak and completion totals for each user.';

create index challenge_user_statistics_current_streak_idx
  on public.challenge_user_statistics (current_streak desc);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.daily_challenges enable row level security;
alter table public.challenge_attempts enable row level security;
alter table public.challenge_user_statistics enable row level security;

-- Daily challenges are readable by authenticated users only.
create policy "Authenticated users can read daily challenges"
on public.daily_challenges
for select
to authenticated
using (true);

-- Attempts are readable only by their owner and otherwise server-managed.
create policy "Users can read their own challenge attempts"
on public.challenge_attempts
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Statistics are readable only by their owner and otherwise server-managed.
create policy "Users can read their own challenge statistics"
on public.challenge_user_statistics
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Explicit grants for API roles. RLS still controls which rows are accessible.
grant select on public.daily_challenges to authenticated;
grant select on public.challenge_attempts to authenticated;
grant select on public.challenge_user_statistics to authenticated;

commit;
