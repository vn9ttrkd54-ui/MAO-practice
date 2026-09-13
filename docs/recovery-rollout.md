# Single-use recovery rollout

Migration 045 and the reset endpoint must ship together. Gate recovery resets,
drain old in-flight requests, apply the reviewed migration, deploy the matching
app and retire old deployments capable of password resets before reopening.
Do not blindly push other pending migrations: earlier tutor/practice migrations
have their own rollout requirements. Nothing in this document has been deployed.

The server first validates origin, current authenticated user, signed cookie and
password format, then atomically inserts the cookie's SHA-256 digest. Only a new
digest can proceed to the provider password update. A duplicate or database
failure denies the reset. Consumption is never refunded after provider failure
or an uncertain response. Request a new owner-generated recovery link in that
case; if the result was uncertain, first try signing in with the new password.

Only digests and account IDs are stored, not passwords or recovery cookies.
Records remain until account deletion. Do not remove records for unexpired
tokens. The existing token format is retained: authorizations generated for the
same account in the same second are identical and intentionally share one use.

Local coverage: 126 application tests, 51 isolated database tests, TypeScript
check. Database tests are single-connection, not a hosted concurrency test.
Smoke-test an alt account with a new owner-generated token_hash link, successful
reset, old-cookie replay rejection, and normal sign-in. Provider direct Auth
password policies, session revocation and browser behavior remain unverified.
This ledger protects the application reset endpoint, not direct provider calls.
