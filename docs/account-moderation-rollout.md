# Account moderation (migration 068)

For current retention behavior, also install [migration 069](moderation-retention-rollout.md)
before deploying the updated audit/deletion notices. It replaces the original
audit-survives-deletion behavior with account-linked audit removal and a separate
24-hour retry/rate-limit receipt ledger. Active account restrictions are unchanged.

## Behavior

- Admins and owners can require a new username for ordinary users. The profile
  receives a unique neutral `player_…` name; the previous username becomes a
  private temporary login alias. The user signs in normally and chooses a new
  appropriate, available username. After that, only the new site username works.
  Passwords, account IDs, recovery email, Google identity, scores and progress stay
  unchanged. Existing open pages get the new public name on their next snapshot.
- Admins and owners can suspend and restore ordinary users. Suspension preserves
  saved data and stops signed-in access, including already-issued tokens. A user
  can still authenticate to see the suspension notice. Restoration does not clear
  a separately required name change.
- Only owners can permanently delete another ordinary account. Deletion is not
  reversible in the UI. The audit and authorization checks, target deletion, and
  foreign-key cascades share one transaction. Any failed dependency rolls it all
  back. Migration 047 preserves other players and detaches a deleted room host.
- Self-targeting, targeting admins/owners, and administrator deletion are denied.
  A database trigger also protects privileged accounts from the existing self-
  deletion API. This includes the last owner. Role changes are not added here.
- Every moderation action needs a private reason,
  current account version, and fresh **actor** verification. Password verification
  uses an isolated, nonpersistent session; Google-only administrators use a fresh
  same-account OAuth flow and a five-minute, single-use, session-bound proof.
  These proofs cannot be used for self-deletion or vice versa.
- Filtering now catches the reported nickname and common spelling evasions in
  both the app and database, with explicit innocent-word regression cases. No
  word list detects every offensive name; moderators can act on any existing
  name, even an otherwise allowed one.

Installing 068 does **not** automatically flag, rename, suspend, or delete any
existing account. The reported real account is not changed by this implementation.

## Security and performance

The normal server Auth lookup checks current server-controlled app metadata, not
user-editable metadata or stale JWT claims. Restricted users are redirected before
service-role operations. The resolution/status endpoints explicitly allow a
restricted identity but permit only its own required rename; suspension takes
precedence. A database transaction rechecks status and roles under locks.

PostgREST's pre-request check independently reads current account state, so direct
REST/RPC calls and unexpired tokens cannot bypass restrictions. Restrictive RLS
policies also cover existing RLS-enabled public tables and Realtime messages if
present. Existing ownership policies remain in place. The migration **stops and
rolls back** if an unrelated pre-request hook is already configured; do not erase
that hook to force installation. Review and compose its checks first.

Moderation tables and old login aliases have no browser-role privileges. Normal
moderation appends audits through scoped functions, not through the service role's
table API. Migration 069 adds trusted retention cleanup and deletion redaction;
application roles still cannot edit audit history directly. New endpoints enforce same-origin requests, bounded bodies,
rate limits, generic provider/database errors, and no-store responses. Request
IDs and version checks protect retries and stale administrative pages. Passwords,
session tokens, and Google tokens are neither audited nor returned.

The server guard reuses the Auth request already made by multiplayer services:
no additional Auth/database network round trip per game poll. The database check
is indexed by account ID; RLS invokes it once per statement, not per result row.
A separate nonblocking UI check runs on navigation/focus and every 30 seconds in
visible signed-in tabs to move already-open pages to the resolution screen. Public
pages such as Contact remain accessible. No CAPTCHA or external filtering service.
Hosted latency/200-player load has **not** been benchmarked for this change.

This is account moderation, not an IP/device ban. Someone who signs out can still
use deliberately public guest features or register another account. Already
downloaded public content cannot be recalled. Public room listings retain their
existing one-second CDN cache; private data is not placed in it.

## Local verification

```sh
cd /path/to/mao-practice &&
node --experimental-strip-types --test tests/*.test.mjs &&
npm run build -- --webpack &&
node tests/accountModeration.browser.mjs &&
node tests/googleAuth.browser.mjs
```

Isolated PostgreSQL tests (this machine's existing PGlite installation):

```sh
cd /path/to/mao-practice &&
PGLITE_MODULE_PATH='/path/to/Documents/Codex/2026-09-04/just/work/multiplayer-db-test/node_modules/@electric-sql/pglite/dist/index.js' \
node --test tests/security/accountModeration.test.mjs tests/security/googleAuthNames.test.mjs
```

Tests cover an **ordinary allowed name**, private login alias resolution, blocked
renames and alias theft, preserved progress/password/identity, stale versions,
duplicate requests, wrong actor/role, self/privileged targets, suspension and
restoration, stale tokens/RLS, proof expiry/session/purpose separation, account
deletion rollback, preservation of another room participant, and escaped audit
text. Browser checks use real components with mocked services; they are not live
Supabase/Vercel or Google-provider verification.

## Rollout order

1. Apply database migration 068 first, with the existing migrations through 067
   installed. Keep administrative moderation unused until the app is deployed.
2. Verify the database checks below and record migration history.
3. Deploy the application changes together.
4. Test with a disposable **ordinary** account, not a real student's account.

### 1. Supabase SQL Editor

Copy the migration from Terminal, then paste and run the complete file in the
correct project's **Supabase SQL Editor**, not in Terminal:

```sh
cd /path/to/mao-practice &&
pbcopy < supabase/migrations/068_account_moderation.sql
```

This is one transaction. Do not rerun after success: it creates tables and
triggers. If you get an error, stop and review it; do not mark it applied.

### 2. Read-only installation checks (SQL Editor)

All seven columns should be `true`:

```sql
select
  to_regprocedure('public.moderate_account(uuid,uuid,text,text,bigint,uuid)') is not null
    as moderation_installed,
  not public.is_public_name_allowed('alligatorraper')
    and public.is_public_name_allowed('grapefruit')
    and public.is_public_name_allowed('therapist') as filter_correct,
  not has_function_privilege('anon','public.moderate_account(uuid,uuid,text,text,bigint,uuid)','execute')
    and not has_function_privilege('authenticated','public.moderate_account(uuid,uuid,text,text,bigint,uuid)','execute')
    and has_function_privilege('service_role','public.moderate_account(uuid,uuid,text,text,bigint,uuid)','execute')
    as moderation_permissions_correct,
  not has_table_privilege('anon','public.account_moderation_audit','select')
    and not has_table_privilege('authenticated','public.account_moderation','select')
    and not has_function_privilege('authenticated','public.resolve_login_username(text)','execute')
    as private_details_blocked,
  exists(select 1 from pg_db_role_setting s join pg_roles r on r.oid=s.setrole
    where r.rolname='authenticator' and
      'pgrst.db_pre_request=public.check_account_access'=any(s.setconfig))
    as stale_token_guard_configured,
  exists(select 1 from pg_policies where schemaname='public' and tablename='question_progress'
    and policyname='account_active_required' and permissive='RESTRICTIVE')
    as restrictive_policy_installed,
  exists(select 1 from pg_trigger where tgrelid='auth.users'::regclass
    and tgname='protect_privileged_account_deletion' and tgenabled='O')
    as privileged_deletion_blocked;
```

The CLI's temporary-login initialization has previously stalled on this project.
After the above checks pass, this guarded SQL Editor history update avoids that
connection path. It records installation only; it does not run the migration:

```sql
do $$
begin
  if to_regprocedure('public.moderate_account(uuid,uuid,text,text,bigint,uuid)') is null
    or to_regclass('public.account_moderation_audit') is null
    or public.is_public_name_allowed('alligatorraper')
    or not exists(select 1 from pg_policies where schemaname='public'
      and tablename='question_progress' and policyname='account_active_required')
    or not exists(select 1 from pg_db_role_setting s join pg_roles r on r.oid=s.setrole
      where r.rolname='authenticator' and
      'pgrst.db_pre_request=public.check_account_access'=any(s.setconfig)) then
    raise exception '068 is not installed; do not record it yet';
  end if;
  insert into supabase_migrations.schema_migrations(version,name)
    values('068','account_moderation') on conflict(version) do nothing;
end $$;
select version,name from supabase_migrations.schema_migrations where version='068';
```

### 3. Stage only this change and deploy

Review staged changes before committing; preserve unrelated untracked security
and account-deletion files. Do not use `git add .` or `git add -A`.

```sh
cd /path/to/mao-practice &&
git add -- \
  app/account/page.tsx \
  app/admin/users/page.tsx \
  'app/admin/users/[id]/page.tsx' \
  app/api/account/moderation/route.ts \
  'app/api/admin/users/[id]/moderation/route.ts' \
  app/api/auth/google/route.ts \
  app/api/auth/login/route.ts \
  app/api/auth/setup/route.ts \
  app/auth/callback/route.ts \
  app/auth/resolve/page.tsx \
  components/Navbar.tsx \
  components/account/AccountSettings.tsx \
  components/admin/AccountModerationPanel.tsx \
  components/auth/AccountAccessGate.tsx \
  components/auth/RequiredNameChangeForm.tsx \
  lib/auth/accountAccess.ts \
  lib/auth/googleFlow.ts \
  lib/auth/moderation.ts \
  lib/auth/publicNameRules.json \
  lib/auth/publicNames.ts \
  lib/services/accountModerationService.ts \
  lib/supabase/proxy.ts \
  lib/supabase/server.ts \
  supabase/migrations/068_account_moderation.sql \
  tests/accountModeration.test.mjs \
  tests/accountModeration.browser.mjs \
  tests/browserFixtures/accountModeration.tsx \
  tests/googleAuth.test.mjs \
  tests/publicNames.test.mjs \
  tests/questionBankRead.test.mjs \
  tests/security/accountModeration.test.mjs \
  tests/security/googleAuthNames.test.mjs \
  docs/account-moderation-rollout.md &&
git --no-pager diff --cached --stat
```

After reviewing the staged list:

```sh
git commit -m "Add secure account moderation and required username changes" &&
git push origin main
```

Wait for Vercel's production deployment to be Ready before using the new controls.

### 4. Hosted smoke test without an offensive name

1. Create an ordinary disposable user, for example `moderation_test_1` if available.
   Save one practice result/bookmark. Keep that session open in another browser.
2. In **Admin → Users → that account**, choose **Require a new username**, enter
   a test reason and your current password (or verify with Google first), and submit
   the action. No typed confirmation is required. Check the private audit entry and neutral name.
3. In the other browser, try an action or refresh. It must stop signed-in activity
   and request a new name. Sign out and confirm the **old** username/password still
   reaches that screen. Choose a different allowed name, then verify old progress,
   bookmarks and password still work. The old site username must no longer log in.
4. Suspend the test user while already signed in. Their next protected operation
   must be denied; the page moves to the suspension notice. Restore access and
   verify the original progress remains. Test Google sign-in too if used.
5. Confirm an admin does not get a deletion choice, and admin/owner targets show
   protected controls. As owner, optionally delete **only the disposable account**
   after reviewing the irreversible warning. Check that other players remain.
6. Complete a normal Practice/Trainer question and a small multiplayer game with
   unmoderated users. Compare their existing timing headers if anything is slower.

The recorded SQL setting must also work in live PostgREST: the stale signed-in
test account must not read/write private data by reusing its pre-moderation token.
Use only a disposable test account for this check and never share its tokens.
Local PGlite tests validate the function and RLS but do not emulate the hosted
gateway's config reload or actual OAuth provider.

## Recovery and rollback

Stop making moderation changes if the hosted checks fail. Keep the audit and
user data. Restore a suspension through the verified control; required name
changes can be completed normally. Do not clear metadata, drop guards, or grant
browser privileges as a workaround. If a migration error mentions an existing
pre-request hook, the transaction rolled back; integrate the existing check in a
reviewed follow-up before retrying.

Before reverting the application, check whether any users have pending required
name changes: older builds cannot use their private login aliases or show the
resolution screen. Do not leave those users stranded on an old build. Prefer a
forward fix. A successful permanent deletion cannot be undone by reverting code
or SQL; recovery would require a separately managed backup.
