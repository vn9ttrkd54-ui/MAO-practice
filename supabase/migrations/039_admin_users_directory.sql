begin;
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
   select user_id,max(finalized_at) activity from public.multiplayer_match_results group by user_id
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
revoke all on function public.get_admin_users(text,text,text,integer,uuid) from public,anon;
grant execute on function public.get_admin_users(text,text,text,integer,uuid) to authenticated;
commit;
