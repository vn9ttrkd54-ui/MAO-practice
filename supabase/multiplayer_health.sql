-- Read-only checks after applying migrations 032-035.
select jobname,schedule,active from cron.job
where jobname in ('multiplayer-round-worker','multiplayer-worker-history-cleanup');

select status,start_time,end_time,return_message from cron.job_run_details
where jobid=(select jobid from cron.job where jobname='multiplayer-round-worker')
order by start_time desc limit 5;

select room_id,last_error,updated_at from public.multiplayer_worker_errors order by updated_at desc;

select id,status,current_question_number,results_finalized_at
from public.multiplayer_rooms
where status='in-progress' or (status='completed' and results_finalized_at is null)
order by created_at desc limit 20;
