-- Requires a Supabase PostgreSQL version supporting seconds-based Cron jobs.
begin;
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('multiplayer-round-worker','1 second','select public.tick_multiplayer_rooms()');
-- Bound only this worker's successful run-history retention on small database plans.
select cron.schedule('multiplayer-worker-history-cleanup','17 * * * *',
  $$delete from cron.job_run_details where jobid in
    (select jobid from cron.job where jobname='multiplayer-round-worker')
    and end_time < now()-interval '1 day'$$);
commit;
