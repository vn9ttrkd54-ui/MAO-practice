# Underage player reporting and removal

Mathematics Daily is for high-school math competitors, coaches, and teachers age 13 or older. Accounts and guests have the same minimum age. This procedure stops known under-13 participation and removes the relevant records without adding an age questionnaire to normal play. It is an operator procedure, not automatic age verification or a certification of COPPA compliance.

## Before publishing

- Confirm `privacy@mathematicsdaily.com` receives messages and assign an operator to monitor it and respond promptly. Reports must not depend on signing in.
- Verify migration 047 (host-safe deletion), 049 (room lifecycle), and the existing account moderation migration 068 are installed on the hosted database. Follow [account moderation rollout](account-moderation-rollout.md); installation is database-first and must preserve existing security checks.
- Keep the join-page 13+ notice and Terms/Privacy links. No checkbox or consent claim is a substitute for eligibility rules or actual handling of reports.
- Keep content, outreach, and classroom invitations aimed at high-school competitors and adults. Do not invite elementary/middle-school children under 13 or advertise the service as available to all ages.

## Receive and assess a report

1. Obtain only what is needed to locate the participation: account username, or guest nickname plus private room code/link, and approximate date/time if known. Ask why the reporter believes the player is under 13 and their relationship to the player. Do not request the child's date of birth, real name, school, contact details, password, or identity documents by default.
2. Treat a credible disclosure from the player, parent, or teacher as actionable. Do not ignore known age information because the player clicked Join. Investigate ambiguous reports promptly without treating every unsupported accusation as proof. Restrict the relevant account or remove the identified guest while resolving a credible concern; do not disclose private records to an unverified requester.
3. Tell the host/teacher not to invite or readmit the known under-13 player. A parent's or teacher's permission does not change this service's 13+ restriction; Mathematics Daily does not offer a COPPA parental-consent process.

## An account holder

Use the existing admin user directory to locate the exact account. An admin/owner can suspend an ordinary account immediately, then an owner can permanently delete it using the existing fresh-verification and audit safeguards. Confirm the target identity; do not delete a different account that has a similar username. Protected admin/owner accounts need separate owner-led review, not a bypass of the protections.

Account deletion covers account-linked data through the installed cascades. Also investigate separately reported guest participation, feedback or tutor/provider records, and the copies described below. Suspension alone preserves data and is not completion of the deletion request. See [account deletion rollout](account-deletion-rollout.md).

The existing `account_moderation_audit` intentionally survives deletion and includes prior/new usernames, reason and target ID. Do not put a child's real name, date of birth or other unnecessary age evidence in a moderation reason. Review existing rows tied to the exact account as part of the privacy response: retain identifiable material only for a specific necessary, legally permitted purpose with a defined expiry; otherwise arrange targeted redaction/removal by the trusted database operator. Do not assume the account-delete button purges the audit or close the privacy case before resolving this review. Do not weaken the normal moderation permissions or fresh-verification safeguards.

## A guest player

Guests have no permanent account, but their nickname, token hash, answers, timing, scores and results exist in room records until cleanup. Leaving a room or waiting for scheduled cleanup is not the response to a known under-13 player's data.

1. In the trusted database SQL editor, use [guest removal preview](sql/guest-player-removal-preview.sql). Fill the exact reported room code and nickname. Review the returned room ID, player ID, join time and child-record counts against the report. No results may mean cleanup has already removed the room; verify that before closing the request. A nickname alone does not identify one person across rooms.
2. Use [guest removal rehearsal](sql/guest-player-removal.sql). Fill all four target values from that preview. Run the **entire script**. It locks the room before the player, refuses accounts/wrong targets/missing safeguards/changed dependencies, and rolls back by default. The notice describes only the transaction; a successful rehearsal has not deleted anything permanently.
3. After reviewing the rehearsal and authorizing that specific deletion, run the same fully populated script with its final `rollback;` changed to `commit;`. Run it as a trusted database operator, never through a browser, client RPC, or service key exposed to users. On any error, roll back and investigate; do not weaken a guard. Never leave the transaction open while reviewing it.
4. Rerun the read-only preview and confirm the selected record is absent. Deleting the player cascades to its submissions, question deliveries/readiness, match results and result receipts, and invalidates its room reconnect token. The cookie may remain in the browser until expiry, but no longer authorizes access. Other players' rows, scores, finalized results, account history and the room's questions are retained. If the deleted guest was a legacy host, the existing trigger detaches the host and cancels a waiting/countdown room; running matches are not cancelled by it.
5. Repeat only for additional room memberships actually linked to the report. Do not globally delete all guests with that nickname. A missing record on a repeat run is a verification result, not permission to pick another target.

This does not create an identity/device ban. A guest could make a fresh membership with a new nickname in a waiting room. Hosts must not readmit the known child; if that cannot be controlled, close the affected unstarted room or stop the affected session while the operator resolves it. Escalate repeated circumvention rather than treating token revocation as a permanent ban. Already downloaded results cannot be recalled from another player's device.

## Provider copies and reporting records

Review relevant Supabase/Vercel diagnostic and security records, room worker errors, tutor-provider data if applicable, and email reports. Delete identifiable data through the available provider processes where appropriate; document any restricted backup/security/legal retention, its justification and expiry. Do not assume deleting a database row erases provider logs, analytics or backups. Do not restore removed data into active use from a backup; reapply verified removals as part of recovery.

Keep only the minimum restricted operational record needed to demonstrate the action and prevent re-admission, such as an opaque case reference, necessary internal target identifiers, action time and outcome. Avoid retaining the child's nickname or unnecessary age evidence in general logs or email indefinitely. Review retained records, limit access and delete them when no longer needed; escalate any legal retention issue for appropriate advice. Do not publish reports or identify the child to other players.

## Limits of the chosen approach

For a general-audience/teen service, the FTC explains that asking every visitor's age is not required, but actual knowledge of under-13 collection triggers obligations. A 13+ notice does not establish that the service is general-audience. The current rule considers content, marketing, audience evidence and other factors when determining whether a service is directed to children. If the audience or marketing changes, get a COPPA-focused legal assessment before relying on this approach. [FTC guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions), [current rule definitions](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.2).

This local implementation does not verify the mailbox, hosted migrations, live provider retention or legal classification. Complete those operational checks before treating the reporting/removal process as live.
