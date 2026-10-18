# February King Statewide 2024 Review

## Sources and Publication

- Test: `/path/to/Downloads/Calc Feb 2024 KING SW Indiv Test.pdf`, five pages including cover. SHA-256 `cb0296e2c81a5afa753ee5cbc3657ca3adbfc02b6b6d7e2a84de2c490f1dbf23`.
- Answers, solutions, and errata: `/path/to/Downloads/Calc Feb 2024 KING SW Indiv Ans and Sols with ERRATA.pdf`, four pages. SHA-256 `debc92ee32bb7afdd52d00e12a9f16dffaa714ea5acb238bf3598ee26e07cc6d`.
- All nine pages were rendered and visually inspected. Text extraction has damaged math mappings and out-of-order formulas; the visible pages are the transcription authority. The reader reports malformed PDF object offsets, but both files render completely.
- Cover credit: C. Leon KING High School MAO Statewide Competition, February 17, 2024; page headers call it KING Invitational. Public credit follows the existing King statewide convention: `2024 February King Statewide`, `Calculus Individual`, with each original question number.
- Exclude exactly the documented thrown-out originals **12, 25, and 28**. Do not repair or publish them.
- Retain 27 originals: 1-11, 13-24, 26-27, 29-30. Stable IDs **10595-10621**; public display numbers **472-498**.
- All 471 preceding approved records are unchanged. Their JSON SHA-256 is `9fcc56cdd09bb574c5d9d5331779f05331895f263e3c0a77fc907a7421d95774`.
- National reference sets remain unnumbered and unpublished; offline metadata only is used for calibration.
- No question or solution diagrams/tables occur in either source. The decorative cover logo is not a question illustration. No raster assets or new SVGs are needed.

## Errata and Editorial Decisions

The source explicitly disputes 11 from A to E, 29 from B to D, and 30 from C to E. All three corrected answers are independently verified. Sound problem wording and answer expressions are retained; changes below address errors, missing assumptions, or insufficient explanations. Solutions retain valid source reasoning and expand omitted steps.

| Original | Answer | Review and changes |
| --- | --- | --- |
| 1 | C | Generalized product rule gives 6+3+2=11. |
| 2 | B | Prove global minimum -1/e using derivative sign on both sides of -1, not merely stationarity. |
| 3 | D | Correct grammatical "with" to "when" and restore pi in the solution's last equality; area rate 6pi. |
| 4 | A | Factor (x-1)^2(x+2); cancellation applies only off the approached point, giving limit 0. |
| 5 | B | Spell out product rule and both nested chain-rule factors. |
| 6 | B | Correct solution paragraph's A label; source key and concluding text already give B=e. |
| 7 | D | Explain that the three signs persist on a neighborhood of 5; local derivative 4. |
| 8 | A | Repair source triangle-area symbols to (AB)(BC)sin(B)/2. Prove unique global maximum 1/27 on (0,1) by derivative signs. |
| 9 | C | Tangency point (1,11), slope 5, line 5x+6; intercept -6/5. |
| 10 | C | Track transformed bounds and minus sign under u=1-x^2; result 1/22. Ordinary U-Substitution, not Trigonometric Substitution. |
| 11 | E, official dispute | Prompt says conclusion, not hypothesis, and states c in (0,27). Correct average slope is 1/9, yielding c=3sqrt(3); source incorrectly uses slope 1 and interval (0,4). Endpoint nondifferentiability at 0 does not violate MVT. |
| 12 | Excluded | Officially thrown out. At x=1 its equation and supplied f(1)=2 contradict; no public record. |
| 13 | A | Restore missing pi factors. Surface and volume rates give r=8. |
| 14 | B | Difference of fourth powers reduces to -cos(2x), derivative 2sin(2x). |
| 15 | C | Prove necessity b+c=0 with Taylor expansion instead of reversing L'Hopital's implication. Then sine terms cancel exactly, a=50. |
| 16 | A | Define ellipsis explicitly as sum (k+1)/n^k, k>=0, n>1. Sum the whole series to (1-1/n)^(-2); limit e^2, with rigorous tail handling. |
| 17 | C | Preserve source x>=6. Differentiate the composition before integrating: 36x^3+24x gives 9x^4+12x^2+C. Explain that renamed inputs u only satisfy u>=114, not every u>=6. |
| 18 | B | Quotient derivative -1/2 at (3,10), normal slope 2, line 2x-y+4=0. |
| 19 | D | Logarithmic differentiation valid locally near e; f(e)=1, f'(e)=e^(e-1). |
| 20 | B | Both one-sided limits 14 while f(2)=24; preserve piecewise formula. |
| 21 | D | Specify integer n>=3 and x>0: original omits integer/domain assumptions and C=D when n=1 or 2. Add missing standard fifth choice E=NOTA, preserving A-D. Prove nth derivative n!(ln(x)+H_n) by induction, then next derivative n!/x. |
| 22 | B | Cosine tenth derivative is -cosine. Explain arbitrary polynomial addition of degree at most 9 and "could be". |
| 23 | A | Reverse derivative quotient gives -8ln2=-ln256. Correct source f'(2^x) notation to f'(x) evaluated at 3. |
| 24 | D | Compute volume-rate/surface-rate in correct order at side 3; 54/72=0.75. |
| 25 | Excluded | Officially thrown out; no public record. |
| 26 | B | Show reflection x->-x, reciprocal-denominator identity and bounds, yielding I=1. Label Symmetry, not Integral Properties. |
| 27 | C | Explain improper endpoint convergence and justify power-series integration by monotone convergence of the nonnegative negative-integrand series; -pi^2/72. |
| 28 | Excluded | Officially thrown out; no public record, even though the printed solution suggests a repair. |
| 29 | D, official dispute | Positive square roots are 2-sin^2(x) and 2-cos^2(x), so numerator is 3, not 1. Improper integral 3pi/2. |
| 30 | E, official dispute | Clarify singleton removal, disappearance of empty piles, two nonempty parts, and allowance to split a different pile. Supply legal constructions for every listed size. Source invariant fails on singleton deletion. Size 8 construction uses 191 turns and ends with 186 piles. |

Corrected retained key, in original-number order: **CBDABBDACCEABCACBDBDBADBCDE**. No additional answer changes beyond the three official disputes. Source paragraph 6's mislabeled A is not its answer-key entry.

## Label Calibration

Existing topics/methods only. Routine differentiation/limits are 1; standard multi-step setups are 2; general higher-derivative proof, reflection integration, improper series/radical integration, and the corrected combinatorial construction are 3. No automatic late-test difficulty inflation to 4/5. Methods remain empty when no useful specific existing label fits.

Difficulty by retained original order:

`1,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,3,1,1,2,3,3,3,3`.

No Integral Properties usage is added. The sole ordinary substitution item is labeled U-Substitution. No new vocabulary or runtime national-reference import is introduced.

## Verification

The dedicated batch suite checks every retained original using independent derivatives, signs, quadrature, exact algebra, MVT substitutions, derivative coefficient recursion, endpoint-regularized integration, and legal move-by-move pile simulation. It also guards exclusions, keys, source numbers, stable IDs, previous-record fingerprint, labels/difficulty, and strict KaTeX.

Browser coverage checks every retained solution in Trainer/results at desktop/mobile sizes and representative long/repaired prompts across Question Bank, Trainer, play, spectators, and results. These isolated local fixtures do not write hosted data.

Completed locally:

- All **721 root tests** pass, including 22 new batch tests, question-vector tests, canonical labels, and national-publication guards.
- Targeted ESLint, production webpack/TypeScript build, release-script syntax, and whitespace checks pass.
- `node tests/questionSources.browser.mjs --king-statewide-2024-only` passes. It captures 176 screenshots: 108 revealed solutions, 60 representative cross-view prompts, and eight active-vector gallery screenshots. No invalid KaTeX, uncaught page errors, raster question requests, or page overflow.
- Manually inspected mobile piecewise/MVT/higher-derivative/stone-pile views and the desktop corrected radical-integral solution. Existing narrow-screen math containers retain horizontal scrolling for long display equations; no unrelated UI styles were changed.
- Browser evidence: `/var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-DGX8tC`.
- All 77 scoped release paths exist. The release script includes this batch's audit and tests and leaves unrelated dashboard/security files out of staging. Current branch is main and origin is the reviewed MAO-practice repository.
- No commit, push, hosted write, or deployment was performed. Local checks do not establish deployed behavior.
