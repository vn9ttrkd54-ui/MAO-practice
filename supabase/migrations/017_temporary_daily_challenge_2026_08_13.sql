-- Schedule CH-0006 for the active UTC challenge date.
-- At the evening of 2026-08-12 in New York, the server date is already 2026-08-13 UTC.
insert into public.daily_challenges (challenge_date, question_id)
values ('2026-08-13', 'CH-0006')
on conflict (challenge_date)
do update set question_id = excluded.question_id;
