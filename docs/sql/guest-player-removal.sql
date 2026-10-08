-- Operator-only, one reported guest in one private room. Not a migration/RPC.
-- Preview first using guest-player-removal-preview.sql. Fill all four targets.
-- The rehearsal always ROLLS BACK. Change only the final ROLLBACK to COMMIT
-- after reviewing the preview and authorizing this specific permanent deletion.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

do $removal$
declare
  target_room_id uuid := null;
  target_player_id uuid := null;
  target_room_code text := 'REPLACE_ROOM_CODE';
  target_guest_nickname text := 'REPLACE_GUEST_NICKNAME';
  room public.multiplayer_rooms%rowtype;
  player public.multiplayer_players%rowtype;
  removed integer;
begin
  if target_room_id is null or target_player_id is null
    or target_room_code = 'REPLACE_ROOM_CODE'
    or target_guest_nickname = 'REPLACE_GUEST_NICKNAME' then
    raise exception 'Fill all four targets from the reviewed guest preview.';
  end if;

  if not exists (
    select 1 from pg_catalog.pg_trigger
    where tgrelid = 'public.multiplayer_players'::regclass
      and tgname = 'multiplayer_players_detach_deleted_host'
      and tgfoid = to_regprocedure('public.detach_deleted_multiplayer_host()')
      and tgenabled in ('O', 'A')
  ) then
    raise exception 'Required host-detach safeguard (migration 047) is missing or disabled.';
  end if;

  -- Fail closed if the installed schema cannot erase known guest child rows.
  if exists (
    select 1 from (values
      ('public.multiplayer_submissions'), ('public.multiplayer_match_results'),
      ('public.multiplayer_question_deliveries'), ('public.multiplayer_question_readiness'),
      ('public.multiplayer_result_receipts')
    ) expected(table_name)
    where not exists (
      select 1 from pg_catalog.pg_constraint c
      where c.conrelid = to_regclass(expected.table_name) and c.contype = 'f'
        and c.confrelid = 'public.multiplayer_players'::regclass
        and c.confdeltype = 'c'
    )
  ) or exists (
    select 1 from pg_catalog.pg_constraint c
    where c.contype = 'f' and c.confrelid = 'public.multiplayer_players'::regclass
      and c.conrelid not in (
        'public.multiplayer_rooms'::regclass,
        'public.multiplayer_submissions'::regclass, 'public.multiplayer_match_results'::regclass,
        'public.multiplayer_question_deliveries'::regclass,
        'public.multiplayer_question_readiness'::regclass, 'public.multiplayer_result_receipts'::regclass
      )
  ) then
    raise exception 'Guest dependencies changed; review deletion and tests before proceeding.';
  end if;

  -- Match worker/join lock order so concurrent game activity cannot recreate data.
  select * into room from public.multiplayer_rooms where id = target_room_id for update;
  if not found or room.visibility <> 'private' or room.code is distinct from target_room_code then
    raise exception 'Private room does not match the reviewed target.';
  end if;
  select * into player from public.multiplayer_players
    where room_id = target_room_id and id = target_player_id for update;
  if not found or player.user_id is not null
    or player.guest_nickname is distinct from target_guest_nickname then
    raise exception 'Guest does not match the reviewed target; no account deletion is allowed here.';
  end if;

  delete from public.multiplayer_players where room_id = target_room_id and id = target_player_id
    and user_id is null and guest_nickname = target_guest_nickname;
  get diagnostics removed = row_count;
  if removed <> 1 then raise exception 'Expected exactly one guest deletion.'; end if;
  set constraints all immediate;
  raise notice 'Removed exactly one guest and its dependent room records within this transaction.';
end;
$removal$;

-- Rehearsal only. This restores every row and keeps the reconnect token valid.
rollback;
