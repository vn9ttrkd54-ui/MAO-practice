-- Temporarily schedule CH-0006 for the UTC challenge date 2026-08-12.
-- Re-running this statement is safe and only updates this one date.
insert into public.daily_challenges (challenge_date, question_id)
values ('2026-08-12', 'CH-0006')
on conflict (challenge_date)
do update set question_id = excluded.question_id;
