-- Stage 3: correct 1000 + up to 500 speed, wrong -300, blank/Give up 0.
-- Existing rooms and submissions retain version 1; only newly created rooms use 2.
-- No user data is deleted, no stored score is recalculated, no browser grants expand.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

alter table public.multiplayer_rooms
  add column scoring_version smallint not null default 1 check (scoring_version in (1,2));
alter table public.multiplayer_rooms alter column scoring_version set default 2;

alter table public.multiplayer_players
  drop constraint multiplayer_players_score_check,
  add constraint multiplayer_players_score_check check (score >= -9000);
alter table public.multiplayer_match_results
  drop constraint multiplayer_match_results_final_score_check,
  add constraint multiplayer_match_results_final_score_check check (final_score >= -9000);
alter table public.multiplayer_match_history
  drop constraint multiplayer_match_history_final_score_check,
  add constraint multiplayer_match_history_final_score_check check (final_score >= -300 * question_count);

alter table public.multiplayer_submissions
  add column scoring_version smallint not null default 1 check (scoring_version in (1,2)),
  alter column selected_answer drop not null,
  drop constraint multiplayer_submissions_points_earned_check,
  drop constraint multiplayer_submissions_score_shape,
  add constraint multiplayer_submissions_points_earned_check check (points_earned between -300 and 1500),
  add constraint multiplayer_submissions_score_shape check (
    (selected_answer is not null and correct and points_earned between 1000 and 1500)
    or (selected_answer is not null and not correct and
      points_earned = case when scoring_version=2 then -300 else 0 end)
    or (selected_answer is null and scoring_version=2 and not correct and points_earned=0)
  );

create or replace function public.accept_multiplayer_answer(
  p_room_id uuid, p_player_id uuid, p_question_id integer,
  p_selected_answer text, p_correct boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  room_row public.multiplayer_rooms%rowtype;
  question_row public.multiplayer_match_questions%rowtype;
  existing public.multiplayer_submissions%rowtype;
  received_at timestamptz := clock_timestamp();
  elapsed_ms integer;
  earlier_correct integer;
  earned integer := 0;
begin
  -- Keep the receipt clock above the room lock: lock contention is not solve time.
  select * into room_row from public.multiplayer_rooms where id = p_room_id for update;
  if not found then raise exception using errcode = 'P0001', message = 'Room not found.'; end if;
  if not exists (select 1 from public.multiplayer_players
    where room_id = p_room_id and id = p_player_id and left_at is null) then
    raise exception using errcode = 'P0001', message = 'Player is not in this room.';
  end if;
  if p_selected_answer not in ('A','B','C','D','E') or p_correct is null
    or (p_selected_answer is null and (p_correct or room_row.scoring_version <> 2)) then
    raise exception using errcode = 'P0001', message = 'Choose a valid answer.';
  end if;

  -- Retrying can recover the original receipt, never replace an accepted answer.
  select * into existing from public.multiplayer_submissions
  where room_id = p_room_id and player_id = p_player_id and question_id = p_question_id;
  if not found then
    perform public.advance_multiplayer_round_state(p_room_id);
    select * into room_row from public.multiplayer_rooms where id=p_room_id;
    select * into question_row from public.multiplayer_match_questions
    where room_id = p_room_id and question_number = room_row.current_question_number for update;
    if room_row.status <> 'in-progress' or not found
      or question_row.question_id <> p_question_id or question_row.started_at is null
      or question_row.round_finished_at is not null or question_row.ends_at is null or question_row.intermission_ends_at is not null then
      raise exception using errcode = 'P0001', message = 'This question is closed.';
    end if;
    if received_at < question_row.started_at then
      raise exception using errcode = 'P0001', message = 'This question has not started yet.';
    end if;

    -- Grace is shared by every player. A late/missing/repeated delivery ACK must
    -- not extend the cutoff or reset speed credit. The visible timer is unchanged.
    if received_at > coalesce(question_row.hard_ends_at, question_row.ends_at) then
      raise exception using errcode = 'P0001', message = 'Time has expired for this question.';
    end if;
    elapsed_ms := greatest(0, floor(extract(epoch from (received_at - question_row.started_at)) * 1000)::integer);
    if room_row.scoring_version = 2 then
      if p_selected_answer is null then
        earned := 0;
      elsif p_correct then
        earned := 1000 + round(500::numeric *
          (1 - least(elapsed_ms, room_row.seconds_per_question * 1000)::numeric /
          (room_row.seconds_per_question * 1000)))::integer;
      else
        earned := -300;
      end if;
    elsif p_correct then
      select count(*)::integer into earlier_correct from public.multiplayer_submissions
      where room_id = p_room_id and question_number = question_row.question_number and correct;
      earned := greatest(1000, 1030 + round(470::numeric *
        (1 - least(elapsed_ms, room_row.seconds_per_question * 1000)::numeric /
        (room_row.seconds_per_question * 1000)))::integer - least(29, earlier_correct));
    end if;
    insert into public.multiplayer_submissions
      (room_id, question_number, question_id, player_id, selected_answer, correct,
       answer_time_ms, points_earned, submitted_at, scoring_version)
    values (p_room_id, question_row.question_number, p_question_id, p_player_id,
      p_selected_answer, p_correct, elapsed_ms, earned, received_at, room_row.scoring_version)
    returning * into existing;
    update public.multiplayer_players set score = score + earned, has_submitted_current_question = true
    where room_id = p_room_id and id = p_player_id;
    perform public.advance_multiplayer_round_state(p_room_id);
  end if;
  -- The receipt exposes neither correctness nor score; live totals keep their
  -- existing snapshot behavior. Expanded per-question feedback is a later stage.
  return jsonb_build_object('accepted', true, 'questionId', existing.question_id,
    'questionNumber', existing.question_number, 'selectedAnswer', existing.selected_answer);
end;
$$;

create or replace function public.read_multiplayer_snapshot(p_room_id uuid,p_player_id uuid,p_known_version bigint default -1)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case when r.state_version=p_known_version then
    jsonb_build_object('unchanged',true,'stateVersion',r.state_version,'status',r.status)
  else jsonb_build_object('stateVersion',r.state_version,'status',r.status,
    'roomId',r.id,'currentPlayerId',p_player_id,'totalQuestions',r.question_count,
    'scoringVersion',r.scoring_version,'questionDurationSeconds',r.seconds_per_question,'question',to_jsonb(q),
    'upcoming',case when q.round_finished_at is not null or q.intermission_ends_at is not null then
      (select to_jsonb(n) from public.multiplayer_match_questions n where n.room_id=r.id and n.question_number=q.question_number+1) end,
    'players',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'user_id',p.user_id,
      'guest_nickname',p.guest_nickname,'is_host',p.is_host,'connected',p.connected,'score',p.score,
      'placement',p.placement,'has_submitted_current_question',exists(select 1 from public.multiplayer_submissions s
        where s.room_id=r.id and s.player_id=p.id and s.question_number=q.question_number),
      'display_name',coalesce(profile.username,p.guest_nickname,'Player'),'rp',rating.rp) order by p.joined_at)
      from public.multiplayer_players p left join public.profiles profile on profile.id=p.user_id
      left join public.multiplayer_profiles rating on rating.user_id=p.user_id
      where p.room_id=r.id and p.left_at is null),'[]'::jsonb)) end
  from public.multiplayer_rooms r left join public.multiplayer_match_questions q
    on q.room_id=r.id and q.question_number=r.current_question_number
  where r.id=p_room_id and exists(select 1 from public.multiplayer_players p
    where p.room_id=r.id and p.id=p_player_id and p.left_at is null);
$$;

-- For new rooms only, equal totals use correct-answer solve time. Wrong answers,
-- Give up and leaving blank do not introduce an extra time-based penalty.
-- Rating bounds and awards are otherwise unchanged.
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
      coalesce(sum(case when r.scoring_version=1 or s.correct then s.answer_time_ms else 0 end),0) total_time,
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
          and coalesce((select sum(case when r.scoring_version=1 or s.correct then s.answer_time_ms else 0 end) from public.multiplayer_submissions s
            where s.room_id=p_room_id and s.player_id=other.id),0)
            = coalesce((select sum(case when r.scoring_version=1 or s.correct then s.answer_time_ms else 0 end) from public.multiplayer_submissions s
            where s.room_id=p_room_id and s.player_id=result.player_id),0)
      ) then 1 else 0 end
  from public.multiplayer_match_results result
  where result.room_id=p_room_id and result.user_id=p.user_id and result.new_rp is not null;
  update public.multiplayer_rooms set results_finalized_at=clock_timestamp(), state_version=state_version+1 where id=p_room_id;
end;
$$;

revoke all on function public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean) from public,anon,authenticated;
revoke all on function public.read_multiplayer_snapshot(uuid,uuid,bigint) from public,anon,authenticated;
revoke all on function public.finalize_multiplayer_match(uuid) from public,anon,authenticated;
grant execute on function public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean) to service_role;
grant execute on function public.read_multiplayer_snapshot(uuid,uuid,bigint) to service_role;
grant execute on function public.finalize_multiplayer_match(uuid) to service_role;
commit;
