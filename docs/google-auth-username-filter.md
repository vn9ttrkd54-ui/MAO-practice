# Google Sign-In and Public Name Filter

## Activation order

1. Run `supabase/migrations/057_google_auth_public_names.sql` once in the Supabase SQL Editor. It does not rename or delete existing accounts. Do this before deploying the new signup code, which calls the new name-check function.
2. In Google Cloud / Google Auth Platform, create an OAuth client of type **Web application**. Configure Mathematics Daily's branding, privacy-policy URL, terms URL, and audience. Testing mode allows only explicitly added test users; configure the production audience before a public launch.
3. Authorized JavaScript origins: `https://www.mathematicsdaily.com`, `https://mathematicsdaily.com`, and `http://localhost:3000` for local testing. Include `http://127.0.0.1:3000` only when testing on that origin. These are origins, not `/auth/callback` paths.
4. Authorized redirect URI in Google: copy the exact callback from Supabase **Authentication > Sign In / Providers > Google**. For the hosted project it looks like `https://<project-ref>.supabase.co/auth/v1/callback`. Localhost with the hosted database still uses that hosted Supabase callback, not the local Supabase CLI callback.
5. In Supabase's Google provider, enable Google and enter the Google client ID and secret. Keep the secret in Supabase, never in browser environment variables or chat. Only basic `openid`, email, and profile scopes are needed; no Google Drive or other permissions.
6. Supabase **Authentication > URL Configuration**: set the production Site URL, and explicitly allow `https://www.mathematicsdaily.com/auth/callback`, `https://mathematicsdaily.com/auth/callback`, and the exact local `/auth/callback` URL you use. Avoid broad production wildcard redirects.
7. Enable Supabase's **manual identity linking** setting to support **Connect Google** for existing accounts. Do not enable anonymous sign-ins for this feature.
8. Deploy only after the SQL and provider settings are ready. Test with disposable accounts first, including the full callback flow. Local tests cannot validate Google Cloud configuration, provider settings, or the real Google consent screen.

Official setup references: [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google), [identity linking](https://supabase.com/docs/guides/auth/auth-identity-linking).

## Behavior

- Login and signup offer Google alongside the existing username/password flow.
- New Google users choose a unique public username and affirm the existing 13+ age and Terms/Privacy agreement. Their Google real name and email are not used as their public username. An opaque temporary profile is created internally until setup is finished.
- Setup and rename update the public profile and Auth display name atomically. A username collision changes neither record.
- Existing users should sign in normally, visit Account settings, enter their current password, and click **Connect Google**. The existing account ID, progress, bookmarks, history, and username remain unchanged. Signing in with Google first may create a separate account if the old account has a synthetic email. The application never merges accounts by username. Supabase can automatically link identities with the same verified email.
- Google-only accounts have no site password field or recovery-email editor. Those are managed in Google. Existing accounts connected to Google retain their password and recovery-email controls.
- Google-only deletion requires a new Google OAuth round trip for the same account, plus typing `DELETE`. The proof lasts five minutes, is bound to that account and Supabase session, and is single-use. Choosing another Google account does not authorize deletion. This confirms access to the Google session; it does not guarantee that Google prompts for the user's password or MFA again.
- OAuth intentions are signed, short-lived, HTTP-only cookies. PKCE exchanges stay server-side. Callback destinations are fixed local routes; query strings cannot supply a redirect target.

## Name moderation

Signup, Google setup, username changes, and guest nicknames are checked. The database trigger is authoritative, so bypassing browser validation does not bypass moderation. Existing names remain untouched, and unrelated updates to an existing flagged name are not blocked.

Rules recognize common digit substitutions, separators, repeated letters, full-width characters, and selected invisible separators. Ambiguous words use whole-word matching, and common innocent names are allowlisted. This is a curated English-language filter, not a guarantee against every spelling or language. It makes no paid AI calls.

The authoritative rules are in `public.public_name_rules`; only SQL Editor/server access can edit them. The browser's early check uses `lib/auth/publicNameRules.json`. Keep that file and the migration seed synchronized when changing shipped rules. A database rule added independently still applies at signup and every public-name write, but browser wording may lag until the local list is updated.

Review existing names without changing anything:

```sql
select id, username
from public.profiles
where not public.is_public_name_allowed(username)
order by username;
```

## Verification checklist

- Regular signup, login, recovery, and password/email changes still work.
- Google signup reaches username setup; no setup-dependent page/API is usable before completion.
- Canceling Google sign-in produces a retry message, not a broken page.
- A returning Google user reaches the dashboard without another setup screen.
- Existing-account linking preserves the same user ID and progress. An identity already linked to another account gives an error rather than merging records.
- Profanity, common evasion spellings, and database-direct public-name writes are rejected. Innocent names and existing records are preserved.
- Google-only account deletion rejects absent, expired, mismatched-session, and replayed verification. Password accounts still require the current password.
- Check mobile/desktop auth pages and Account settings. Test production callbacks on the exact hostname used by players.

No hosted provider settings, migration, accounts, or deployment are changed by the local implementation itself.
