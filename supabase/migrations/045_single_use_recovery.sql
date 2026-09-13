begin;
-- Store only a digest, never the cookie or password. Retain consumed digests
-- until account deletion; deleting a still-valid digest would allow replay.
create table public.consumed_recovery_tokens (
  token_hash text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  consumed_at timestamptz not null default clock_timestamp()
);
alter table public.consumed_recovery_tokens enable row level security;
revoke all on public.consumed_recovery_tokens from public, anon, authenticated, service_role;

create function public.consume_recovery_token(p_user_id uuid, p_token_hash text)
returns boolean language plpgsql security definer set search_path='' as $$
declare affected integer;
begin
  if p_user_id is null or p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then return false; end if;
  insert into public.consumed_recovery_tokens(user_id,token_hash)
  values(p_user_id,p_token_hash) on conflict(token_hash) do nothing;
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;
revoke all on function public.consume_recovery_token(uuid,text) from public,anon,authenticated;
grant execute on function public.consume_recovery_token(uuid,text) to service_role;
commit;
