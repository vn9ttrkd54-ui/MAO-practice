-- Mathematics Daily: separate the sole owner from regular administrators

begin;

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('user', 'admin', 'owner'));

-- Existing installations have one administrator: promote that account to owner.
-- If there is more than one, leave assignment explicit instead of guessing.
alter table public.profiles disable trigger profiles_protect_role;

update public.profiles
set role = 'owner'
where role = 'admin'
  and (select count(*) from public.profiles where role = 'admin') = 1
  and not exists (select 1 from public.profiles where role = 'owner');

alter table public.profiles enable trigger profiles_protect_role;

create unique index if not exists profiles_single_owner_idx
  on public.profiles (role)
  where role = 'owner';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'owner')
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'owner'
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;

commit;
