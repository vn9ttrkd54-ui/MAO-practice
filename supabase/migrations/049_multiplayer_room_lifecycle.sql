begin;

alter table public.multiplayer_rooms
  add column host_user_id uuid references auth.users(id) on delete set null;

-- Existing hosts may have more than one old room. Track one without discarding
-- any of their rooms; the creation function checks all legacy host memberships.
with existing_hosts as (
  select r.id, p.user_id,
    row_number() over (partition by p.user_id order by r.created_at, r.id) as position
  from public.multiplayer_rooms r
  join public.multiplayer_players p on p.room_id = r.id and p.id = r.host_player_id
  where r.visibility = 'private' and r.status in ('waiting', 'countdown', 'in-progress')
    and p.user_id is not null
)
update public.multiplayer_rooms r set host_user_id = h.user_id
from existing_hosts h where r.id = h.id and h.position = 1;

create unique index multiplayer_one_active_private_host
  on public.multiplayer_rooms(host_user_id)
  where visibility = 'private' and status in ('waiting', 'countdown', 'in-progress')
    and host_user_id is not null;

create index multiplayer_players_host_account_idx
  on public.multiplayer_players(user_id, room_id)
  where is_host and left_at is null and user_id is not null;

create or replace function public.guard_private_multiplayer_join()
returns trigger language plpgsql security definer set search_path = '' as $$
declare room_status text; room_capacity integer; room_visibility text;
begin
  -- Serialize joins with starts and other joins, including on separate app servers.
  select status, capacity, visibility into room_status, room_capacity, room_visibility
    from public.multiplayer_rooms where id = new.room_id for update;
  if room_visibility = 'private' then
    if room_status <> 'waiting' then
      raise exception 'That room is no longer accepting players.' using errcode = 'P0001';
    end if;
    if (select count(*) from public.multiplayer_players
      where room_id = new.room_id and left_at is null) >= room_capacity then
      raise exception 'That private room is full.' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;
create trigger multiplayer_guard_private_join
before insert on public.multiplayer_players
for each row execute function public.guard_private_multiplayer_join();
revoke all on function public.guard_private_multiplayer_join() from public, anon, authenticated;

create table public.multiplayer_room_creations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default clock_timestamp()
);
create index multiplayer_room_creations_account_time_idx
  on public.multiplayer_room_creations(user_id, created_at desc);
create index multiplayer_room_creations_expiry_idx
  on public.multiplayer_room_creations(created_at);
alter table public.multiplayer_room_creations enable row level security;

create table public.multiplayer_match_history (
  room_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  division text not null check (division in ('Mu', 'Alpha', 'Theta')),
  question_count integer not null check (question_count between 1 and 30),
  placement integer not null check (placement >= 1),
  final_score integer not null check (final_score >= 0),
  ranked boolean not null,
  previous_rp integer,
  new_rp integer,
  finalized_at timestamptz not null,
  primary key (room_id, user_id)
);
create index multiplayer_match_history_user_time_idx
  on public.multiplayer_match_history(user_id, finalized_at desc);
alter table public.multiplayer_match_history enable row level security;
create policy "Users can read their multiplayer history"
  on public.multiplayer_match_history for select to authenticated
  using ((select auth.uid()) = user_id);
grant select on public.multiplayer_match_history to authenticated;

insert into public.multiplayer_match_history
  (room_id, user_id, division, question_count, placement, final_score,
   ranked, previous_rp, new_rp, finalized_at)
select r.id, m.user_id, r.division, r.question_count, m.placement,
  m.final_score, m.ranked, m.previous_rp, m.new_rp, m.finalized_at
from public.multiplayer_rooms r
join public.multiplayer_match_results m on m.room_id = r.id
where m.user_id is not null and r.results_finalized_at is not null
on conflict (room_id, user_id) do nothing;

create or replace function public.archive_multiplayer_match()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.results_finalized_at is null and new.results_finalized_at is not null then
    insert into public.multiplayer_match_history
      (room_id, user_id, division, question_count, placement, final_score,
       ranked, previous_rp, new_rp, finalized_at)
    select new.id, m.user_id, new.division, new.question_count, m.placement,
      m.final_score, m.ranked, m.previous_rp, m.new_rp, m.finalized_at
    from public.multiplayer_match_results m
    where m.room_id = new.id and m.user_id is not null
    on conflict (room_id, user_id) do nothing;
  end if;
  return new;
end;
$$;
create trigger multiplayer_archive_match
after update of results_finalized_at on public.multiplayer_rooms
for each row execute function public.archive_multiplayer_match();
revoke all on function public.archive_multiplayer_match() from public, anon, authenticated;

create table public.multiplayer_result_receipts (
  room_id uuid not null references public.multiplayer_rooms(id) on delete cascade,
  player_id uuid not null,
  acknowledged_at timestamptz not null default clock_timestamp(),
  primary key (room_id, player_id),
  foreign key (room_id, player_id) references public.multiplayer_players(room_id, id)
    on delete cascade
);
alter table public.multiplayer_result_receipts enable row level security;

create or replace function public.create_private_multiplayer_room(
  p_user_id uuid, p_code text, p_mode text, p_division text,
  p_question_count integer, p_seconds_per_question integer
) returns uuid language plpgsql security definer set search_path = '' as $$
declare new_room_id uuid; new_host_id uuid;
begin
  -- The row lock serializes requests from the same account across app instances.
  perform 1 from public.profiles where id = p_user_id for update;
  if not found then
    raise exception 'Sign in to create a room.' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.multiplayer_players p
    join public.multiplayer_rooms r on r.id = p.room_id
    where p.user_id = p_user_id and p.is_host and p.left_at is null
      and r.visibility = 'private'
      and r.status in ('waiting', 'countdown', 'in-progress')
  ) then
    raise exception 'Close or finish your current room before creating another.' using errcode = 'P0001';
  end if;

  if (select count(*) from public.multiplayer_room_creations
      where user_id = p_user_id and created_at > clock_timestamp() - interval '10 minutes') >= 3 then
    raise exception 'You can create up to 3 rooms every 10 minutes. Please try again shortly.' using errcode = 'P0001';
  end if;

  insert into public.multiplayer_rooms
    (code, visibility, mode, division, question_count, seconds_per_question,
     capacity, host_user_id)
  values (p_code, 'private', p_mode, p_division, p_question_count,
    p_seconds_per_question, 30, p_user_id)
  returning id into new_room_id;

  insert into public.multiplayer_players(room_id, user_id, is_host)
  values (new_room_id, p_user_id, true) returning id into new_host_id;
  update public.multiplayer_rooms set host_player_id = new_host_id where id = new_room_id;
  insert into public.multiplayer_room_creations(user_id) values (p_user_id);
  return new_room_id;
end;
$$;
revoke all on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer)
  from public, anon, authenticated;
grant execute on function public.create_private_multiplayer_room(uuid,text,text,text,integer,integer)
  to service_role;

create or replace function public.acknowledge_multiplayer_result(p_room_id uuid, p_player_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare room_row public.multiplayer_rooms%rowtype;
begin
  select * into room_row from public.multiplayer_rooms
  where id = p_room_id for update;
  if not found or room_row.status <> 'completed' or room_row.results_finalized_at is null then
    return false;
  end if;
  if not exists (select 1 from public.multiplayer_players
    where room_id = p_room_id and id = p_player_id and left_at is null) then
    return false;
  end if;

  insert into public.multiplayer_result_receipts(room_id, player_id)
  values (p_room_id, p_player_id) on conflict do nothing;

  if not exists (
    select 1 from public.multiplayer_players p
    where p.room_id = p_room_id and p.left_at is null
      and not exists (select 1 from public.multiplayer_result_receipts a
        where a.room_id = p.room_id and a.player_id = p.id)
  ) then
    delete from public.multiplayer_rooms where id = p_room_id;
  end if;
  return true;
end;
$$;
revoke all on function public.acknowledge_multiplayer_result(uuid,uuid)
  from public, anon, authenticated;
grant execute on function public.acknowledge_multiplayer_result(uuid,uuid)
  to service_role;

create index multiplayer_private_waiting_expiry_idx
  on public.multiplayer_rooms(created_at)
  where visibility = 'private' and status in ('waiting', 'countdown');
create index multiplayer_finalized_expiry_idx
  on public.multiplayer_rooms(results_finalized_at)
  where status = 'completed' and results_finalized_at is not null;
create index multiplayer_unfinalized_expiry_idx
  on public.multiplayer_rooms(completed_at)
  where status = 'completed' and results_finalized_at is null;
create index multiplayer_running_expiry_idx
  on public.multiplayer_rooms(started_at)
  where status = 'in-progress';
create index multiplayer_cancelled_expiry_idx
  on public.multiplayer_rooms(updated_at)
  where status = 'cancelled';

create or replace function public.cleanup_multiplayer_rooms()
returns integer language plpgsql security definer set search_path = '' as $$
declare target record; removed integer := 0;
begin
  -- A fixed batch bounds lock time and the work of each scheduled run.
  for target in
    select r.id from public.multiplayer_rooms r
    where (r.visibility = 'private' and r.status in ('waiting', 'countdown')
       and r.created_at < clock_timestamp() - interval '1 hour'
       and not exists (select 1 from public.multiplayer_players p
         where p.room_id = r.id and p.left_at is null and p.connected
           and p.updated_at > clock_timestamp() - interval '10 minutes'))
      or (r.status = 'in-progress'
        and r.started_at < clock_timestamp() - interval '2 hours')
      or (r.status = 'completed' and r.results_finalized_at is not null
        and r.results_finalized_at < clock_timestamp() - interval '2 minutes')
      or (r.status = 'completed' and r.results_finalized_at is null
        and r.completed_at < clock_timestamp() - interval '2 hours')
      or (r.status = 'cancelled' and r.updated_at < clock_timestamp() - interval '1 hour')
    order by r.created_at limit 100 for update of r skip locked
  loop
    delete from public.multiplayer_rooms where id = target.id;
    removed := removed + 1;
  end loop;
  delete from public.multiplayer_room_creations
    where id in (select id from public.multiplayer_room_creations
      where created_at < clock_timestamp() - interval '1 day'
      order by created_at limit 1000);
  return removed;
end;
$$;
revoke all on function public.cleanup_multiplayer_rooms() from public, anon, authenticated;
grant execute on function public.cleanup_multiplayer_rooms() to service_role;

-- This directory must continue to show activity after live room rows are gone.
create or replace function public.get_admin_users(
 p_search text default '', p_role text default '', p_sort text default 'activity',
 p_page integer default 1, p_user_id uuid default null
) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not exists(select 1 from public.profiles where id=auth.uid() and role in ('owner','admin')) then
   raise exception 'Administrator access required' using errcode='42501';
 end if;
 with practice as (
   select user_id,sum(attempts) attempts,sum(correct) correct,max(last_attempted_at) activity
   from public.question_progress group by user_id
 ), challenges as (
   select user_id,max(submitted_at) activity,max(challenge_date) latest_day
   from public.challenge_attempts group by user_id
 ), matches as (
   select user_id,max(finalized_at) activity from public.multiplayer_match_history group by user_id
 ), players as (
   select user_id,max(joined_at) activity from public.multiplayer_players where user_id is not null group by user_id
 ), users as (
   select p.id,p.username,p.role,p.created_at,
     greatest(practice.activity,challenges.activity,matches.activity,players.activity) last_active,
     coalesce(mp.rp,0) rp,coalesce(mp.ranked_matches_played,0) ranked_matches,
     coalesce(mp.ranked_wins,0) ranked_wins,
     case when challenges.latest_day >= (timezone('utc',now()))::date-1 then coalesce(cs.current_streak,0) else 0 end current_streak,
     coalesce(cs.longest_streak,0) longest_streak,
     coalesce(practice.attempts,0) practice_attempts,coalesce(practice.correct,0) practice_correct
   from public.profiles p
   left join public.multiplayer_profiles mp on mp.user_id=p.id
   left join public.challenge_user_statistics cs on cs.user_id=p.id
   left join practice on practice.user_id=p.id left join challenges on challenges.user_id=p.id
   left join matches on matches.user_id=p.id left join players on players.user_id=p.id
   where (p_user_id is null or p.id=p_user_id)
     and (p_role='' or p.role=p_role)
     and strpos(lower(p.username),lower(left(coalesce(p_search,''),100)))>0
 ), paged as (
   select * from users order by
     case when p_sort='rp' then rp end desc nulls last,
     case when p_sort='joined' then created_at end desc nulls last,
     case when p_sort='username' then username end asc nulls last,
     case when p_sort not in ('rp','joined','username') then last_active end desc nulls last,
     username,id
   limit 50 offset ((greatest(1,least(coalesce(p_page,1),1000000))-1)::bigint*50)
 ) select jsonb_build_object('total',(select count(*) from users),'users',coalesce(jsonb_agg(to_jsonb(paged)),'[]'::jsonb)) into result from paged;
 return result;
end;
$$;

commit;
