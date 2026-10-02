-- Additive replacement for the application's multi-request history save.
-- Existing history, progress, levels and table permissions are unchanged.
begin;

create or replace function public.save_trainer_session_v1(
  p_expected_user_id uuid, p_session_id uuid, p_division text,
  p_started_at timestamptz, p_ended_at timestamptz,
  p_starting_level integer, p_starting_progress integer,
  p_ending_level integer, p_ending_progress integer, p_results jsonb
)
returns jsonb language plpgsql volatile security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_existing public.trainer_sessions%rowtype;
  v_result jsonb;
  v_expected jsonb;
  v_actual jsonb;
  v_inserted uuid;
  v_recent jsonb;
begin
  if v_user is null or p_expected_user_id is distinct from v_user then
    raise exception 'Trainer account changed.' using errcode = '42501';
  end if;
  if p_session_id is null or p_division is null or p_division not in ('Mu','Alpha','Theta')
    or p_started_at is null or p_ended_at is null or not isfinite(p_started_at) or not isfinite(p_ended_at)
    or p_ended_at < p_started_at
    or p_starting_level is null or p_starting_level < 1 or p_ending_level is null or p_ending_level < 1
    or p_starting_progress is null or p_starting_progress not between 0 and 29
    or p_ending_progress is null or p_ending_progress not between 0 and 29
    or jsonb_typeof(p_results) is distinct from 'array' then
    raise exception 'Invalid Trainer session.' using errcode = '22023';
  end if;
  if jsonb_array_length(p_results) > 2000 or octet_length(p_results::text) > 1048576 then
    raise exception 'Trainer session is too large.' using errcode = '22023';
  end if;
  for v_result in select value from jsonb_array_elements(p_results) loop
    if jsonb_typeof(v_result) is distinct from 'object'
      or jsonb_typeof(v_result->'question_id') is distinct from 'number'
      or jsonb_typeof(v_result->'question_number') is distinct from 'number'
      or (v_result->>'question_id')::numeric not between 1 and 2147483647
      or trunc((v_result->>'question_id')::numeric) <> (v_result->>'question_id')::numeric
      or (v_result->>'question_number')::numeric not between 1 and 2147483647
      or trunc((v_result->>'question_number')::numeric) <> (v_result->>'question_number')::numeric
      or coalesce(v_result->>'correct_answer','') not in ('A','B','C','D','E')
      or not (v_result ? 'selected_answer')
      or (v_result->>'selected_answer' is not null and v_result->>'selected_answer' not in ('A','B','C','D','E'))
      or (v_result->>'result') is distinct from (case
        when v_result->>'selected_answer' is null then 'give-up'
        when v_result->>'selected_answer' = v_result->>'correct_answer' then 'correct'
        else 'incorrect' end) then
      raise exception 'Invalid Trainer result.' using errcode = '22023';
    end if;
  end loop;

  -- Only competing retries for this account/session share a lock. Never queue a
  -- large wave of duplicate requests behind a blocked session; let callers retry.
  if not pg_try_advisory_xact_lock(hashtextextended('trainer-save:' || v_user || ':' || p_session_id, 0)) then
    return jsonb_build_object('status','busy');
  end if;

  select * into v_existing from public.trainer_sessions where id = p_session_id and user_id = v_user;
  if found then
    if v_existing.division <> p_division or v_existing.started_at <> p_started_at or v_existing.ended_at <> p_ended_at
      or v_existing.starting_level <> p_starting_level or v_existing.starting_progress <> p_starting_progress
      or v_existing.ending_level <> p_ending_level or v_existing.ending_progress <> p_ending_progress then
      return jsonb_build_object('status','conflict');
    end if;
    -- Compare every persisted result, including duplicates. Do not repair or
    -- overwrite legacy partial sessions automatically. Result order was not a
    -- persisted field in the original schema, so comparison uses a multiset.
    select coalesce(jsonb_agg(row_value order by row_value), '[]') into v_expected from (
      select jsonb_build_array((r->>'question_id')::integer, (r->>'question_number')::integer,
        r->>'selected_answer', r->>'correct_answer', r->>'result') as row_value
      from jsonb_array_elements(p_results) r
    ) expected;
    select coalesce(jsonb_agg(row_value order by row_value), '[]') into v_actual from (
      select jsonb_build_array(r.question_id, r.question_number, r.selected_answer, r.correct_answer, r.result) as row_value
      from public.trainer_results r where r.session_id = p_session_id and r.user_id = v_user
    ) actual;
    if v_expected <> v_actual then return jsonb_build_object('status','conflict'); end if;
  else
    insert into public.trainer_sessions(id,user_id,division,started_at,ended_at,starting_level,starting_progress,ending_level,ending_progress)
    values(p_session_id,v_user,p_division,p_started_at,p_ended_at,p_starting_level,p_starting_progress,p_ending_level,p_ending_progress)
    on conflict (id) do nothing returning id into v_inserted;
    if v_inserted is null then return jsonb_build_object('status','conflict'); end if;
    insert into public.trainer_results(session_id,user_id,question_id,question_number,selected_answer,correct_answer,result)
    select p_session_id,v_user,(r->>'question_id')::integer,(r->>'question_number')::integer,
      r->>'selected_answer',r->>'correct_answer',r->>'result'
    from jsonb_array_elements(p_results) with ordinality as results(r,position) order by position;
  end if;

  -- At most the current session and four predecessors, not the user's lifetime
  -- answers. Newer sessions from another tab do not masquerade as this session.
  with recent as materialized (
    select s.id,s.ended_at from public.trainer_sessions s where s.user_id = v_user
      and (s.ended_at,s.id) <= (p_ended_at,p_session_id)
    order by s.ended_at desc,s.id desc limit 5
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',s.id,'endedAt',extract(epoch from s.ended_at)*1000,
    'questionsAnswered',r.answered,'accuracy',coalesce(round(100.0*r.correct/nullif(r.answered,0)),0)
  ) order by s.ended_at,s.id),'[]') into v_recent
  from recent s cross join lateral (
    select count(*) as answered,count(*) filter(where result='correct') as correct
    from public.trainer_results where session_id=s.id and user_id=v_user
  ) r;
  return jsonb_build_object('status','saved','sessionId',p_session_id,'userId',v_user,'recentSessions',v_recent);
end;
$$;

revoke all on function public.save_trainer_session_v1(uuid,uuid,text,timestamptz,timestamptz,integer,integer,integer,integer,jsonb) from public,anon;
grant execute on function public.save_trainer_session_v1(uuid,uuid,text,timestamptz,timestamptz,integer,integer,integer,integer,jsonb) to authenticated;
notify pgrst, 'reload schema';
commit;
