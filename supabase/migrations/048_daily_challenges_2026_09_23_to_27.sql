-- Schedule five UTC days of original Challenge questions, one per division.
-- The question content is versioned in data/challengeQuestions.ts.
insert into public.daily_challenges (challenge_date, division, question_id)
values
  ('2026-09-23', 'Mu', 'CH-0007'),
  ('2026-09-23', 'Alpha', 'CH-0008'),
  ('2026-09-23', 'Theta', 'CH-0009'),
  ('2026-09-24', 'Mu', 'CH-0010'),
  ('2026-09-24', 'Alpha', 'CH-0011'),
  ('2026-09-24', 'Theta', 'CH-0012'),
  ('2026-09-25', 'Mu', 'CH-0013'),
  ('2026-09-25', 'Alpha', 'CH-0014'),
  ('2026-09-25', 'Theta', 'CH-0015'),
  ('2026-09-26', 'Mu', 'CH-0016'),
  ('2026-09-26', 'Alpha', 'CH-0017'),
  ('2026-09-26', 'Theta', 'CH-0018'),
  ('2026-09-27', 'Mu', 'CH-0019'),
  ('2026-09-27', 'Alpha', 'CH-0020'),
  ('2026-09-27', 'Theta', 'CH-0021')
on conflict (challenge_date, division)
do update set question_id = excluded.question_id;
