-- Keep feedback creation behind the server and enforce its quota in the database.
-- A trigger preserves the existing application's INSERT contract during rollout.
begin;

revoke insert, update, delete on public.feedback_requests from public, anon, authenticated;
grant select, insert, update, delete on public.feedback_requests to service_role;

create function public.guard_feedback_submission()
returns trigger
language plpgsql
volatile
set search_path = ''
as $$
declare
  submission_time timestamptz;
begin
  if new.user_id is null then
    raise exception 'Feedback user is required' using errcode = '23502';
  end if;

  -- The first key is a fixed namespace for feedback; hash collisions only make
  -- unrelated users wait, never allow either user's limit to be bypassed.
  -- This transaction-scoped lock covers the count and the eventual INSERT.
  perform pg_catalog.pg_advisory_xact_lock(1936024436, pg_catalog.hashtext(new.user_id::text));
  submission_time := pg_catalog.clock_timestamp();
  new.created_at := submission_time;

  -- VOLATILE gives this statement a fresh snapshot after the lock under the
  -- application's READ COMMITTED transactions, including another writer's commit.
  if (
    select count(*) from public.feedback_requests
    where user_id = new.user_id
      and created_at >= submission_time - interval '1 hour'
  ) >= 10 then
    raise exception 'feedback_rate_limited' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_feedback_submission() from public, anon, authenticated;
grant execute on function public.guard_feedback_submission() to service_role;

create trigger feedback_requests_guard_submission
before insert on public.feedback_requests
for each row execute function public.guard_feedback_submission();

commit;
