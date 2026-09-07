# Publishing daily questions

Daily Challenge resets at midnight UTC. Add the three question objects to
`data/challengeQuestions.ts`, each with a unique `CH-...` ID and the correct
`division` (`Mu`, `Alpha`, or `Theta`). Deploy that content before scheduling it.

Assign one question per division and date in `daily_challenges`. For example,
replace the date and IDs below with your new questions, then run in Supabase:

```sql
insert into public.daily_challenges(challenge_date, division, question_id)
values
  ('YYYY-MM-DD', 'Mu', 'CH-YOUR-MU-ID'),
  ('YYYY-MM-DD', 'Alpha', 'CH-YOUR-ALPHA-ID'),
  ('YYYY-MM-DD', 'Theta', 'CH-YOUR-THETA-ID')
on conflict (challenge_date, division)
do update set question_id = excluded.question_id;
```

Do not replace an assignment after players submit it: existing attempts reference
the original assignment. Missing divisions show an unscheduled message, not a
question from another division. Mu is the default; all three remain selectable.

Each account can submit each daily question once. One correct answer in any
division earns one streak day. Additional answers cannot add a second day or
remove earned credit. Completion and accuracy statistics count individual
questions; leaderboard ties use the first correct submission that day. Guests
can answer but must sign in to save attempts and earn streaks.
