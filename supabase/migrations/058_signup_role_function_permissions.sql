-- Restrict API execution without changing signup triggers or role checks.
begin;

-- Signup runs this through the existing Auth trigger, not a browser RPC.
revoke execute on function public.handle_new_user()
  from public, anon, authenticated;

-- Signed-in RLS policies still need these caller-specific role checks.
revoke execute on function public.is_admin(), public.is_owner()
  from public, anon;
grant execute on function public.is_admin(), public.is_owner()
  to authenticated;

commit;
