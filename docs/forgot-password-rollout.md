# Forgot-password rollout

This change adds `/forgot-password` and a login-page link. It reuses the existing server-verified, expiring, single-use reset flow; no new database migration is needed. It does not change password length or multiplayer requests.

## Before deployment

- Confirm migration 055 is applied: `consume_login_attempt(text,integer,integer,integer)` must be executable by `service_role`, not `anon`, `authenticated` or PUBLIC. Do not expose the limiter or its table to browser roles.
- Verify custom SMTP is operational and Supabase Auth email rate limits are appropriate. The public Supabase Auth recovery endpoint can be called directly; application throttles are not a replacement for provider limits. No CAPTCHA is added.
- In Supabase Authentication email templates, replace the **Reset password** template with `supabase/templates/recovery.html`. It deliberately links to the canonical production site's `/auth/confirm` using `TokenHash` and `type=recovery`. Do not use a fragment-based confirmation link or copy this production template into a staging project unchanged.
- Keep secrets server-only. Existing Supabase URL, publishable key and server secret environment variables are reused; no additional secrets are needed.

## Local verification

```sh
npm run lint
node --experimental-strip-types --test tests/*.test.mjs
npm run build -- --webpack
```

## Production smoke test after deployment

Use an account and mailbox you control. This sends a real email and changes that test account's password.

1. Open Login → Forgot password. Enter the account's existing personal recovery email.
2. Confirm a generic acknowledgment, then open the email and choose a new password.
3. Confirm the new password signs in and the old password does not.
4. Try the same link again: it must not allow another reset. Check an expired or edited link fails safely.
5. Try an unregistered email: the website acknowledgment must not disclose whether the account exists.
6. Verify Google sign-in and ordinary password sign-in still work.

Do not claim delivery, cross-account isolation, or hosted reset success from local mocks alone. Accounts without a personal recovery email still require owner-assisted recovery; Google users can continue using Google sign-in.

## Protections and limits

- Same-origin browser mutation checks, 2 KB request limit, validated email, fixed redirect destination, no token returned to callers, no session-cookie changes from requesting email.
- Durable server-side buckets: 10 requests per IP per 15 minutes, one address attempt per minute, three address attempts per hour. Address throttles receive the same acknowledgment; IP throttles return 429. Requests use keyed hashes, not plaintext email/IP, in limiter identifiers.
- Vercel's overwritten `x-real-ip` is trusted. A different host must establish its own trusted proxy header; absent addresses share a conservative bucket.
- Ten-second server deadline, twelve-second client deadline, no automatic email retries, client resend cooldown. Dependency failures fail closed.
- Generic responses and a 600 ms minimum acknowledgment delay reduce enumeration signals but are not a constant-time guarantee. Provider logs, SMTP delivery and provider quotas still need operational review.
- Existing reset protections remain: verified email token, signed short-lived user-bound HTTP-only recovery cookie, single-use proof, and password validation. Auth pages/API responses suppress caching and referrers.

The implementation does not change hosted settings or send email by itself. Apply the template and complete the smoke test before calling recovery production-verified.
