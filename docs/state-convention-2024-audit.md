# 2024 FAMAT State Convention Calculus Review

## Sources and Scope

Reviewed all four test pages and all seven answer/solution pages, including the answer key and three solution diagrams, from the user-supplied PDFs:

- `/path/to/Downloads/2024 States Calculus Individual.pdf`
- `/path/to/Downloads/2024 States Calculus Individual Solutions.pdf`

Text was extracted with pypdf; every page was also rendered and visually inspected. Neither PDF contains an official throw-out annotation or dispute log. All 30 existing questions remain present, with no new or duplicate records and no changes to IDs, numbers, difficulty ratings, topics, methods, or answer choices. Original questions 1-30 map to bank questions 177-206, IDs 10177-10206. All 30 answer letters match the supplied key.

Added per-question credits for `2024 FAMAT State Convention`, event `Calculus Individual`, and the original question number. Existing shared delivery and credit components cover Question Bank, Trainer, multiplayer players, spectators, and results; no API or database change is needed.

## Wording and Mathematical Review

Retained the existing source-faithful text, source methods, and alternative solutions wherever correct. Preserved previous repairs for Q2 continuity, Q9 slope sign, Q13 third derivative, Q19 substitution, Q20 geometry and polynomial constant, Q22 substitution sign, Q23 Beta/Gamma factors, Q24 exponents, Q25 differentiated sign, and Q29 whole-line integration by parts.

Additional detail in this review:

- Q2: explain the composition-limit theorem and why the added continuity assumption is necessary. Supply a counterexample to the unqualified original statement.
- Q8: explain why the source's calculation with the reflected curve gives the same area, and show the correct signed-area formula for the actual curve.
- Q11: verify the global revenue maximum by derivative signs and endpoints; explain why squaring preserves order here.
- Q16: include the asymptotic error-ratio factor when taking nth roots of Stirling's approximation.
- Q18: justify 2024 equal half-period integrals and convergence at each improper singularity.
- Q20: preserve the explicit standard upright centered cone/cube assumption and prove the global minimum by factoring the derivative.
- Q21: preserve the source's rounded-log Riemann-sum estimate, but distinguish approximation from equality. Give a monotone left-sum error bound proving B is closest for the actual finite sum.
- Q23: restore the source opening, "One of Legom's eggs," retaining the typographic apostrophe convention already used in the catalog.
- Q25: explain the signed along-tree contact-distance derivative and distinguish sliding speed from total ground-frame velocity.
- Q26: justify even/odd series splitting by absolute convergence at both substitution points.
- Q27: keep the arc-length interpretation, prove the lower and strict upper bounds, and replace the source's discontinuous-derivative example with an explicit continuous triangular spike of area 4. Prove the full attainable interval by continuous interpolation.
- Q29: justify the whole-line boundary limits and improper integration by parts; show the Stirling cancellation and why the other three candidate normalizations give zero.
- Q30: restore the original opening sentence and Gaussian integral, then explicitly supply the preceding definitions and result for standalone delivery. Keep the established difficulty rating unchanged. Expand the one-step source solution with the direct Stirling calculation.

## Original Diagrams

Extracted the three embedded PNGs directly, without redrawing or generative replacement:

- Q18 / bank 194: `mu-194-original-solution.png`, 1353 x 172.
- Q20 / bank 196: `mu-196-original-solution.png`, 322 x 416.
- Q25 / bank 201: `mu-201-original-solution.png`, 387 x 291.

Updated only the existing MathText allowlist entries and dimensions. Diagrams remain solution-only. Old SVG assets are left untouched rather than deleted.

## Verification

Added focused tests for metadata and answer/rating preservation, original PNG dimensions, necessary clarifications, independent integrals, finite-sum error bounds, continuous-spike constraints, the integrating-factor solution, cone optimization, Gaussian moment asymptotics, and the even-coefficient sum. Existing KaTeX/source tests also cover every expression and diagram rendering.

Extended the isolated actual-component browser harness with 1280px and 320px source-credit checks for all five delivery views, hidden-before-reveal checks, original-image loading, and long mobile solution screenshots. These are local fixtures, not hosted database, live-match, capacity, or deployment tests.

Verified results:

- Full unit suite: 551 passed, 0 failed.
- Production webpack build: passed, including TypeScript checks.
- Focused ESLint and `git diff --check`: passed.
- Actual-component browser harness: passed at desktop/mobile widths, including all five credit views, image loading, reveal gating, and no page-level horizontal overflow or KaTeX errors. Long display equations scroll within their containers.
- Visually inspected mobile play, original cone diagram, and full arc-length solution screenshots. Screenshots are under the temporary `question-sources-3THRnN` directory.
- Each of the three PNG files was additionally compared byte-for-byte to its embedded PDF image stream; all matched.

No commit, push, migration, hosted write, or deployment was performed.
