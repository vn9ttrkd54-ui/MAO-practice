-- Mathematics Daily: feedback requests, admin inbox, and role protection

begin;

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
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
    and (select auth.role()) <> 'service_role' then
    raise exception 'Only the server may change account roles';
  end if;

  return new;
end;
$$;

create trigger profiles_protect_role
before update of role on public.profiles
for each row execute function public.protect_profile_role();

create table public.feedback_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('question_report', 'general_suggestion')),
  question_id integer,
  division text check (division is null or division in ('Mu', 'Alpha', 'Theta')),
  message text not null check (char_length(trim(message)) between 10 and 2000),
  status text not null default 'open' check (status in ('open', 'resolved')),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint feedback_question_context check (
    (kind = 'question_report' and question_id is not null and division is not null)
    or
    (kind = 'general_suggestion' and question_id is null and division is null)
  )
);

create index feedback_requests_status_created_idx
  on public.feedback_requests (status, created_at desc);

create index feedback_requests_user_id_idx
  on public.feedback_requests (user_id, created_at desc);

create trigger feedback_requests_set_updated_at
before update on public.feedback_requests
for each row execute function public.set_updated_at();

alter table public.feedback_requests enable row level security;

create policy "Users can submit their own feedback"
on public.feedback_requests
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'open'
  and resolved_at is null
  and resolved_by is null
);

create policy "Users can read their own feedback"
on public.feedback_requests
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or public.is_admin()
);

create policy "Admins can resolve feedback"
on public.feedback_requests
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update on public.feedback_requests to authenticated;

commit;
