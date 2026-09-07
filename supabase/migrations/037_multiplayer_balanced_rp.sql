begin;

create or replace function public.finalize_multiplayer_match(p_room_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  r public.multiplayer_rooms%rowtype;
  ranked_match boolean;
begin
  select * into r from public.multiplayer_rooms where id=p_room_id for update;
  if not found or r.status <> 'completed' or r.results_finalized_at is not null then return; end if;
  -- Never replay legacy rating awards: existing rows require operator review if
  -- their old nontransactional finalizer did not record completion.
  if exists(select 1 from public.multiplayer_match_results where room_id=p_room_id) then
    raise exception 'Legacy incomplete results require review for room %', p_room_id;
  end if;
  -- Shared account locks use deterministic ordering across simultaneous matches.
  insert into public.multiplayer_profiles(user_id)
  select user_id from public.multiplayer_players where room_id=p_room_id and left_at is null and user_id is not null
  order by user_id on conflict do nothing;
  perform 1 from public.multiplayer_profiles where user_id in
    (select user_id from public.multiplayer_players where room_id=p_room_id and left_at is null)
  order by user_id for update;
  ranked_match := r.mode='ranked' and (select count(*) from public.multiplayer_players where room_id=p_room_id and left_at is null and user_id is not null)>1;

  with difficulty as (
    select greatest(1,coalesce(sum(difficulty),0))::numeric total,
      least(1,count(started_at)::numeric / r.question_count) completion
    from public.multiplayer_match_questions where room_id=p_room_id
  ), metrics as (
    select p.id, p.user_id, p.score, p.joined_at, profile.rp,
      coalesce(sum(s.answer_time_ms),0) total_time,
      least(1,greatest(0,0.7 * coalesce(sum(case when s.correct then q.difficulty else 0 end),0) /
        (select total from difficulty) + 0.3*p.score::numeric/(r.question_count*1500))) performance
    from public.multiplayer_players p
    left join public.multiplayer_profiles profile on profile.user_id=p.user_id
    left join public.multiplayer_submissions s on s.room_id=p.room_id and s.player_id=p.id
    left join public.multiplayer_match_questions q on q.room_id=s.room_id and q.question_number=s.question_number
    where p.room_id=p_room_id and p.left_at is null
    group by p.id,p.user_id,p.score,p.joined_at,profile.rp
  ), placements as (
    select *,row_number() over(order by score desc,total_time,joined_at,id)::integer place from metrics
  ), adjustments as (
    -- Guests remain on the scoreboard, but never influence account ratings.
    -- Exact performance ties (and any zero-score pair) are neutral for RP.
    select m.*, coalesce((select avg(case
      when (m.score=0 and o.score=0) or (m.score=o.score and m.total_time=o.total_time) then 0
      when m.place<o.place then 40*(1-1/(1+power(10::numeric,(o.rp-m.rp)/400)))
      else -24/(1+power(10::numeric,(o.rp-m.rp)/400)) end)
      from placements o where o.id<>m.id and o.user_id is not null),0) adjustment from placements m
  ), ratings as (
    -- At performance 0.5, equal-rated opponents yield +20 / -12.
    -- Performance only shifts the adjustment by up to 10% in either direction.
    select *,floor(greatest(-26,least(40,adjustment*
      (case when adjustment>=0 then 0.9+0.2*performance else 1.1-0.2*performance end)
      *(select completion from difficulty)))+0.5)::integer delta from adjustments
  )
  insert into public.multiplayer_match_results(room_id,player_id,user_id,placement,final_score,ranked,
    previous_rp,rp_change,new_rp,opponent_adjustment,performance_index,completion_factor)
  select p_room_id,id,user_id,place,score,ranked_match,
    case when ranked_match and user_id is not null then rp end,
    case when ranked_match and user_id is not null then greatest(0,rp+delta)-rp end,
    case when ranked_match and user_id is not null then greatest(0,rp+delta) end,
    case when ranked_match and user_id is not null then adjustment end,
    case when ranked_match and user_id is not null then performance end,
    (select completion from difficulty) from ratings;

  update public.multiplayer_profiles p set rp=result.new_rp,
    ranked_matches_played=p.ranked_matches_played+1,
    ranked_wins=p.ranked_wins+case when result.placement=1 and result.final_score>0
      and not exists (
        select 1 from public.multiplayer_players other
        where other.room_id=p_room_id and other.left_at is null and other.id<>result.player_id
          and other.score=result.final_score
          and coalesce((select sum(s.answer_time_ms) from public.multiplayer_submissions s
            where s.room_id=p_room_id and s.player_id=other.id),0)
            = coalesce((select sum(s.answer_time_ms) from public.multiplayer_submissions s
            where s.room_id=p_room_id and s.player_id=result.player_id),0)
      ) then 1 else 0 end
  from public.multiplayer_match_results result
  where result.room_id=p_room_id and result.user_id=p.user_id and result.new_rp is not null;
  update public.multiplayer_rooms set results_finalized_at=clock_timestamp(), state_version=state_version+1 where id=p_room_id;
end;
$$;
revoke all on function public.finalize_multiplayer_match(uuid) from public,anon,authenticated;
grant execute on function public.finalize_multiplayer_match(uuid) to service_role;
commit;
