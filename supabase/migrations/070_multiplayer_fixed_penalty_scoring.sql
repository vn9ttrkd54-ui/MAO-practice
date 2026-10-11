-- 750 base + up to 750 speed bonus and fixed wrong penalties for new rooms.
-- Preserve all version-1/2 matches and the existing -300 wrong penalty.
-- One atomic submission, the same receipt clock, no extra reads or browser grants.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

alter table public.multiplayer_rooms
  drop constraint multiplayer_rooms_scoring_version_check,
  add constraint multiplayer_rooms_scoring_version_check check (scoring_version in (1,2,3)),
  alter column scoring_version set default 3;

alter table public.multiplayer_submissions
  drop constraint multiplayer_submissions_scoring_version_check,
  add constraint multiplayer_submissions_scoring_version_check check (scoring_version in (1,2,3)),
  drop constraint multiplayer_submissions_score_shape,
  add constraint multiplayer_submissions_score_shape check (
    (selected_answer is not null and correct and (
      (scoring_version in (1,2) and points_earned between 1000 and 1500)
      or (scoring_version=3 and points_earned between 750 and 1500)
    ))
    or (selected_answer is not null and not correct and (
      (scoring_version=1 and points_earned=0)
      or (scoring_version=2 and points_earned=-300)
      or (scoring_version=3 and points_earned=-300)
    ))
    or (selected_answer is null and scoring_version in (2,3) and not correct and points_earned=0)
  );

create or replace function public.accept_multiplayer_answer(
  p_room_id uuid, p_player_id uuid, p_question_id integer,
  p_selected_answer text, p_correct boolean
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  room_row public.multiplayer_rooms%rowtype;
  question_row public.multiplayer_match_questions%rowtype;
  existing public.multiplayer_submissions%rowtype;
  received_at timestamptz := clock_timestamp();
  elapsed_ms integer;
  earlier_correct integer;
  correct_points integer;
  earned integer := 0;
begin
  -- Capture arrival before locking: database lock waits must not reduce the bonus.
  select * into room_row from public.multiplayer_rooms where id=p_room_id for update;
  if not found then raise exception using errcode='P0001', message='Room not found.'; end if;
  if not exists(select 1 from public.multiplayer_players
    where room_id=p_room_id and id=p_player_id and left_at is null) then
    raise exception using errcode='P0001', message='Player is not in this room.';
  end if;
  if p_selected_answer not in ('A','B','C','D','E') or p_correct is null
    or (p_selected_answer is null and (p_correct or room_row.scoring_version not in (2,3))) then
    raise exception using errcode='P0001', message='Choose a valid answer.';
  end if;

  select * into existing from public.multiplayer_submissions
    where room_id=p_room_id and player_id=p_player_id and question_id=p_question_id;
  if not found then
    perform public.advance_multiplayer_round_state(p_room_id);
    select * into room_row from public.multiplayer_rooms where id=p_room_id;
    select * into question_row from public.multiplayer_match_questions
      where room_id=p_room_id and question_number=room_row.current_question_number for update;
    if room_row.status<>'in-progress' or not found
      or question_row.question_id<>p_question_id or question_row.started_at is null
      or question_row.round_finished_at is not null or question_row.ends_at is null
      or question_row.intermission_ends_at is not null then
      raise exception using errcode='P0001', message='This question is closed.';
    end if;
    if received_at<question_row.started_at then
      raise exception using errcode='P0001', message='This question has not started yet.';
    end if;
    if received_at>coalesce(question_row.hard_ends_at,question_row.ends_at) then
      raise exception using errcode='P0001', message='Time has expired for this question.';
    end if;
    elapsed_ms := greatest(0,floor(extract(epoch from (received_at-question_row.started_at))*1000)::integer);
    if room_row.scoring_version=3 then
      -- Grace after the visible deadline earns no speed bonus.
      correct_points := 750+round(750::numeric*
        greatest(0,room_row.seconds_per_question*1000-elapsed_ms)/
        (room_row.seconds_per_question*1000))::integer;
      earned := case when p_selected_answer is null then 0
        when p_correct then correct_points else -300 end;
    elsif room_row.scoring_version=2 then
      if p_selected_answer is null then
        earned := 0;
      elsif p_correct then
        earned := 1000+round(500::numeric*
          (1-least(elapsed_ms,room_row.seconds_per_question*1000)::numeric/
          (room_row.seconds_per_question*1000)))::integer;
      else
        earned := -300;
      end if;
    elsif p_correct then
      select count(*)::integer into earlier_correct from public.multiplayer_submissions
        where room_id=p_room_id and question_number=question_row.question_number and correct;
      earned := greatest(1000,1030+round(470::numeric*
        (1-least(elapsed_ms,room_row.seconds_per_question*1000)::numeric/
        (room_row.seconds_per_question*1000)))::integer-least(29,earlier_correct));
    end if;
    insert into public.multiplayer_submissions
      (room_id,question_number,question_id,player_id,selected_answer,correct,
       answer_time_ms,points_earned,submitted_at,scoring_version)
    values(p_room_id,question_row.question_number,p_question_id,p_player_id,
      p_selected_answer,p_correct,elapsed_ms,earned,received_at,room_row.scoring_version)
    returning * into existing;
    update public.multiplayer_players set score=score+earned,has_submitted_current_question=true
      where room_id=p_room_id and id=p_player_id;
    perform public.advance_multiplayer_round_state(p_room_id);
  end if;
  return jsonb_build_object('accepted',true,'questionId',existing.question_id,
    'questionNumber',existing.question_number,'selectedAnswer',existing.selected_answer);
end;
$$;

-- The maximum is still 1,500, so finalization and RP normalization are unchanged.
revoke all on function public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean) from public,anon,authenticated;
revoke all on function public.finalize_multiplayer_match(uuid) from public,anon,authenticated;
grant execute on function public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean) to service_role;
grant execute on function public.finalize_multiplayer_match(uuid) to service_role;

-- Upgrade only empty, unstarted public queues; never change an occupied lobby,
-- private room, running match or any room containing saved game records.
do $$
declare candidate record;
begin
  for candidate in select id from public.multiplayer_rooms
    where visibility='public' and scoring_version in (1,2) and status='waiting'
    order by id for update
  loop
    update public.multiplayer_rooms r set scoring_version=3,
      settings_version=settings_version+1,state_version=state_version+1
    where r.id=candidate.id and r.visibility='public' and r.scoring_version in (1,2)
      and r.status='waiting' and r.started_at is null and r.current_question_number=0
      and not exists(select 1 from public.multiplayer_match_questions where room_id=r.id)
      and not exists(select 1 from public.multiplayer_submissions where room_id=r.id)
      and not exists(select 1 from public.multiplayer_match_results where room_id=r.id)
      and not exists(select 1 from public.multiplayer_match_history where room_id=r.id)
      and not exists(select 1 from public.multiplayer_players where room_id=r.id);
  end loop;
end;
$$;
notify pgrst, 'reload schema';
commit;
