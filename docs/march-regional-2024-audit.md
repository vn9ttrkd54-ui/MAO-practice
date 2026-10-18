# March Regional 2024 Review

## Sources and Retained Questions

- Test: `/path/to/Downloads/Calc Mar 2024 Reg Indiv Test.pdf`, five pages. SHA-256 `9c1942bd15d4749c002eaf884f8144784b738f33d88462f73c8dc44e7c38f861`.
- Answers and solutions: `/path/to/Downloads/Calc Mar 2024 Reg Indiv Ans and Sols.pdf`, four pages. SHA-256 `96c4c20ea3c4b87c4572b39df30775b9f85f1291f4880dfaf3b9b716afab8c01`.
- All nine pages were rendered and visually reviewed. Test text extraction is empty; solution extraction has damaged math mappings. Visible pages are the transcription authority. The printed heading is March Regional; the year comes from the supplied filenames.
- No printed dispute/throw-out notes occur in either supplied file, and neither PDF has page annotations. Retain all 30; do not infer that flawed questions were officially thrown out.
- Source credit on every record: `2024 March Regional`, `Calculus Individual`, original number 1-30.
- Stable IDs **10622-10651**, public display numbers **499-528**. The preceding 498 public records are unchanged, guarded by JSON SHA-256 `3feaac209e366fcc2024e0491f423754e6e6c1d5105ff41d1a51734d32675647`.
- National reference records remain unnumbered and unpublished. They are used only offline for label/difficulty calibration.

## Illustrations

Three standalone vector files, shared by their corresponding groups:

- `mu-march-regional-2024-function.svg`, originals 9-11: unit grid, source branch geometry, cusp at -2, corner at 0, vertical tangent at 2, filled (4,-2), open (4,1), corner (5,0), filled (7,2). The unlabeled left endpoint is drawn at its approximate source height between 3 and 4; no exact endpoint value is asserted. Left branches are vector tracings, not claims of specific algebraic formulas.
- `mu-march-regional-2024-derivative.svg`, originals 14-16: qualitative derivative shape, axis crossings/touching, negative slope at 4, labeled positive areas 8 and 6. The labels are the given exact integrals; no invented formula for the illustrated curve is used in solutions.
- `mu-march-regional-2024-table.svg`, originals 21-23: every x, f(x), and f'(x) entry preserved exactly.

All use native paths, shapes, and text with accessible titles/descriptions. No PNGs, embedded bitmaps, or solution-only figures are added. Shared test instructions are repeated where needed so each question stands alone.

## Mathematical Review and Repairs

Preserve valid wording and choices. Expand source explanations where steps or justification are missing; explicitly disclose substantive repairs. Only original **25** changes its answer key. Originals **23** and **30** require prompt repairs but retain intended keys.

| Original | Answer | Review |
| --- | --- | --- |
| 1 | D | Cosecant has a pole at pi in [2,4]. Verify the other three denominators/domains are safe. |
| 2 | D | Chain rule gives e^x/(e^x+1). |
| 3 | B | Quotient limit -1/4. Source alternative mistakenly evaluates g(x)=1/(x-2) at 2, where undefined; correct derivative input is 4. |
| 4 | D | Acceleration is the second time derivative, k/sqrt(t). Explicitly restrict to 0<t<=8, excluding singular t=0. |
| 5 | C | Horizontal width 4y-3-y^2 on y in [1,3] integrates to 4/3. |
| 6 | E | Even power yields x=+/-2; product -4 is missing from A-D. |
| 7 | B | Make positive radial rate and great-circle circumference explicit; cancel nonzero dr/dt to get circumference 1. |
| 8 | C | Derivative -2/(x-2)^2 equals -2 at x=1,3; both in domain. |
| 9 | A | Separately evaluate left limit at 4 as -2 and right limit at 0 as 2; difference -4. |
| 10 | D | Five failures: -2 cusp, 0 unequal slopes, 2 vertical tangent, 4 jump, 5 corner. Open interval excludes endpoints. |
| 11 | B | u=x+6 transforms bounds 1,-2 into 7,4. Negative of two triangle areas gives -2.5; isolated f(4) does not alter area. |
| 12 | A | Tangent approximation 2, strict underestimate by positive second derivative. |
| 13 | B | Intersect increasing (0,2) and concave-up x<1 to get (0,1). |
| 14 | A | FTC and first positive area give f(0)=-4-8=-12. |
| 15 | B | Integration by parts gives [xf']_2^4-int f'=-6. Correct source intermediate x'f(x) typo to xf'(x). |
| 16 | C | Area gives f(4)=2, graph height f'(4)=0, displayed curve's negative slope f''(4)<0. |
| 17 | E | Verify supplied point lies on implicit curve and finite derivative coefficient is nonzero; slope -1/2 absent from A-D. |
| 18 | E | I and II converge to 1 and 2; III has primitive sqrt(x^2-1) tending to infinity. I-and-II-only is not listed. |
| 19 | B | Right sum of x on [3,7] equals 20. Shifted integral in choice D is valid but its stated 32 is false. |
| 20 | D | u=1+sin(x), bounds 1 to 2, result 2sqrt(2)-2. Ordinary U-Substitution, not Trigonometric Substitution. |
| 21 | A | Table heights 20,16,8,2 give left sum 92, overestimate. Source prose says 14 and 4 but its final arithmetic is correct. |
| 22 | B | Product derivative at 2 is 16+2(-6)=4; normal slope -1/4. |
| 23 | C after explicit prompt repair | Original unrestricted existence question has A, B, C true: derivative Darboux property between f'(2)=-6 and f'(6)=-2 proves A, hence B, while MVT proves C. Clarify direct application of MVT to f using the interval's tabulated endpoint values, for which only C has secant slope -3. Explain original ambiguity in solution; do not falsely reject A/B based only on differing secant slopes. |
| 24 | B | Square side sqrt(4-x^2), so integrate 4-x^2 over [-2,2] to obtain 32/3; no disk pi factor. |
| 25 | D, corrected from A | II simplifies to 2x/(1-x^2), limit 0: numerator/denominator degrees 6 and 7, not both 6. III in test is x->+infinity, giving 1; source evaluates -infinity, giving 3. I and II vanish, not I only. Preserve all printed expressions and choices. |
| 26 | C | Differentiability forces continuity a=1 and matching derivative b=2; also verify sufficiency. |
| 27 | A | Repeat shared piecewise function and derive a,b independently. Piecewise integral equals 1/3+pi. |
| 28 | C | Positive radicands near 0 justify logs. Finite sum has 500 even-index and 499 odd-index factors; y(0)=1, derivative 1. |
| 29 | C | Ratio-test radius is 2; test both endpoints as positive p-series to get interval [0,4]. Correct source's radius/interval terminology. |
| 30 | B after sign repair | General pattern n=15 has positive final degree-60 term; source final minus contradicts its own pattern. Change only that sign and specify n=1..15. Degree-24 coefficient remains -1/6!, giving derivative -24!/6!. |

Source key: `DDBDCEBCADBABABCEEBDABCBACACCB`.

Corrected key: `DDBDCEBCADBABABCEEBDABCBDCACCB`.

## Label Calibration

Use established topics/methods only. No Integral Properties label is added: this batch's integral tasks require actual evaluation, graph areas, substitution, integration by parts, or geometric setup, not elementary interval bookkeeping alone. Methods may be empty. No new vocabulary is necessary.

Difficulty by original 1-30:

`1,1,2,1,2,2,2,2,1,2,2,2,2,2,2,2,2,3,2,2,1,2,2,2,2,2,2,2,3,2`.

The 1000-factor derivative is a standard logarithmic-differentiation/counting exercise, not an automatic high-difficulty item. Multi-improper-integral analysis and endpoint-tested power-series convergence receive 3. Calibrate against approved public examples and offline national metadata without importing references into runtime code.

## Verification

The dedicated suite guards source keys, original numbers, IDs, all earlier-record content, canonical labels/difficulty, strict KaTeX, shared SVGs and table cells, independent mathematical checks for every retained original, actual implicit branch behavior, and a strictly decreasing C1 Hermite interpolant demonstrating the original MVT ambiguity. Source figures are tested as vectors, not raster crops.

The scoped browser run checks all 30 revealed solutions in Trainer/results at desktop/mobile sizes plus representative graph/table/repaired/long prompts in Question Bank, Trainer, play, spectators, and results. It checks image decoding, source credit, actual KaTeX, errors, page overflow, and all active SVGs. These local fixtures do not write hosted data.

Completed locally:

- All **743 root tests** pass, including 22 new batch tests, `tests/questionVectors.test.mjs`, canonical labels, and national-publication guards.
- Targeted ESLint, production webpack/TypeScript build, release-script syntax, and whitespace checks pass.
- `node tests/questionSources.browser.mjs --march-regional-2024-only` passes after correcting the test fixture's image-width callback argument. No application error or content change was needed for that fixture repair.
- Final browser run captures 190 screenshots: 120 revealed solutions, 60 representative cross-view prompts, and ten active-vector gallery screenshots. No invalid KaTeX, uncaught page errors, raster question requests, or page overflow. All new shared images decode at their expected intrinsic dimensions.
- Manually inspected both source graph recreations and the table in desktop/mobile galleries, mobile graph/integration-by-parts/MVT table views, the corrected limit solution, desktop MVT ambiguity explanation, and the mobile Taylor prompt/solution. Long display formulas retain the established horizontal scrolling within their containers.
- Final screenshot evidence: `/var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-gmyIvf`.
- All 82 explicitly scoped release paths exist. Branch main and origin match the reviewed repository. The release script includes this batch's audit, test, and three SVGs; unrelated dashboard/security files remain outside its staging list.
- No commit, push, hosted write, or deployment was performed. These checks establish local behavior, not hosted deployment status.
