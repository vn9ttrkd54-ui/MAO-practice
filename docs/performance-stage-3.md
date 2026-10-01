# Stage 3: lighter Question Bank browsing

Local implementation only. No database migration, data rewrite, new dependency,
commit, push or deployment is part of this stage. Keep unrelated security/audit
files out of its eventual commit. This does not certify 200-user capacity.

## Changes

- Division pages derive an explicitly allowlisted listing on the server: ID,
  number, division, topic, difficulty and methods. The browser no longer imports
  the full three-division question catalog to render question tiles.
- The individual question page sends its existing, unchanged question plus
  server-resolved previous/next IDs. Its client no longer imports the full catalog
  for navigation. Question text, answers, solutions, diagrams and IDs are unchanged.
- Render 120 tiles initially, with Show more in batches of 120. The `shown` query
  parameter preserves the expanded list on return. Counts and filtering still use
  the complete division, never only the visible batch.
- Filters use Next-supported native history replacement, so changing filters
  updates the URL without a server-page request or repeating the progress reads.
  Reset clears the filters and expanded count; changing a filter resets the count.
- Tile prefetch starts on hover or keyboard focus rather than prefetching every
  tile in the viewport. Existing loading feedback remains in place.
- Unfiltered question links omit the question sequence entirely. Filtered links
  range-compress consecutive IDs, preserving the exact ordered snapshot. These
  links work in new tabs and copied URLs without session/local storage. Legacy
  comma-separated sequences still work. Invalid/oversized/cross-division sequences
  fall back to normal division navigation without unbounded range expansion.
- Direct question links now use normal neighbors; the old empty-string parser
  accidentally interpreted an absent sequence as `[0]` and disabled navigation.
- Progress/bookmark reads share a single in-flight refresh, coalesce focus/page
  events, do not start while hidden, cancel on unmount/account changes, and have
  a twelve-second deadline. No new polling timer or shared personalized cache.
- Reads are scoped by account and question-ID range, with ordered 500-row pages
  rather than silently relying on the default response limit. Both reads must
  succeed and the session identity is rechecked before publishing the snapshot.
- Refresh failures preserve the last same-account snapshot with a warning and
  Retry progress button. Initial failures and account changes do not pretend all
  questions are new or that all bookmarks disappeared. Personal filters wait for
  a successful snapshot; guests continue using their existing local state.

## Local measurements

Before: deployed Stage 2 commit `109679d`. After: this local Stage 3 build.
Measured with the same Webpack client-reference-manifest method, summing each
unique referenced JS chunk once and gzip-compressing it locally.

| Client entry | Before JS | After JS | Before gzip | After gzip |
| --- | ---: | ---: | ---: | ---: |
| Each division listing | 964,721 B | 279,579 B | 266,685 B | 77,071 B |
| Individual question | 1,267,674 B | 578,153 B | 357,763 B | 166,558 B |

These figures are approximately 71% less listing JS and 54% less question
JS. Final byte counts can vary with small code/build changes. They are not total
page transfer (layout chunks, CSS, fonts and RSC are not included), a hosted
latency guarantee, or a bandwidth/cost claim for 200 users.

The new per-division metadata serializes to 36,292 B for 325 Mu questions,
28,836 B for 267 Alpha questions, and 44,168 B for 418 Theta questions, before
transport compression. Normal unfiltered links carry no sequence; if encoded,
these complete divisions compress from 1,949/1,601/2,507 characters of IDs to
11/47/23 characters respectively. Fragmented filtered sequences may compress less.

## Verification

```sh
npm run test:tutor-safety
npx tsc --noEmit --incremental false
npm run lint
npm run build -- --webpack
node tests/stageThree.browser.mjs
node --experimental-strip-types tests/stageThree.next.browser.mjs
node tests/stageOne.browser.mjs
node scripts/measureQuestionBankBundles.mjs
git diff --check
```

Unit checks cover metadata fidelity, every division's filters, compact/legacy/
invalid sequences, normal neighbors, 1,105 saved entries, account isolation,
timeouts, cancellation and guest-local state. The component browser check covers
tile limits, intent-only prefetch, URL/filter behavior, event bursts, saved-state
retention, account switches and retries. The production-build browser check
exercises real Next.js routing, confirms no RSC request on filter changes, checks
all divisions and filtered/legacy/direct navigation, and returns to expanded
lists. It uses dummy server credentials and blocks off-localhost browser requests.

## Deployment checkpoint

1. Review this stage's exact diff and run the local checks. Do not run any SQL.
2. Preview/deploy only the matching app changes and tests after approval.
3. Test your signed-in bookmarks and solved/attempted filters, a guest session,
   Show more and back navigation, and a copied filtered question link. Check a
   slow/offline connection shows a retry warning without resetting saved progress.
4. Keep measuring real navigation timings. No production data has been modified
   by this local stage; rollback is the matching app change only.

## Still outside this stage

The Trainer and some other client entry points still use the full catalog.
Existing guest answer checking lazily imports the catalog on submission, even
though it is no longer an initial Question Bank dependency. Listing metadata is
still complete per division (only DOM rendering is progressive); very large
future catalogs may need server-side search/pagination. Detail-page bookmark/
progress/auth reads, tutor retry backoff, broader observability and authorized
hosted 25/50/100/200-user load tests remain separate work.
