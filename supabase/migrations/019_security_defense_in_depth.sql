-- Defense in depth for tables whose writes are exclusively server-managed.

begin;

revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;

revoke insert, update, delete on public.question_progress from authenticated;
grant select on public.question_progress to authenticated;

revoke update on public.user_levels from authenticated;
grant select on public.user_levels to authenticated;

commit;
