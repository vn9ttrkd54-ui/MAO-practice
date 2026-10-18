# February Regional 2024 Calculus Individual Audit

## Sources and Retention

Read every rendered page of both supplied PDFs, including the answer key and all working:

- Test: /path/to/Downloads/Calc Feb 2024 Reg Indiv Test.pdf (4 pages), SHA-256 e2e872977fbeee62e8f251579b816023b442d386aaf8ac5ed63c404b667ce197.
- Solutions: /path/to/Downloads/Calc Feb 2024 Reg Indiv Ans and Sols.pdf (10 pages), SHA-256 8a22bcd936cf6a98b9ab2109a461c5fd4845c72ba26946f233b83c74c0656793.

PDF text extraction has badly mapped mathematical fonts; superscripts, radicals, bounds, and choices were therefore verified visually, not inferred from extraction. There are no PDF annotation objects, printed dispute notes, or throw-out notices in the supplied pages. Retain all 30 items, repairing errors rather than inventing throw-out status.

Neither PDF contains diagrams, graphs, or tables. Mathematical expressions are typeset directly with KaTeX; no new SVG or raster assets are needed.

## Numbering and Credit

Stable IDs 10565-10594; consecutive public Mu numbers 442-471. Each record credits "2024 February Regional", "Calculus Individual", and its original source number 1-30. The year comes from the supplied filenames; the printed page heading is "February Regional."

The previous 441 public records are unchanged, with structured SHA-256 61c8f1628e0a45a1e58eee9e8e2869aa5301aec51604f82190e2274cd995ee7e. Existing progress, bookmarks, history, and stable IDs are not reassigned. The 118 national references remain withheld and unnumbered; only their offline label/difficulty metadata is used for calibration.

## Wording and Corrections

Preserve the supplied test and choices except the identified ambiguity/error repairs below. Repeat shared definitions so originals 5 and 6 are independently usable. Preserve correct solution equations/prose while adding missing explanations; mathematical typography, dummy variables, and long-expression layout are normalized for KaTeX.

| Original | Answer | Review / repair |
| --- | --- | --- |
| 1 | C | Differential estimate is 2.02. Correct source notation: df is f'(8)dx, not f'(x); the estimated value is f(8.24), not f(8). |
| 2 | E | Parametric derivative is sqrt(2)/4, not any listed numerical option. Use t>=0 to select t=sqrt(2). |
| 3 | A | Replace undefined x(-4) notation with "x when y=-4" along the initial-value solution. Include branch and inverse-function justification; result exp(-pi/4). |
| 4 | B | Denominator is nonzero; direct substitution gives 37/12. |
| 5 | C | Make zero density outside [0,c] and a<b explicit. Normalization factors as (2c-1)(c^3+1)=0. Check nonnegativity as well: minimum on [0,1/2] is 31/16. |
| 6 | D | Repeat density definition and establish support c=1/2 before integrating to 1/4; probability 63/128. |
| 7 | B | Tangent slope -4, normal slope 1/4, intercept -33/2. |
| 8 | D | FTC plus upper-limit chain rule gives 16/3, with integrand continuity around x=2. |
| 9 | A | Source evaluates f(-3) as -9 but correct value is 27. Check both stationary points and both interval endpoints to prove absolute maximum. |
| 10 | E, corrected from C | Sum is 4x/(1-x). Source uses -4ln(x), but correct antiderivative is -4x-4ln(1-x). Integral is -1+ln(81/16), absent from A-D. |
| 11 | A | Distinguish outer total sphere volume from added ice volume; r^3=864 after 12 seconds and dr/dt=5 cbrt(4)/192 mm/s. |
| 12 | C | Rename dummy variable t to avoid shadowing upper limit x. Integrate and solve b=15. |
| 13 | B | Stem explicitly refers to Rolle hypotheses. Statement III uses existence of c in (a,b), not an arbitrary "given point." Explain endpoint differentiability is not required, with a counterexample. |
| 14 | A | State x is fixed, separate x=0, and handle negative x by absolute values. Show a_n tends to zero and then bound abs(a_n^n)<=2^(-n); do not informally substitute 0 into a varying exponent. |
| 15 | B | Source working prints lower limit -2 in places, while the test and final arithmetic use 0. Split at x=2 using the actual [0,4] bounds; result 32. |
| 16 | C | Solve MVT derivative equation, rejecting -2 outside the interval; c=8/3. |
| 17 | E, corrected from D | Step size must be full width divided by four: h=pi/6, h/3=pi/18. Correct Simpson approximation is pi(18+16sqrt(3))/54, absent from the choices. The source also mishandles the radical coefficient. |
| 18 | A | Restore the missing 1/ln4 when changing base-four log to natural log; limit is still 0. |
| 19 | C | Show four-derivative cycle, 82 full zero-sum groups, and two remaining terms; result -2cos(x). |
| 20 | B | Intersect f'>0 and f''>0 intervals; answer (-2+sqrt(8),infinity). |
| 21 | E, corrected from D | Source changes a y dx term to x dx. Correct derivative is (y/x-2xy^2-3x^2y)/(x^2y-1), not printed D. Preserve choices; make real-log and finite-derivative domains explicit. |
| 22 | B | Standard exponential limit with coefficient ratio 5/10 gives sqrt(e). |
| 23 | D | Ordinary algebraic u=x/2 substitution gives atan(x/2)/16+C. This is not radical-based Trigonometric Substitution. |
| 24 | A | Define ceiling explicitly. Split into three constant-ceiling intervals and explain isolated integer endpoint values do not affect the integral; result 88. |
| 25 | E, corrected from B | Washer area is pi(R^2-r^2), not pi(R-r)^2. Correct volume 511pi/5 is absent from choices. Source's B=812pi/15 correctly evaluates its wrong setup, not this solid's volume. |
| 26 | D after explicit prompt repair | Original equation has no real point: z+1/z=1 has discriminant -3. The specified (pi/4,pi/4) has left side 5/2. Change RHS from 1 to 5/2, explicitly disclosed, preserving source point, derivative calculation, and intended slope 1. |
| 27 | A after explicit prompt repair | Rest at t=0 contradicts v(4)=14. Remove "from rest," retain initial position 0 and v(4)=14 as used in source working. The repaired v(0)=-18 and s(4)=-72 m. Also correct source's s(3) label to s(4). |
| 28 | C | Track u=1+x bounds and numerator u-1; integral 1/12. |
| 29 | D | Use right endpoint gap heights above y=10 at x=4,5,6: 50,87,132; sum 269. Clarify source's shifted endpoint indexing. |
| 30 | D, corrected from C | Source correctly computes one-sided limits +1 and -1 but selects the left-hand value as the two-sided answer. Different limits imply DNE. |

Only source answer letters 10, 17, 21, 25, and 30 change. Originals 26 and 27 retain their intended keys only after the explicitly recorded prompt repairs; they must not be presented as untouched source wording.

Corrected key: CEABCDBDAEACBABCEACBEBDAEDACDD.

## Label Calibration

Use existing canonical vocabulary only; methods remain empty when a useful specific technique is unnecessary. No Integral Properties label is added, because these integrals involve evaluation, substitutions, ceiling/sign splits, probability, or geometry, not elementary interval bookkeeping. Washer cross sections use the established Cross Sections label rather than creating a one-off method.

Difficulty by original number:

1,2,3,1,2,2,1,2,2,2,3,2,2,2,2,2,3,1,2,2,2,1,1,2,3,2,2,2,1,1.

Routine direct calculations are 1; standard multi-step calculations or conceptual distinctions are 2; initial-value branch work, geometric related-rate setup, arc-length quadrature, and annular-volume setup are 3. No automatic late-test 4/5 ratings. Compare mathematical work to the approved public bank and offline national metadata.

## Verification Scope

The dedicated tests independently check every source item through exact arithmetic, numerical derivatives, actual implicit branches, termwise integration, quadrature, density/domain checks, and counterexamples to contradictory original data. They also guard the previous-record fingerprint, corrected keys, IDs, credit, labels, difficulty, and strict KaTeX.

The scoped browser run covers every new question/solution in Trainer/results at desktop/mobile sizes, and the longest expressions plus repaired prompts across Question Bank/live play/spectators/results. Tests use isolated local fixtures and do not write hosted data.

## Completed Verification

- All 699 root tests pass, including the 21 new batch checks, vector checks, label consistency, and national-publication hold checks.
- Targeted ESLint, production webpack build, release-script syntax, and diff whitespace checks pass.
- The scoped February Regional 2024 browser run passes at desktop/mobile sizes with no uncaught errors, invalid KaTeX, or page overflow. It captures 178 screenshots, including all 30 revealed solutions in Trainer/results and the active vector gallery.
- Manually inspected the narrow-screen Simpson, implicit derivative, repaired curve, and repaired motion solutions, plus the desktop washer solution. Long display equations scroll within their containers on narrow screens.
- Local screenshot evidence: `/var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-PCK1Rf`.
- All 75 explicitly scoped release paths exist. Unrelated dashboard/security changes remain outside the release script's staging list.
- No commit, push, or deployment was performed. These are local validation results, not proof of a hosted deployment.
