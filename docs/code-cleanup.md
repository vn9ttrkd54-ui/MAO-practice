# Unused-file and catalog cleanup — 2026-10-04

## Removed

- `public/llama-tutor.png`: obsolete circular tutor artwork. The live launcher uses `public/llama-pet.png` through `LlamaPet.module.css`; keep that sprite.
- Five unreferenced starter assets: `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, and `window.svg`.
- Seven unused modules: `lib/filters.ts`, `lib/questions.ts`, `lib/multiplayer.ts`, `lib/services/bookmarkService.ts`, `lib/services/levelService.ts`, `lib/storage/bookmarks/supabaseBookmarkStorage.ts`, and `lib/storage/levels/supabaseLevelStorage.ts`.

The old helpers were unreachable from application entry points and had no callers in tests or scripts. Current question-bank filtering, bookmarks, guest progress, and server-verified levels use other modules. The multiplayer re-export file had no consumers. Tests, migration history, current assets, and unrelated security work remain intact. `lib/multiplayerScoring.ts` was retained because regression tests use it, even though production scoring runs in PostgreSQL.

All 13 removed files were tracked and are recoverable from Git history (present at commit `2796869`). A separate copy of the old PNG is also in the local task workspace at `work/code-cleanup-2026-10-04/llama-tutor.png`, outside the deployed website.

## Efficiency changes

- Multiplayer builds a question-ID lookup once per server module instead of searching the full bank for each round read, answer, spectator refresh, and question in the final results.
- Admin user details reuse a static question-to-division lookup instead of rebuilding it for each account view.
- Only static catalog metadata is reused. Authentication, role checks, room membership, live game state and user statistics are still fetched/checked per request. No new network caching, database changes, scoring changes or client-side answer disclosure.

The six public assets total **70,751 bytes**. They were not requested by current pages, so removing them reduces repository/deployment clutter, not current page downloads. The catalog changes reduce repeated local CPU work; they do not establish a measurable production-latency or player-capacity improvement.

## Verification

Completed locally: ESLint, all **437 application tests**, production Webpack build/TypeScript, tutor browser regression, question-bank browser regression, and `git diff --check` passed. Browser checks use local fixtures/mocked services, not hosted accounts or paid tutor requests.

```sh
npm run lint &&
node --experimental-strip-types --test tests/*.test.mjs &&
npm run build -- --webpack &&
node tests/stageFive.browser.mjs &&
node tests/stageThree.browser.mjs
```

`tests/catalogCleanup.test.mjs` verifies unique IDs across the real catalog, all referenced question/solution illustrations, the retained llama sprite, exact indexed lookup behavior, unrevealed answers, fresh authorization and fresh account statistics. Existing multiplayer tests retain submission, unknown-question, spectator and result checks.

Client-reference bundle sizes can be checked with the existing `scripts/measureQuestionBankBundles.mjs`, `scripts/measureTrainerBundles.mjs` and `scripts/measureDashboardBundles.mjs`. These are not total transferred bytes or a hosted performance measurement.

Before/after measurements were identical: compressed client-reference JS was 77,278 bytes for each division listing, 168,921 for question detail, 175,622 for Trainer, and 81,967 for Dashboard. This confirms no client-bundle reduction or increase in those routes; no production page-load speedup is claimed.

No migration is needed. Commit/deploy only this cleanup's intended files when authorized; do not include unrelated untracked security files. This cleanup itself does not commit, push or deploy.
