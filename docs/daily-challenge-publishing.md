# Publishing daily questions

Daily Challenge resets at midnight UTC. A manually scheduled question takes
priority. If a division has no assignment, its first visitor triggers a server
action that selects and saves a random question from that division's published
Question Bank. Later visitors read the same saved assignment. Page prefetches do
not create assignments.

The fallback chooses questions never previously assigned by this fallback first.
Once the division's bank is exhausted, it reuses the least recently assigned
question. History is shared across players, not based on individual practice
progress. Bank additions are eligible immediately; withheld reference questions
are never imported. Diagrams and source credits are preserved. Answers remain
server-graded. Bank questions already have solutions available in the Question
Bank, so this fallback is for daily practice, not a secure unseen-question exam.

## Schedule your own questions

Add the three question objects to
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

Schedule uploads before the UTC day begins (or before its first visitor). Do not
replace an assignment once the daily question has been shown, especially after
players submit it: existing attempts reference the original assignment. If the
fallback was already assigned, schedule your upload for the next day instead.
The fallback never updates an existing row, including a manual assignment that
arrives while it is choosing a question. Mu is the default; all three remain
selectable.

No new upload interface is added: the code-content + database-schedule workflow
above remains the way to publish your own daily questions.

## Deploy the automatic fallback

This is an application-only change; no new migration or CLI migration repair is
required. Keep the existing server-only Supabase secret configured. The server
role needs SELECT/INSERT on `daily_challenges`, and migration 038's unique
`(challenge_date, division)` constraint must be installed. Browsers must have no
write policies. No credentials or full question catalog are sent by the new
preparation action; it returns only a readiness flag.

After deployment, visit each division on an unscheduled day. Confirm a question
appears, refresh, and verify the same question appears in a second browser.
Submit once to check saved results and streaks. A scheduled uploaded question
should remain unchanged. If preparation fails, the page offers a retry rather
than pretending a question has been saved.

Each account can submit each daily question once. One correct answer in any
division earns one streak day. Additional answers cannot add a second day or
remove earned credit. Completion and accuracy statistics count individual
questions; leaderboard ties use the first correct submission that day. Guests
can answer but must sign in to save attempts and earn streaks.
