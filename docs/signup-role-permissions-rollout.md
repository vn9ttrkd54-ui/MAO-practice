# Signup and Role Function Permissions

Apply only `supabase/migrations/058_signup_role_function_permissions.sql` in
Supabase's SQL Editor using the database-owner (`postgres`) role. Migration 057
must already be installed. This permission-only transaction is safe to rerun.
Do not rerun migration 057 or apply unrelated pending migrations for this change.

The update removes direct browser execution permissions from the signup trigger
and anonymous execution permissions from the admin/owner role checks. It keeps
signed-in role checks available for RLS. It does not replace any function, alter
any trigger or policy, change any user data, or change the other RPC permissions.
The website does not need a new deployment for this database-only change.

## Verify Permissions

Run this read-only query after applying the update:

```sql
select
  p.oid::regprocedure::text as function_name,
  has_function_privilege('anon', p.oid, 'EXECUTE') as signed_out_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as signed_in_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prokind = 'f'
  and p.proname in (
    'handle_new_user', 'is_admin', 'is_owner',
    'get_admin_users', 'get_challenge_leaderboard',
    'get_my_challenge_leaderboard_position',
    'is_public_name_allowed', 'is_username_available'
  )
order by function_name;
```

Expected permissions:

| Function | Signed Out | Signed In |
| --- | --- | --- |
| `handle_new_user()` | false | false |
| `is_admin()` | false | true |
| `is_owner()` | false | true |
| `get_admin_users(...)` | false | true |
| `get_challenge_leaderboard()` | true | true |
| `get_my_challenge_leaderboard_position()` | false | true |
| `is_public_name_allowed(text)` | true | true |
| `is_username_available(text)` | true | true |

Execution permission does not bypass the admin directory's internal role check.
Some Security Advisor warnings remain intentional because the website needs
these functions. Do not revoke all functions just to clear those warnings.

## Smoke Test

1. Sign in with an existing regular account and open the dashboard and challenge.
2. Use the admin account to open the user directory and feedback inbox.
3. Create a test password account with a valid username and accepted legal terms.
4. Create a fresh Google test account and complete its username setup. Existing
   Google-account sign-in alone does not exercise the new-user trigger.
5. Confirm username availability checks and the public leaderboard still work.

## Local Tests

Supply `PGLITE_MODULE_PATH` pointing to an existing local PGlite installation:

```sh
PGLITE_MODULE_PATH=/absolute/path/to/pglite/dist/index.js node --test tests/security/signupRoleFunctionPermissions.test.mjs tests/security/googleAuthNames.test.mjs
```

These tests use isolated PostgreSQL roles and synthetic accounts. They do not
connect to the hosted database or verify the live Google OAuth configuration.

References: [Supabase function privileges](https://supabase.com/docs/guides/database/functions#function-privileges)
and [PostgreSQL REVOKE](https://www.postgresql.org/docs/current/sql-revoke.html).
