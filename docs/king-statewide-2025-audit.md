# 2025 February King Statewide Calculus Individual Audit

## Source and Completeness

- Test: /path/to/Downloads/Calc Feb 2025 KING SW Indiv Test.pdf (5 pages, including cover).
- Corrected solutions: /path/to/Downloads/Calc Feb 2025 KING SW Indiv Ans and Sols - With Corrections.pdf (4 pages).
- Reviewed all nine rendered pages, including highlighted answer-key amendments and every correction note.
- Cover credits C. Leon King High School MAO Statewide Competition, February 1, 2025.
- Source credit on each bank entry: 2025 February King Statewide / Calculus Individual / original question number.
- Imported 29 questions, original numbers 1-29. Original 30 is explicitly thrown out and is excluded, not repaired/reintroduced.
- Stable IDs 10416-10444; public Mu numbers 294-322. Earlier IDs, public numbering, and saved-user-data contracts unchanged.
- No PDF annotations. Test contains two embedded raster images: cover artwork and the shared mathematical graph. Cover branding is not a question illustration; the exact graph is included with questions 27-29.

## Official Disputes

| Original | Supplied Correction | Bank Treatment |
| --- | --- | --- |
| 17 | A to E: statement V is true. | Retain original problem/choices; prove true set I, II, V and derivative-limit value 1/36. |
| 18 | D to E: integral diverges. | Retain original integral/choices; split at interior pole pi/2 and prove both improper pieces diverge positively. |
| 23 | C to A: denominator is the sum of three even-function areas. | Retain graph definitions and choices; clarify area-weighted labeled-region sampling and condition on an even region. Compute (1/5)/(1/3+1/5+1/7)=21/71. |
| 30 | A to TO: G not stipulated to be the preceding function. | Excluded entirely per user instruction, despite a possible mathematical repair. |

Retained corrected answer sequence, originals 1-29:

DDACEABCBDDCDADAEEABDBAACEBCB

## Other Mathematical Repairs

Correct original wording/prose retained with typesetting and additional explanations except where a statement or formula is wrong or ambiguous.

| Original | Repair / Added Verification |
| --- | --- |
| 1 | Explicit long division, oblique slope versus intercept, solve q(x)=4, check denominator. |
| 2 | Show numerator product rule, quotient rule, and all numerical substitutions. |
| 3 | Check graph above axis; logarithmic cancellation and odd-integrand symmetry. |
| 4 | Remove spurious y factor in derivative of e to the y; explain perpendicular-to-normal means tangent slope. |
| 5 | Replace unsupported rational-function/hole and g(6) claims with a product-of-limits proof. Only the limit of g is determined; g(6) need not equal it or even exist. |
| 6 | Explicit substitutions and transformed bounds; clarify "parent function" as antiderivative. |
| 7 | Moving lower bound minus sign and arctangent chain factor. |
| 8 | Use both tangent slope and tangent point to solve the two-parameter system. |
| 9 | Monotonicity proves at most one root; IVT sign check proves existence. |
| 10 | Correct prose to "increasing at the rate"; show chain rule, cosine cancellation, units and direction. |
| 11 | Identify endpoints, interval and width of Riemann sum. |
| 12 | Restrict increasing-accumulation claim to allowed b greater than -3; check repeated root 1 versus sign-changing root 4. |
| 13 | Establish logarithmic limit before exponentiating rather than assuming original limit exists. |
| 14 | Complete nested-exponential second derivative and arithmetic using u, u prime, u double prime. |
| 15 | Correct derivative variable t to x; show given u(0), u prime(0) and inner argument. |
| 16 | Absolute-value factor is nonnegative, not everywhere positive; distinguish stopping from changing direction. |
| 19 | Arctangent/hyperbolic chain rule, cosh identity and exponential-value check. |
| 20 | Correct premature rounding and approximate total 783.6 to exact 16460/21 (approximately 783.8095); rounded answer remains 784. Rate interpreted as group total, consistently with source. |
| 21 | Basic interval additivity, constant scaling and bound reversal. Correctly labeled Integral Properties under user's narrow definition. |
| 22 | Correct the claim that concavity controls left/right error: monotonicity controls those, concavity controls midpoint/trapezoidal error. All five numerical approximations verified. Simpson is exact for this quadratic. |
| 23 | Geometric regions overlap; official area-sum denominator requires counting labeled copies, not geometric union or uniformly chosen functions. Make that experiment explicit so A is uniquely correct. |
| 24 | Printed A places C in exponent; source preceding equation correctly gives x cubed y = e to x + C. Repair A to (e to x + C)/x cubed and verify arbitrary additive constant, on intervals excluding zero. Intended A retained. Other distractors unchanged. |
| 25 | Replace invalid reciprocal-differential notation with actual separated integrals; apply initial value, interval x positive, and check excluded equilibrium. Preserve duplicate wrong options A/D. |
| 26 | Show product equals 4 minus x squared and subtract omitted n=0 term; preserve duplicate wrong options B/D. |
| 27 | Derivative 3 f(3x), graph ordinate -1/2, reversed negative triangle giving F(3/2)=1/8, point-slope line. |
| 28 | Correct stretch language to horizontal compression by factor 3. Also repair C to (0,1/3) union (4/3,2): F prime is increasing through x=5/3, so F is concave up there despite undefined F double prime. Source's split intervals characterize only F double prime exists and positive, not maximal strict concavity intervals. |
| 29 | Correct source's intermediate sign error in k: k=pi/2-3/2. Preserve correct final B. Identify the two separate quarter-circle contributions and verify by G(6)-G(1). |

## Original Graph

- Exact embedded PNG from test page 5, named Image56.png in the PDF.
- Saved as public/questions/mu-442-444-original.png, 290 by 153 pixels.
- No rescaling, tracing, generated replacement, or pixel modifications.
- Shared by originals 27, 28, 29, with full geometry in alt text.
- Standalone versions repeat the common graph description; original 28 explicitly repeats F's definition so it does not depend on displaying another bank entry.

## Labels

All topic/method names already exist in the public bank or internal national references; no new taxonomy. Methods omitted where no useful specific established tag applies.

Difficulty in source order 1-29:

2, 2, 2, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2, 2, 1, 3, 3, 3, 3, 2, 2, 3, 2.

Calibrated against existing public sets and held national references offline. The separable equation matches the difficulty-3 work of internal reference 10076; recognizing an interior improper-integral pole is difficulty 2, not a harder integration exercise. The linear differential equation is simpler than public 10198, which additionally requires integration by parts. Held content remains private and unnumbered.

## Verification and Release

Regression file tests/muKingStatewide2025.test.mjs covers corrected key, excluded 30, source/public numbering, completeness, labels, every KaTeX formula, original image dimensions, corrections, and independent calculations of all major methods. Numeric checks cover improper pole divergence, area-weighted conditioning, both differential equations, graph geometry, and concavity through the join.

Browser source harness covers all 29 solutions at 320px and source credit/original graph in bank, trainer, play, spectator, and results views at 1280px and 320px.

A separate release helper stages only reviewed question-bank work from this chat. It refuses to run off main, against a different origin, or with pre-existing staged changes. It does not include unrelated dashboard/security changes or database migrations. No commit, push or deployment is performed by the import itself.

Completed local verification: 599 tests passed with zero failures; production webpack build, focused ESLint, and git diff whitespace checks passed. The graph matches the original embedded PDF image byte for byte and pixel for pixel. Browser checks passed across all five delivery views and all 29 mobile solutions with no page overflow or broken KaTeX. Screenshots: /var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-1kg9kH. Visually inspected the mobile bank graph and the sampling/concavity corrections. Long display equations remain scrollable within their math containers.

scripts/releaseQuestionBank.sh passed bash syntax validation. Its 53-path manifest was checked for file existence and exclusion of unrelated dashboard, security and migration paths. Only its syntax/manifest were checked; the release script was not executed. It commits and pushes origin/main for the existing Git-connected hosting workflow, not a separately verified live production target. The checkout has no local Vercel project link, so the script does not auto-link or directly deploy a dirty working tree.
