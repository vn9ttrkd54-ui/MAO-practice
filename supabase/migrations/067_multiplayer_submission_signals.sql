-- Invalidate versioned snapshots when an answer/Give up is first committed.
-- Player score/status updates are intentionally filtered by 028, so they did
-- not wake other players until the round closed. Signal the source of truth:
-- one new submission, not heartbeats, score writes or idempotent retries.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

create or replace trigger multiplayer_submissions_bump_room_state
after insert on public.multiplayer_submissions
for each row execute function public.bump_multiplayer_room_state_version();

-- Reuses the transaction's room lock, existing tiny room-version broadcast,
-- client coalescing and authorized snapshot reads. No answers, correctness or
-- scores are broadcast. Open-round score masking remains unchanged.
-- No existing rows, scoring functions, timing rules, grants or RLS are changed.
commit;
