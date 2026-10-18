# February Regional 2025 Calculus Individual Audit

## Sources and Scope

- Test: `/path/to/Downloads/Calc Feb 2025 Reg Indiv Test.pdf`, all four pages visually reviewed.
- Answers and solutions: `/path/to/Downloads/Calc Feb 2025 Reg Indiv Ans and Sols.pdf`, all six pages visually reviewed, including the answer key.
- Test SHA-256: `0cbba42c5c731de6f1d6a066bcb4190d1745ac96ab1f1395e686e11771886237`.
- Solutions SHA-256: `80772548464b829ec07ccf39cd330db10efbd07f6c2e92f8b178715e046b3be6`.
- The supplied documents contain no dispute or thrown-out notices and no PDF annotations. All 30 source questions are retained. This records the supplied evidence, not a claim about notices outside these files.
- No question or solution figures occur on the supplied pages. No raster assets or unnecessary replacement illustrations were added.

## Publication and Credit

The new set uses stable IDs `10445` through `10474`, public Mu numbers `323` through `352`, and independent original source numbers `1` through `30`. Every record credits competition `2025 February Regional`, event `Calculus Individual`.

All 322 preexisting public Mu records are unchanged, including their full text, ratings, methods, answers, IDs, and image metadata. Their serialized SHA-256 remains `0c4948abec014a80f25041eff9a5643cbf845075b781c0d9d57fb40771ffd7b6`. Permission-pending national records are editorial calibration references only, remain unnumbered, and are not imported into runtime code.

## Wording and Solution Review

Problem wording and choices follow the supplied test, with mathematical expressions converted to KaTeX. Solutions preserve the supplied derivations and prose wherever correct, then add omitted conditions, checks, and detail. Necessary exceptions:

| Original | Review and repair |
| --- | --- |
| 2 | Clarify continuity **on the entire real line**. The composition `g(g(x))=x` still excludes zero. It is continuous on its natural domain, so the unqualified original question is ambiguous. The solution corrects the source's vertical-asymptote implication: this composition has a removable hole. |
| 5 | Retain the source's reference to the previous answer, but also expand and differentiate the proposed primitive so it is independently understandable. |
| 8 | Change normal line "passing through" `(1,1)` to normal line **at** `(1,1)`. Normals at other points can also pass through this point; the clarification identifies the intended normal without changing the answer. |
| 10 | Write limits at infinity as limits, rather than function values at infinite inputs, and prove the extrema are global. |
| 11 | Explain why cube-root cancellation is valid at the requested input; give an alternative derivative of `f(x)^3`. |
| 13 | Check that the derivative numerator is nonzero at both vertical tangencies. |
| 14 | Retain the previous-question hint and symmetry solution; independently solve the center's linear-term equations. |
| 17 | Prove the unique stationary point gives the absolute minimum and distinguish the source's reused coordinate variable from the requested radical coefficient. |
| 18 | Check the zero-slope degeneracy and verify the two genuine tangent points. |
| 19 | Check the actual concavity sign change and exclude endpoints from an interior inflection calculation. |
| 20 | Check the slope's signs and limits, not merely zeros of the second derivative. |
| 21 | Preserve the tabular integration-by-parts calculation and replace an unsupported small-error inference with `0<I<1/4`. This proves `79 < 48 sqrt(e) < 79.5`. |
| 22 | Identify "Question 21" as the **original** source question. Supply the full independent calculation and bound `0<J<1/4`, proving `113 < 81 cubert(e) < 113.5`. |
| 23 | Show the transformed integral explicitly, including its bounds, exponent, and valid positive-domain substitution. |
| 24 | Explicitly require the nonzero leading coefficient already implied by degree 3. |
| 25 | Correct the terminal angle from `3*pi/2` to `2*pi`: the trip ends at `(1,0)`, not `(0,-1)`. The maximum still occurs at `3*pi/4`, so the key remains C. Check the maximizing time and actual traversal interval. |
| 26 | Specify the **two distinct** tangent lines, preventing repeated selection of a single line. Check the unsquared slope equation and enumerate both admissible intercept families. |
| 27 | Add the completed-square area formula and check the permitted time interval. |
| 28 | Check the domain and attainable AM-GM equality. |
| 29 | Justify that `g'` cannot vanish before dividing by it; positivity follows from the supplied codomain condition. |
| 30 | Explain the constant-sign condition for taking an absolute value outside each half-period integral, and prove existence and uniqueness of the accumulated-area solution. |

All original answer letters are preserved:

`CDCCD BABBA DACBA ADBAD AACAC BCDAC`

## Difficulty and Labels

Existing approved question labels and the offline national reference vocabulary were used for calibration. No new topic or method was introduced. Methods are omitted when they do not add a useful distinction. No item uses `Integral Properties`: the integral problems here use integration by parts, substitution, or absolute value, not elementary interval bookkeeping.

| Source | Public | Topic | Difficulty | Methods |
| --- | --- | --- | --- | --- |
| 1 | 323 | Limits | 1 | None |
| 2 | 324 | Continuity | 1 | Removable Discontinuity |
| 3 | 325 | Derivatives | 1 | None |
| 4 | 326 | Derivatives | 1 | Parity |
| 5 | 327 | Indefinite Integrals | 1 | None |
| 6 | 328 | Derivatives | 1 | Chain Rule |
| 7 | 329 | Limits | 1 | L'Hopital's Rule |
| 8 | 330 | Derivatives | 2 | None |
| 9 | 331 | Function Analysis | 2 | Second Derivative Test |
| 10 | 332 | Optimization | 2 | Quotient Rule; First Derivative Test |
| 11 | 333 | Derivatives | 2 | Chain Rule |
| 12 | 334 | Indefinite Integrals | 2 | Product Rule |
| 13 | 335 | Implicit Differentiation | 2 | Implicit Differentiation |
| 14 | 336 | Conic Sections | 2 | Symmetry |
| 15 | 337 | Derivatives | 1 | Trigonometric Identities |
| 16 | 338 | Implicit Differentiation | 2 | Implicit Differentiation |
| 17 | 339 | Optimization | 3 | Distance Formula; First Derivative Test |
| 18 | 340 | Derivatives | 2 | Discriminant Test |
| 19 | 341 | Function Analysis | 3 | Second Derivative Test |
| 20 | 342 | Optimization | 2 | First Derivative Test |
| 21 | 343 | Definite Integrals | 4 | Integration by Parts |
| 22 | 344 | Definite Integrals | 4 | Integration by Parts |
| 23 | 345 | Definite Integrals | 2 | U-Substitution |
| 24 | 346 | Polynomials | 3 | None |
| 25 | 347 | Rate of Change | 4 | Related Rates; Point-to-Line Distance Formula |
| 26 | 348 | Derivatives | 3 | Tangency; Trigonometric Identities |
| 27 | 349 | Optimization | 3 | First Derivative Test |
| 28 | 350 | Optimization | 2 | Trigonometric Identities; AM-GM |
| 29 | 351 | Differential Equations | 3 | Product Rule; Separation of Variables |
| 30 | 352 | Definite Integrals | 3 | U-Substitution; Absolute Value |

## Verification

`tests/muFebruaryRegional2025.test.mjs` verifies all 30 source answers and credits, unchanged preexisting records, vocabulary and difficulty snapshots, strict KaTeX compilation, wording repairs, and independent numerical/analytic checks across every source problem. It includes integral quadrature, antiderivative differentiation, explicit rounding bounds, conic gradients, convex distance minimization, moving-triangle determinants, counterclockwise angular endpoints, tangent-intercept enumeration, the positive separated ODE solution, and absolute-sine accumulation.

`tests/questionSources.browser.mjs` includes every new solution in both Trainer and results at desktop/mobile widths and the source credit in Question Bank, Trainer, play, spectators, and results. The long integration-by-parts lists in source 21/22 use scrollable display math rather than unbreakable inline expressions; their text and mathematical content are unchanged. The `--february-2025-only` flag reruns this new batch and the SVG asset checks without repeating previously checked source sets. These are isolated local UI fixtures, not claims about a deployed site or hosted database. The release script includes this audit and the new regression file, and preserves the pending PNG cleanup while excluding unrelated work.
