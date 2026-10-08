-- Operator-only lookup. Replace both values with the exact reported room and
-- nickname. This does not expose reconnect hashes or change any records.
begin read only;

with target as (
  select 'REPLACE_ROOM_CODE'::text as room_code,
    'REPLACE_GUEST_NICKNAME'::text as guest_nickname
)
select r.id as room_id, r.code, r.status, p.id as player_id,
  p.guest_nickname, p.joined_at, p.left_at, p.is_host,
  (select count(*) from public.multiplayer_submissions s
    where s.room_id = r.id and s.player_id = p.id) as answers,
  (select count(*) from public.multiplayer_match_results m
    where m.room_id = r.id and m.player_id = p.id) as results,
  (select count(*) from public.multiplayer_question_deliveries d
    where d.room_id = r.id and d.player_id = p.id) as deliveries,
  (select count(*) from public.multiplayer_question_readiness q
    where q.room_id = r.id and q.player_id = p.id) as readiness,
  (select count(*) from public.multiplayer_result_receipts a
    where a.room_id = r.id and a.player_id = p.id) as receipts
from public.multiplayer_rooms r
join public.multiplayer_players p on p.room_id = r.id
join target t on r.code = t.room_code and p.guest_nickname = t.guest_nickname
where r.visibility = 'private' and p.user_id is null;

rollback;
