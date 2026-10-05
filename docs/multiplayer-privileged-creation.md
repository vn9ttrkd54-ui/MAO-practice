# Unlimited multiplayer creation for admins and owners

## Scope

Migration **065** requires the preceding migrations through **064**. Apply the database change before deploying the Create Room page change.

- Accounts whose protected `profiles.role` is `admin` or `owner` bypass both the **3 creations per 10 minutes** quota and the **one active private room** limit.
- Ordinary users keep both limits. Public rooms, room capacity (30 for private rooms), settings validation, scoring, timing, cleanup and join permissions are unchanged.
- Existing games, memberships, scores, progress and account roles are not rewritten or deleted. An added boolean column defaults to false on old rooms.
- Admins/owners still need to sign in. This removes creation quotas, not infrastructure limits or other security checks. It is not a new capacity/load certification.
- This stage does not apply SQL, change accounts, commit, push, or deploy automatically.

## Authorization and role changes

The existing server action derives identity from `auth.getUser()`. It does not accept a user ID, role, or exemption from the form. The server-only database creation function locks that user's profile and reads the protected role on every creation. The six-argument compatibility wrapper delegates to the updated seven-argument function.

`creation_limit_exempt` is creation-time metadata used by the partial unique index, not proof of current privileges. Ordinary rooms retain the one-active-host uniqueness backstop. Privileged rooms retain both their host account and host player references; ownership is not erased to avoid the index. Browser roles still cannot invoke the creation functions or directly change this flag through the existing RLS policies.

Promotion permits additional rooms immediately, including with an existing ordinary room. Demotion does not cancel games, but it restores the active-room check across all of that account's rooms, including previously exempt rooms and legacy host memberships. Creation history is recorded for every role, so recent privileged creations also count toward the ordinary rolling quota after demotion.

The page reads the protected role for display only. A failed role read does not grant the exemption; failed room-list reads retain the refresh/retry guard. The database remains authoritative if the role changes after the page renders.

## Local checks

```sh
cd "/path/to/mao-practice" &&
npm run lint &&
node --experimental-strip-types --test tests/*.test.mjs &&
node tests/multiplayerPrivilegedCreation.database.mjs /path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js &&
npm run build -- --webpack &&
node tests/multiplayerLobbyRecovery.browser.mjs
```

The database test uses a local, ephemeral PGlite database and real migrations, never hosted Supabase. It verifies preservation of seeded games/results, both ordinary-user limits, five simultaneous creations for each privileged role, role transitions, legacy signatures/memberships, ownership, server-only grants, role protection and failure rollback. PGlite uses one connection: concurrent promises are not proof of multi-server production concurrency. The profile row lock and ordinary-room index remain in place.

Page/server tests execute actual source with mocked dependencies and verify disabled/enabled creation controls, failed reads, forged form fields and settings validation. The browser recovery test uses the actual recovery component with mocked actions; live role-based flows still need a smoke test.

## Rollout

1. Review only this stage's files below; preserve unrelated security migrations and other work.
2. Run the local checks. Choose a quiet deployment window because the migration briefly locks the rooms table while replacing its index.
3. In the correct Supabase project's **SQL Editor**, run the complete `supabase/migrations/065_multiplayer_privileged_creation.sql` once. It has one transaction, a 5-second lock timeout and a 30-second statement timeout. If it times out, the transaction must roll back; do not assume it succeeded or blindly rerun an uncertain result.
4. Run the read-only checks below. Review unexpected results before proceeding.
5. Record the manually applied migration with `npx supabase migration repair 065 --status applied --linked`. This records history only; it does not apply the SQL. If it hangs at temporary-role login, stop and request a reviewed SQL Editor history fallback. Do not rerun schema changes to fix migration history.
6. Deploy the reviewed code using the project's normal commit/push workflow. No unrelated files should be staged.
7. After a successful deployment, refresh and smoke-test the role behavior below.

Stage files:

```text
app/multiplayer/create/page.tsx
components/multiplayer/PrivateRoomRecovery.tsx
supabase/migrations/065_multiplayer_privileged_creation.sql
tests/multiplayerPrivilegedCreation.test.mjs
tests/multiplayerPrivilegedCreation.database.mjs
docs/multiplayer-privileged-creation.md
```

### Read-only checks (Supabase SQL Editor, not the Mac terminal)

The first query should return all true. These are deployment-shape checks, not a substitute for the role-based smoke test.

```sql
select
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='multiplayer_rooms'
      and column_name='creation_limit_exempt' and data_type='boolean'
      and is_nullable='NO' and column_default='false'
  ) as exemption_column_ready,
  exists (
    select 1 from pg_index i
    where i.indexrelid=to_regclass('public.multiplayer_one_active_private_host')
      and i.indisunique and i.indisvalid
      and position('NOT creation_limit_exempt' in pg_get_expr(i.indpred,i.indrelid)) > 0
  ) as ordinary_room_index_ready,
  exists (
    select 1 from pg_proc p
    where p.oid=to_regprocedure('public.create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)')
      and position($s$role in ('admin', 'owner')$s$ in p.prosrc) > 0
      and position('from public.profiles where id = p_user_id for update' in p.prosrc) > 0
      and position('if not privileged_creator then' in p.prosrc) > 0
      and p.prosecdef and p.proconfig=array['search_path=""']
  ) as protected_role_check_ready;

with expected(signature) as (values
  ('public.create_private_multiplayer_room(uuid,text,text,text,integer,integer)'),
  ('public.create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)')
)
select signature,
  to_regprocedure(signature) is not null as function_present,
  not has_function_privilege('anon',to_regprocedure(signature),'execute') as anonymous_blocked,
  not has_function_privilege('authenticated',to_regprocedure(signature),'execute') as signed_in_blocked,
  has_function_privilege('service_role',to_regprocedure(signature),'execute') as server_allowed
from expected;

-- Run after recording migration history:
select version,name from supabase_migrations.schema_migrations where version='065';
```

### Live smoke test

- As an existing admin, create four private rooms within ten minutes without closing the earlier ones. Each should be listed with Return/Close controls; starting one should not disable creation of another. Repeat with the owner account.
- As an ordinary user, a second active private room must still be blocked. After explicitly closing each room, the fourth creation within ten minutes must still be rejected. Guests cannot create private rooms.
- Verify closing one admin room leaves the other rooms alone. Use the existing explicit Close Room confirmation to clean up unstarted test rooms; do not delete database records.
- Check an existing completed score/history entry and one normal game for unchanged behavior.

Do not alter real users' roles just to test demotion in production; that scenario is covered locally.

## Rollback caution

The database change is compatible with the old application, but reverting only the page restores its old one-active-room UI restriction. Do **not** blindly restore the old unique index or drop the exemption column: an admin may now legitimately own several active rooms. A full rollback needs an inventory and an approved plan for those rooms, without deleting scores or force-closing live games.
