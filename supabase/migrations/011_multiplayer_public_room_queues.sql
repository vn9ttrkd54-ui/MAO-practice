-- MAO Practice: Multiplayer Pack M8 public waiting rooms

begin;

insert into public.multiplayer_rooms (
  visibility, mode, division, question_count,
  seconds_per_question, status, capacity
)
select
  'public', 'ranked', division, question_count,
  60, 'waiting', 20
from unnest(array['Mu', 'Alpha', 'Theta']) as divisions(division)
cross join unnest(array[5, 15, 30]) as counts(question_count)
on conflict do nothing;

commit;
