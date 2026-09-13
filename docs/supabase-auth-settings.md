# Authentication settings without CAPTCHA

Status: implementation prepared locally; hosted values below were observed in
user-provided screenshots, not read through a management API. No settings have
been changed, deployments made, paid features enabled or live account tests run.
CAPTCHA is deliberately excluded at the user's request. Rate limits and ownership
checks remain, but they do not prove a caller is human or stop all automation.

## Apply after the matching app deployment

| Setting | Screenshot value | Target / action |
| --- | --- | --- |
| Email provider | On | Keep on (also used by username-only accounts). |
| Minimum password length | 6 | Set to **8**, matching signup, account changes and recovery. |
| Password requirements | None selected | Keep no character-class requirement; support long passphrases. |
| Secure password change | Off | Enable after the alt-account checks below; normal changes perform a fresh sign-in. |
| Require current password when updating | Off | Enable only after deploying the updated account endpoint and verifying recovery. |
| Email OTP expiration | 3600 seconds | Set to **900 seconds**; this shortens the time available to open a recovery/email link. |
| Email OTP length | 8 digits | Keep 8. |
| Access token expiry | 3600 seconds | Keep 3600. |
| Refresh-token compromise detection | On | Keep on. |
| Refresh-token reuse interval | 10 seconds | Keep 10; shortening it can break legitimate refresh/retry behavior. |
| CAPTCHA | Off | Keep off as requested. |

These are staged recommendations, not a claim that all rows are already applied.
Signup calls Supabase directly: the local signup checks improve the normal form
flow, but direct-provider signup only gains the new minimum when its hosted
minimum-password setting is also changed to 8.
First review [the recovery rollout](recovery-rollout.md) and the earlier tutor and
practice rollout guides. The outstanding migrations are not a blind db push.

## Settings intentionally not enabled

- **Secure email change:** requires confirmations at both the old and new
  addresses. Signup uses `username@users.mao-practice.local`, which cannot receive
  email. Turning this on would prevent those accounts from attaching a real
  recovery address. Keep it off until a verified real-email migration or separate
  recovery-address design is implemented. Website email changes still require the
  current password, but direct provider calls do not inherit that application rule.
- **Leaked-password protection:** shown as Pro-only. No plan upgrade or substitute
  external password-checking service has been introduced. The UI can explain a
  provider weak-password rejection if this is enabled later.
- **Time-box, inactivity timeout, single-session controls:** shown as Pro-only.
  Keep unchanged; app-local timers are not an equivalent replacement for provider
  session enforcement. Access-token expiry is not the same as session lifetime.
- **Confirm email at signup:** not visible in the supplied screenshots; do not
  change it as part of this batch. Username-only signup cannot receive a code.

## Required alt-account checks

1. With an existing account, confirm its old password still logs in. The app's
   new minimum applies only when creating/replacing a password.
2. Create an alt with an 8+ character password. A 7-character replacement
   should be rejected before a recovery authorization is consumed.
3. After enabling each password-change setting, test a wrong current password
   (must fail) and the right current password (must succeed). Log in again with
   the new password, and check that the old password no longer works.
4. Use a newly owner-generated `/auth/confirm?token_hash=...&type=recovery` link.
   Reset without knowing the old password. If the provider refuses the verified
   recovery session, pause rollout and investigate; do not switch to an admin
   password-update API that bypasses provider checks. An uncertain reset consumes
   its authorization: try signing in or request a new link, not an automatic retry.
5. Test username-only account email attachment while secure email change remains
   off. Test two browser sessions across password changes, sign-out, token refresh
   and a multiplayer match. Existing access tokens may remain valid until expiry;
   do not equate sign-out with instantaneous JWT invalidation.

References (official; checked during this work):

- [Supabase password security](https://supabase.com/docs/guides/auth/password-security)
- [Supabase sessions](https://supabase.com/docs/guides/auth/sessions)
- [Recovery compatibility fix, Auth v2.189.0](https://github.com/supabase/auth/releases/tag/v2.189.0)

Both provider password-change controls are distinct: recent-session
reauthentication has a 24-hour exception; requiring the current password adds a
separate check. The app sends `current_password` for normal changes and does not
ask recovery users for a password they have forgotten. Hosted behavior must be
smoke-tested on the actual project before this is considered verified.

Provider-source caveat: in Auth v2.189.0, the exemption checks stored session
authentication methods (OTP, magic link or recovery), not a browser URL flag.
That check is not itself single-use; the website ledger only protects our reset
endpoint. See the [handler](https://github.com/supabase/auth/blob/v2.189.0/internal/api/user.go#L168-L190)
and [method classification](https://github.com/supabase/auth/blob/v2.189.0/internal/models/factor.go#L62-L69).
The screenshot does not establish which Auth server version the project runs.
