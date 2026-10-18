# January Invitational 2024 Calculus Individual Audit

## Sources and Retention

Read and visually reviewed every page of the three user-supplied PDFs:

- Test: /path/to/Downloads/Calc_Jan_2024_Indiv_Test_Fixed.pdf (7 pages), SHA-256: 10d2569bcfb83e0fa4c0279e778fd9883c7f9b2a59200e1029915cdfc099b3b5.
- Solutions: /path/to/Downloads/Calc_Jan_2024_Indiv_Solutions_Fixed.pdf (10 pages), SHA-256: 4d550cd4f3dd7334b32f2485b8cb8a6998d111024bc78ae23066d03b48c0ff70.
- Errata: /path/to/Downloads/Calc_Jan_2024_Indiv_Errata.pdf (1 page), SHA-256: 3dd6f4f1be65fbe6098ba2cd6d9ebcac734f13961d25fe404c47ea7a53521352.

There are no PDF annotation objects. Printed errata correct originals 3, 21, 26, and 29; no supplied page reports any question thrown out. Retain all 30, with those corrections and additional mathematical repairs described below. Do not mistake the word "Fixed" for evidence that all explanations or key letters are correct.

## Numbering and Credit

Public Mu numbers 382-411, stable IDs 10505-10534. Each record credits "2024 FAMAT January Invitational", "Calculus Individual", and its original paper number 1-30. This follows the title actually printed on the supplied test, not an inferred regional/statewide designation.

The previous 381 public records remain unchanged; their structured SHA-256 is 79efa94c883b6131adaab4885f769cfe9313376adff8b63ccd6f11fb37b3cb57. Existing IDs, progress, bookmarks, and history are not reassigned. All four national sets remain withheld and unnumbered, used only as offline editorial benchmarks.

## Wording and Mathematical Review

Preserve source question wording and choices except the explicitly identified domain/ambiguity repairs below; normalize mathematical typography and whitespace to KaTeX. Preserve correct source solution prose and calculations while adding missing explanations and correcting invalid steps. No diagrams, graphs, or tables appear anywhere in these three PDFs, so no raster or SVG assets are needed for this batch.

| Original | Answer | Review / repair |
| --- | --- | --- |
| 1 | A | Add g nonzero on a punctured neighborhood of 0; otherwise j=k=1 makes the quotient undefined everywhere. Use ln absolute values for the integral so negative same-sign endpoints are covered. |
| 2 | B | The fixed solution misreads three powers as fractions and omits V from its final list. Correct classifications: I, III, V, VI indeterminate; II and IV tend to negative infinity; VII tends to positive infinity. Give examples for all four indeterminate forms. |
| 3 | C | Follow errata: square root and alternating (-1)^n. Pair consecutive terms and rationalize before using limit linearity; summing the divergent individual limits as in the source is invalid. Each of 5000 differences tends to 1/2, so m=2500 and digit sum=7. |
| 4 | E | Maximum sqrt(13), not 13. Establish attainment in the given interval with a phase-shift identity. |
| 5 | E | Composition iterates alternate f and the identity near 0. Derivative sum is -1012, which is not among the listed numerical choices. |
| 6 | A | Preserve exactly the printed h=(2^x/ln2)ln2, which simplifies to 2^x. The fixed solution computes pi ln2/(1-ln2) correctly but labels it D. It is A, because the series starts at derivative order 1. |
| 7 | D | Explain the closed interval [epsilon,1] for IVT; do not apply IVT at the singular endpoint 0. |
| 8 | A | Add p>0, m nonzero, and explicit graph membership. Otherwise normals can coincide or be parallel vertical lines. Show both normal equations. |
| 9 | D | Retain source arctangent optimization, explain tangent is increasing on the relevant angle range, and prove global maximum at 2 sqrt(6) feet. |
| 10 | D | Distinguish the derivative limit defining f from the additional derivative needed for the tangent to f; normal slope is 2. |
| 11 | B | Clarify the universal guarantee for every nonzero real f and an attainable finite real c. Impossible premises for abs(c)<2 are excluded rather than counted vacuously. Prove both coalescing-root cases and construct two-sided counterexamples for every abs(c)>2. |
| 12 | D | Add a>1 to make the source's assumed nondegenerate first-quadrant branch explicit. Explain the two area integrals and cancellation of triangular terms; derivative is sec(2 theta). Negative a does not give the intended bounded region. |
| 13 | A | Unique real intersection (1,1); slopes -1 and 2; acute-angle tangent 3. |
| 14 | D | Retain source difference-quotient proof, with u approaching 0 from the right; value 5/12. |
| 15 | E | Expand chain-rule simplification; value 1/sqrt(17), not any distractor. |
| 16 | B | Specify comparison of numerical rates in a fixed length unit and a positive common growth rate, since area and volume rates have different physical dimensions. Explain both bases and all lateral faces. |
| 17 | B | Make "on the entire real line" explicit; discriminant condition c>=12 gives y-intercept <=-4. Exhibit the attaining cubic. |
| 18 | C | Integrate acceleration with both initial conditions; distinguish radial distance rate from path speed. |
| 19 | C | Replace nonexistent unrestricted global inverse with the local inverse branch g(-5)=-1. f' changes sign globally, but f'(-1)=26 guarantees the local inverse. |
| 20 | C | Explain dx=-1 and differential approximation 191/48, not exact equality. |
| 21 | A | Follow errata's xe^(-x). Retain pattern, supply induction proof of (-1)^n(x-n)e^(-x). |
| 22 | B | Preserve correct similar-triangle and outflow signs; report magnitude 2/pi for "how fast ... decreasing." |
| 23 | C | Explain f is locally constant on (n-1/2,n+1/2), not merely equal to n at integers. Half-integer domain holes do not affect derivatives at integers. |
| 24 | D | Preserve conjugate rationalization, with positive-x division and radical domains explicit. |
| 25 | A | Preserve exact two Newton updates ending -31/23. No new method label is necessary. |
| 26 | D | Follow errata: b'=-1/3 and focal separation rate 2c'=7/4. Distinguish axes from semiaxes and full focal separation from center-to-focus distance. |
| 27 | B | Explain road-position MVT gives 60 mph somewhere; the encounter speeds are unnecessary. |
| 28 | D | Show the unique exponent equation 3k-9=6 and multiply coefficient 2016 by derivative exponent 6. |
| 29 | E | Errata overrides fixed solution A. Add explicit same fixed uniform partition and regularity conventions. Give a positive smooth oscillatory polynomial-plus-sine counterexample on [1,2] with R=2, integral=7/3, T=5/2, L=3; derivative and concavity signs change. Approximation inequalities do not imply the converses of monotonicity/convexity error rules. |
| 30 | C | For x>3 denominator is exactly -1 and numerator exactly 1. |

Corrected answer key, in original order: ABCEEADADDBDADEBBCCCABCDADBDEC.

## Labels and Difficulty

Reuse existing vocabulary only. No question receives Integral Properties: logarithm cancellation, geometry-derived integration, and quadrature error reasoning are not elementary interval/linearity bookkeeping. Methods remain empty for indeterminate-form classification, local floor differentiability, Newton iteration (no existing specific method label), and the quadrature counterexample.

Difficulty snapshot: 2,2,3,1,2,2,2,2,3,2,4,3,2,2,1,3,3,2,2,1,2,2,2,1,2,2,1,2,3,1. Direct calculations are 1; standard combined steps 2; setup/optimization and cancellation 3; the universal limit implication with branch counterexamples is 4. Calibrate against approved bank and offline national metadata without publishing national material.

## Verification

The dedicated test covers every original question with independent arithmetic, finite differences, stable limit evaluations, quadrature, or counterexamples; it also guards keys, numbering, credit, label vocabulary, strict KaTeX, repairs, and the exact preexisting-record fingerprint. The browser harness has a scoped January Invitational 2024 run covering the actual question/solution UI at desktop and narrow mobile widths, with no hosted database writes.

Completed checks:

- All 656 root tests pass, including all 20 new batch tests, vector validation, publication hold, and numbering protections.
- Production webpack build and TypeScript checks pass.
- ESLint passes for changed TypeScript and browser/test files; git diff whitespace check and release-script syntax check pass.
- Scoped browser run passes: every new question and solution in Trainer/results at 1280 and 320 pixels, representative Question Bank/play/spectator credit checks, plus the complete active SVG gallery at 390/1280 pixels. No KaTeX errors, uncaught browser errors, or page-width overflow. Long display equations use the existing horizontally scrollable math containers.
- Manually inspected source 2 desktop, source 11 mobile Trainer, and source 29 mobile results screenshots. Browser evidence: /var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-QlDTSQ.
- Repeated the production build and scoped browser run after final formatting cleanup; both pass. Latest browser evidence: /var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-CmdugJ. Also visually inspected source 6's corrected A choice and geometric-series solution.
- All 67 explicitly scoped release paths exist. The release script was not run: nothing was staged, committed, pushed, or deployed. Unrelated dashboard/security work remains untouched.
