-- Read-only pre-deployment schema audit for Mathematics Daily.
-- Run in Supabase SQL Editor. Every row should show installed = true.

with required_tables(name) as (
  values
    ('profiles'), ('question_progress'), ('bookmarks'), ('user_levels'),
    ('trainer_sessions'), ('trainer_results'), ('daily_challenges'),
    ('challenge_attempts'), ('challenge_user_statistics'),
    ('multiplayer_profiles'), ('multiplayer_rooms'), ('multiplayer_players'),
    ('multiplayer_spectators'), ('multiplayer_match_questions'),
    ('multiplayer_submissions'), ('multiplayer_match_results'),
    ('feedback_requests')
),
required_functions(name, signature) as (
  values
    ('set_updated_at', 'public.set_updated_at()'),
    ('is_username_available', 'public.is_username_available(text)'),
    ('submit_challenge_attempt', 'public.submit_challenge_attempt(uuid,date,text,text,boolean)'),
    ('get_challenge_leaderboard', 'public.get_challenge_leaderboard()'),
    ('get_my_challenge_leaderboard_position', 'public.get_my_challenge_leaderboard_position()'),
    ('is_admin', 'public.is_admin()')
),
required_columns(table_name, column_name) as (
  values
    ('profiles', 'role'),
    ('multiplayer_spectators', 'last_seen_at')
),
realtime_tables(name) as (
  values
    ('multiplayer_rooms'), ('multiplayer_players'),
    ('multiplayer_spectators'), ('multiplayer_match_questions')
)
select 'table' as object_type, name as object_name,
  to_regclass('public.' || name) is not null as installed
from required_tables
union all
select 'function', name,
  to_regprocedure(signature) is not null
from required_functions
union all
select 'column', table_name || '.' || column_name,
  exists (
    select 1 from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = required_columns.table_name
      and c.column_name = required_columns.column_name
  )
from required_columns
union all
select 'realtime', name,
  exists (
    select 1 from pg_publication_tables p
    where p.pubname = 'supabase_realtime'
      and p.schemaname = 'public'
      and p.tablename = realtime_tables.name
  )
from realtime_tables
order by object_type, object_name;
