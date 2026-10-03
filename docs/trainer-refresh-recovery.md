# Trainer refresh recovery

## Behavior

- An unfinished Daily Trainer session resumes automatically after refreshing the same tab.
- The question, selected answer, original timers, completed results, adaptive difficulty and level display are retained.
- A new tab starts independently. This is tab-local recovery, not cross-device history syncing.
- The draft belongs to the account (or guest) that started it. Authentication is checked before showing it; account changes clear it.
- Drafts expire 24 hours after the session began, within the existing practice-attempt retry retention window.
- Completed account progress and session history still use the existing server-verified saves. No database migration or permission change is required.

## Interrupted saves

The browser stores the pending answer before sending it and retains the original attempt request UUID. If refresh interrupts confirmation, **Retry save** submits the same answer and time to the same server attempt. It does not mint a new scoring attempt or automatically retry a write.

An interrupted end-of-session save restores the summary with **Retry session save**. Its session UUID, end time, levels and results remain frozen. The recovery draft is removed only after a valid save receipt, or when the user explicitly starts a new session after confirmation.

Session storage contains no credentials or access tokens. Treat it as untrusted UI state; scoring and ownership checks stay on the server. Malformed, expired or different-account drafts are discarded without changing account data. If storage is blocked or full, a warning asks the user to keep the tab open. Network failures during recovery retain the draft and offer a retry.

## Local verification

```bash
node --experimental-strip-types --test tests/*.test.mjs
node tests/trainerRecovery.browser.mjs
node tests/stageSeven.browser.mjs
npm run lint
npm run build -- --webpack
```

Browser tests use synthetic accounts and intercepted localhost requests, never the hosted database. They cover active/answered/pending/finalizing refreshes, stable retry identity, original timers, separate tabs, account changes, guest level continuity, corrupt/expired drafts, unavailable storage, retryable question loading and completed-session cleanup. The browser runner uses Chromium; perform the smoke check below in Safari after deployment.

## Rollout

Deploy the application through the existing reviewed Git/Vercel workflow. Do not rerun migrations 055 or 056 for this change. Preserve unrelated uncommitted work.

1. In Safari, start Trainer, select an answer and refresh. Confirm the same question, selection and elapsed timer remain.
2. Submit an answer, refresh and confirm the result and session counts remain without another score increment.
3. Go to the next question, refresh again and confirm that question remains.
4. End the session, wait for the saved confirmation, then refresh. Confirm Trainer returns to setup and the completed session remains in Dashboard.
5. Sign out during an active session and confirm it is not shown or saved under another account.

Local testing is not production deployment verification. This change does not recover active sessions that were already lost before it was deployed.
