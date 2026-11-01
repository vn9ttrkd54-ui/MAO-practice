# Mu National Publication Hold

## Public repository cleanup — November 1, 2026

The public Git history excludes the restricted question text, choices, answers, solutions, and illustrations. The reference module retains only IDs, labels, and publication-status metadata needed by editorial checks and historical algorithm tests. The notes below document the earlier private-repository migration; statements about retained full content and its content fingerprint describe that earlier state, not the public repository. Publication tests now verify that the reference records contain no problem-content fields.

The owner requested withholding the 2026, 2025, 2024, and 2023 MAO National Convention Mu Individual sets while clear publication permission is pending. This change applies to those four Mu sets only, not other divisions.

## Public Catalog

Removed all 118 retained national records (IDs 10001-10118) from the public Mu catalog. Because every app delivery path uses the approved catalog, this excludes them from Question Bank listings and direct detail links, Trainer metadata/selection/question delivery, multiplayer question pools and content delivery, and practice-result/tutor requests. Previously excluded questions stay excluded.

The 203 approved state-and-below questions are now numbered Mu 1-203, with no reserved national numbers or gaps. Display ranges are:

| Set | Public Mu Numbers |
| --- | --- |
| 2026 States | 1-29 |
| 2025 States | 30-58 |
| 2024 States | 59-88 |
| January 2026 Statewide | 89-116 |
| January 2026 Regional | 117-145 |
| February 2026 Regional | 146-173 |
| February 2026 King Invitational | 174-203 |

All retained question IDs, content, labels, answer keys, and original-source credit numbers remain unchanged. Progress, bookmarks, and history are keyed by stable IDs; no stored data is deleted or reassigned. The public catalog no longer exposes content for past national links or rounds, even if a stored historical ID still exists. Already loaded pages and older deployments are not retroactively erased by a local code change.

## Editorial References

Moved the full national records into `data/question-references/muNationals.ts`, outside the runtime catalog. The reference sets are ordered 2026, 2025, 2024, 2023, with counts 30, 28, 30, 30. Every record is marked permission-pending and has no bank `number` property. IDs remain internal identifiers, not public problem numbers.

`data/question-references/README.md` documents using their difficulty, topic, and method labels to calibrate future approved questions without republishing the national material. A content/label fingerprint matched the pre-move records from Git HEAD exactly. Runtime code must never import this reference directory; tests enforce that boundary.

Source-review tests now locate records using stable IDs instead of treating display numbers as IDs. The old Trainer algorithm golden comparison explicitly uses internal national metadata in its test-only historical fixture; the live selector and catalog never receive those references.

## Verification

Focused tests exercise all 118 hidden IDs through direct bank page rendering, the Trainer catalog, and practice-attempt/result/tutor routes, rejecting them without account, provider, or database access. They also check all 203 consecutive public numbers, unchanged IDs and source credits, exact national content preservation, and the production import boundary. The existing Trainer API regression verifies a 404 for every hidden ID.

Verified results:

- Full unit suite: 557 passed, 0 failed, including all hidden IDs in multiplayer round/result regressions.
- Production webpack build and TypeScript checks: passed.
- Focused ESLint and whitespace checks: passed.
- Actual-component browser checks: passed at 1280px and 320px, including the new Question 1 heading, original-source credits, and no page overflow. Visually inspected both Question 1 screenshots.
- The browser bundle and production server/static JavaScript contain neither the national reference export nor a checked distinctive national prose sample. A static import-boundary regression also prevents runtime imports of the reference directory.
- Repository AGENTS instructions now require future Mu label calibration against the internal references without publishing them.

No database migration, hosted write, commit, push, or deployment is required or performed by this local change.
