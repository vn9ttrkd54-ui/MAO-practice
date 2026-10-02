-- One read-only, owner-scoped snapshot. No user records or table policies change.
begin;
create or replace function public.get_question_state(p_question_id integer)
returns jsonb language plpgsql stable security invoker set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_progress jsonb;
begin
  if v_user is null then raise exception 'Authentication required.' using errcode='42501'; end if;
  if p_question_id is null or p_question_id <= 0 then
    raise exception 'Invalid question.' using errcode='22023';
  end if;
  select jsonb_build_object(
    'attempts',p.attempts,'correct',p.correct,'lastResult',p.last_result,
    'lastCorrectAt',extract(epoch from p.last_correct_at)*1000,
    'timing',jsonb_build_object('count',p.timing_count,'totalSeconds',p.timing_total_seconds,'bestSeconds',p.timing_best_seconds)
  ) into v_progress from public.question_progress p where p.user_id=v_user and p.question_id=p_question_id;
  return jsonb_build_object('userId',v_user,'questionId',p_question_id,
    'bookmarked',exists(select 1 from public.bookmarks b where b.user_id=v_user and b.question_id=p_question_id),
    'progress',coalesce(v_progress,jsonb_build_object('attempts',0,'correct',0,'lastResult',null,'lastCorrectAt',null,
      'timing',jsonb_build_object('count',0,'totalSeconds',0,'bestSeconds',null))));
end;
$$;
revoke all on function public.get_question_state(integer) from public,anon;
grant execute on function public.get_question_state(integer) to authenticated;
notify pgrst, 'reload schema';
commit;
