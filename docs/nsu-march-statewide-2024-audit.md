# NSU March Statewide 2024 Review

## Sources and Publication

- Test: `/path/to/Downloads/Calc Mar 2024 NSU SW Indiv Test V3.pdf`, five pages. SHA-256 `20b090c8c5fe9be6be789f266c6c0eb12082991fdda7adc9854c24688f578227`.
- Answers and solutions: `/path/to/Downloads/Calc Mar 2024 NSU SW Indiv Ans and Sols.pdf`, four pages. SHA-256 `710755f337a469163f3061f191507fc26304820cb3f61b2cd3a94317afd316f5`.
- All nine pages were rendered and visually inspected. Text extraction was used only as an aid; visible formulas and tables were checked against rendered pages. No printed dispute/throw-out notes or PDF page annotations occur in either file.
- Retain all 30 originals. Do not infer official exclusions merely from the errors found during review.
- Every record credits `2024 March NSU Statewide`, `Calculus Individual`, original question number 1-30. Printed headings say NSU March Statewide; year comes from the supplied filenames.
- Stable IDs **10652-10681**, public numbers **529-558**. The previous 528 approved records are unchanged; JSON SHA-256 `ee1abb3c1b54348f49bede23f3a9cbdc50142aa7ad7e652c952a7cbc3e422574`.
- National reference sets remain unnumbered and unpublished, with no runtime import or newly copied public national content. They are offline calibration benchmarks only.

## Source Art

Originals 5 and 6 share one standalone SVG: `public/questions/mu-nsu-statewide-2024-table.svg`. All 30 cells (five rows, six columns) are preserved, including signs and derivative marks. It contains only vector paths, shapes, and text, with an accessible title/description. No other source figures occur; no raster assets or solution-only illustrations are added.

## Review and Repairs

Only originals **13 and 16** change answer letters. No throw-outs are documented. Sound wording and answer choices are retained, with minimal explicit domain/ambiguity repairs and expanded solutions where the source skips needed reasoning.

| Original | Answer | Review |
| --- | --- | --- |
| 1 | C | Direct limit is 1; do not mistake the expression for an exponential limit with an absent power n. |
| 2 | D | Differentiate -cos(x) to verify the antiderivative; explain arbitrary constant. |
| 3 | B | Chain rule gives (2x-1)/(2sqrt(x^2-x+1)); radicand is always at least 3/4. |
| 4 | A | Impact t=2; velocity -64 ft/s but speed 64 ft/s. |
| 5 | D | Chain rule uses f'(g(2))g'(2)=f'(5)*10=-100. Share exact table. |
| 6 | B | Product rule (-8)*3+1*15=-9. Share exact table. |
| 7 | A | Squared root at 1 does not change derivative sign; 2 is a local minimum. Correct source's x=0 typo to x=1. Printed duplicate incorrect choices B and D are retained; the correct choice remains unique. |
| 8 | B | Split absolute value at zero; two positive triangle areas sum to 1. Label Absolute Value, not Integral Properties. |
| 9 | B | Specify maximal increasing intervals, since A and C are smaller increasing subsets. Derivative (x+1/2)^2+3/4 is positive everywhere. |
| 10 | A | Both points at x=1 matter: (1,0) has slope 1 and (1,1) slope -1. Correct source branch notation y'(0), which incorrectly suggests a different x-input. |
| 11 | C | Distance sqrt(x^2+x^3) has dD/dx=11/4 at 3, yielding dx/dt=4. Distinguish radial rate from arc speed. |
| 12 | A | Add positive rational coefficient domains and positive square-free integer B for the requested normal form. Restore omitted 1/2 polar-area factor. Area 20sqrt(3)-20pi/3 gives ABC=400. |
| 13 | C, corrected from B | Reflection gives 2I=int f=48, so I=24, not 12. Fix substitution bounds/signs. The conditions also force f=1, g=2, independently checking 24. |
| 14 | C | Specify real domain x>0. Log differentiation gives x^x(ln(x)+1). |
| 15 | A | Lower endpoint is improper but integrable; y=2exp(x^2/2) gives derivative 2x exp(x^2/2). Justify FTC at positive upper limit. |
| 16 | E, corrected from D | Preserve finite sums and explicitly interpret the zero endpoint as improper. For every n>=1, integrand behaves like (-1)^n/x^n, so integral diverges with alternating signs. Source drops the geometric remainder where abs(cot x)>=1 and substitutes an unrelated convergent integral. No finite requested limit exists. |
| 17 | B | Mixed sine terms vanish at zero; abs(f''(0))=sum k^2=4900=2^2*5^2*7^2. Largest prime 7. Preserve every cosine factor, but place the long product in the established scrollable display-math container to avoid mobile page overflow. |
| 18 | C | Handle degree 0/1 explicitly, then n=2n-3 gives cubic. Coefficients force f=0 or 4x^3/9; f(3) sum 12. Repair missing plus in source coefficient display and ambiguous fractional formatting. |
| 19 | D | State real C1 function and identity for all real x. Differentiate to a zero square, f'=f; verify both signs satisfy original identity and product -8096. |
| 20 | C | Parameter equations give a=6,b=-10. Verify actual strict maximum with f''(3)=-1/4; source second derivative incorrectly differentiates -2bx. |
| 21 | A | Repeat original 20's function and value/stationarity conditions so it is standalone. Derive parameters and negative second derivative rather than referring to a previous question. |
| 22 | B | Supply missing geometry: fixed diameter base 2, maximum height 1 on perpendicular diameter; isosceles right triangle, hence B. |
| 23 | B | Difference e^x-x-1 has unique global minimum zero at x=0, giving one root. |
| 24 | A | Explicitly state defined/nonzero everywhere. Extend source polynomial-only proof to R=P/Q and show both polynomial ratios tend to 1. |
| 25 | E after explicit continuity repair | Original nonnegative assumption forces only f=0 almost everywhere; arbitrary singleton spikes invalidate source point-value inference. Add continuity on [0,1] to make intended conclusion f identically zero valid. Then c=0 and the only possible f(1/2) is 0, absent from A-D. Explain why this is an added hypothesis, not original wording. |
| 26 | D after endpoint repair | Position undefined at zero. Change interval 0<=t<=3 to 0<t<=3. Velocity 5(t-10)/t^3 is negative throughout; no direction change. |
| 27 | B | Correct geometric expansion signs: polynomial division gives x^2-x+1+1/(1+x). Degree-10 coefficient is 1, derivative 10!, with v3=3+1=4. Source's incorrect 3*10! would actually have valuation 5. |
| 28 | E | Give full scaled reciprocal substitution u=2024/x and separate convergence of upper and lower tails. Value 0 is ordinary improper, not merely principal value. The source's bare reciprocal hint omits scale and endpoint justification. |
| 29 | D | Correct source's shifted bounds: integral_0^1 dx/(1+x), or integral_1^2 du/u, equals ln2. |
| 30 | C | Specify real odd-root interpretation of negative-base rational powers; denominators are odd because -0.24=-6/25. Absolute root limit 2024^(-20)<1 proves absolute convergence. Explain n=0 finite term. |

Source key: `CDBADBABBACABCADBCDCABBAEDBEDC`.

Corrected key: `CDBADBABBACACCAEBCDCABBAEDBEDC`.

## Label Calibration

Established labels only, with empty method lists where no useful specific method fits. No Integral Properties label is added; reflection arguments use Symmetry, absolute-value integration uses Absolute Value, and substitution is named only where it is the operative technique. No new vocabulary is necessary.

Difficulty by originals 1-30:

`1,1,1,2,2,2,2,1,2,2,2,3,3,2,2,3,3,3,3,2,2,2,2,2,3,2,3,4,2,3`.

The oscillatory improper integral is 4 because a valid ordinary evaluation requires convergence at both endpoints and a scaled reciprocal argument. Standard direct computations are 1/2; polar overlap, moment positivity, finite-sum divergence, coefficient/degree classification, and nonstandard-power convergence arguments are 3. Compare actual work to approved public and offline national examples; do not inflate solely by source question number.

## Verification Scope

Dedicated tests cover every retained original, correct keys, credit, consecutive public numbering, stable IDs, the previous-record fingerprint, labels/difficulty, strict KaTeX, source table values, and disclosed repairs. Independent checks include actual implicit branches, moment spike counterexamples, polynomial coefficients, the original integral equation for both signs, prime valuations, finite cotangent leading terms, reciprocal quadrature and a second phase substitution for the oscillatory integral, and exact rational exponent denominators.

Browser coverage includes every revealed solution in Trainer/results at desktop/mobile widths, plus representative table/changed-key/repaired/long prompts across Question Bank, Trainer, play, spectators, and results. All active SVGs are checked for decoding, XML validity, and nonblank canvas pixels. These isolated local fixtures do not write hosted data.

Completed locally:

- All **767 root tests** pass, including 24 new batch tests, `tests/questionVectors.test.mjs`, canonical labels, and national-publication guards.
- Targeted ESLint, production webpack/TypeScript build, release-script syntax, and whitespace checks pass.
- The first browser run found page overflow from original 17's long inline cosine product. Moving the unchanged expression into the established display-math container fixed it; no component/CSS change was necessary. All root tests and the production build were rerun after that fix.
- Final `node tests/questionSources.browser.mjs --nsu-statewide-2024-only` passes with 200 screenshots: 120 revealed solutions, 70 representative cross-view prompts, and ten active-vector galleries. No invalid KaTeX, uncaught page errors, raster question requests, or page overflow. Both table questions decode the same SVG at its expected width.
- Manually inspected the table and corrected product layout on mobile, original 13's corrected solution on desktop, original 16's divergence explanation on mobile, original 25's continuity repair in mobile results, and original 28's complete ordinary-improper proof on desktop. Long display equations retain horizontal scrolling inside their containers.
- Final screenshot evidence: `/var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-YJWOJ6`.
- All 85 explicitly scoped release paths exist. Branch main and origin match the reviewed repository. The release script includes the new audit, batch test, and SVG, leaving unrelated dashboard/security files outside its staging list.
- No commit, push, hosted write, or deployment was performed. These results verify local behavior, not a hosted release.
