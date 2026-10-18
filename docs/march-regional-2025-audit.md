# March Regional 2025 Calculus Individual Audit

## Sources and Retention

- Test: `/path/to/Downloads/Calc Mar 2025 Reg Indiv Test.pdf`, four pages, all visually reviewed.
- Solutions: `/path/to/Downloads/Calc Mar 2025 Reg Indiv Ans and Sols.pdf`, five pages, all visually reviewed, including the answer key and highlighted notes.
- Test SHA-256: `d1fc78f5ee294526bdc93b7fc4e205dcd39386aeddaafee5c2af30c6133b00a2`.
- Solutions SHA-256: `8fa3bc8074d4b38466573927d642f863292418d7fa212147334aa2469ed3dabd`.
- The PDFs contain no annotation objects. The dispute information is printed directly on solution pages 2 and 3 and was read visually, not inferred from annotation presence.

Original question **2 is excluded**. Its highlighted source note explicitly lists regional outcomes including a throw-out, caused by an original variable mismatch. The supplied test now uses the corrected variable, but the user's instruction is to exclude questions with documented throw-out outcomes, not republish them after repair. No public record is assigned to stable ID `10476`.

Original question **13 is retained** with answer A. Its highlighted note reports duplicate equivalent choices A/B in an older version. The supplied test already corrects B to `c-2b`, and that corrected choice is preserved.

No other throw-out or dispute notes are supplied. All other 29 source answers agree with independent calculations.

## Numbering and Credit

Retained stable IDs are `10475` and `10477` through `10504`; public Mu numbers are consecutive **353 through 381**. Each record credits competition `2025 March Regional`, event `Calculus Individual`, and its original paper number. The previous 352 public records are unchanged, including solutions, labels, and metadata; their serialized SHA-256 remains `8e5e94c519bc6fc7059407de56d8fa3ac1f9c0c34e19836f5ca24d8d7694fdda`.

The national sets remain unnumbered and withheld. They are used only for offline label calibration and are not imported into application code.

## Text and Corrections

Problem wording and all retained answer choices follow the supplied corrected test, with mathematical typography normalized to KaTeX. Correct solution prose and derivations are preserved, with additional detail for independent use and mathematical validity. Long expressions use display math so the narrow results view remains usable.

| Source | Review and repair |
| --- | --- |
| 2 | Exclude because the supplied note includes a throw-out outcome, notwithstanding the corrected test's current variable. |
| 6 | Explicitly compute `y'(-1)` first, then substitute into the differentiated relation. |
| 7 | The result is 23, so E is correct. This is elementary integral linearity and appropriately uses `Integral Properties`, unlike specialized substitution tricks. |
| 9 | Preserve all unequal subinterval widths and distinguish left endpoints from the unused final table height. |
| 13 | Keep the already-corrected distractor B and check both stationary-point sign changes and the inflection sign change. |
| 15 | Restrict stationary candidates to `a>=0`, and check the endpoint and limit at infinity to establish a global maximum. |
| 17 | Explain the relevant area between line and parabola and the admissible slope range. |
| 19 | Fix the repeated `-3` exponent in the source's first derivative to `-2`; the general formula and answer A were already correct. Include the full induction argument. |
| 21 | Verify global invertibility and swap coordinates before constructing the inverse tangent. |
| 22 | Fix the missing prime on `h` in the source's last mixed product term: it is `f g' h'`. Show the factors 4 and 8 and why the answer is 0, hence E. |
| 23 | Add infinite differentiability and local uniform convergence of the derivative series. Pointwise convergence by itself does not justify the source's termwise differentiation. The shifted partial-derivative sums then also converge locally uniformly, allowing the reduction to `2y'=y`. Verify the resulting exponential in the original infinite series. |
| 24 | Preserve the two substitutions `u=tan(x)`, then `v=u^3+1`, and track their bounds. Use `U-Substitution`, not a radical-based trigonometric substitution label or `Integral Properties`. |
| 25 | Retain the binomial/hockey-stick derivation, and supply an equivalent telescoping proof of the exact factorial sum without adding a new method label. |
| 26 | Clarify annular cross sections and why nothing remains outside the heights `+-sqrt(3)`. |
| 27 | Correct the substitution line's angle from `pi/6` to the requested `5pi/6`; the negative trigonometric values and final answer D already correspond to `5pi/6`. |
| 28 | Explicitly restrict to the pictured crease joining the top and right edges. Without that restriction, folds involving other edge pairs change the problem; for example folding to the bottom left corner permits a shorter top-to-bottom crease. Correct the source's inadmissible "critical values" and prove the global minimum on the actual feasible interval `18-6sqrt(5) <= x <= 8`. Check the 12-inch width and the attainability of `6sqrt(3)`. |
| 29 | State the positive-real convergence domain of the defining integral. Correct `du` and the integration-by-parts boundary term to `-t^(s-1)e^(-t)`. Justify both endpoints for `s>1`; use the recurrence only at 5/2 and 3/2. |
| 30 | Correct "u=3x" to `u=4x`. Display the remaining `(8-k)/x^2` term to prove uniqueness of k=8 and preserve the product `-256/3`. |

## SVG Figures

| Figure | Runtime asset | Dimensions | Visibility |
| --- | --- | --- | --- |
| Source 9 table | `public/questions/mu-483-table.svg` | 600 x 112 | Question and review |
| Source 28 unannotated paper fold | `public/questions/mu-502-fold.svg` | 560 x 400 | Question and review |
| Source 28 labeled solution fold | `public/questions/mu-502-solution.svg` | 620 x 440 | Solution reveal only |

All are standalone paths and text, with titles, descriptions, accessible renderer metadata, and no embedded raster images. The fold uses a 12:8 rectangle and a consistent sample fold with right-edge split 5:3, bottom gap 4, reflected edge lengths 5 and 10, and a crease joining the same two edges as the source. Both question and solution figures preserve the reflected-corner geometry; labels x, y, z, L appear in the solution version as in the supplied solution. No PNG copies are added.

## Difficulty and Methods

No new topic or method vocabulary was introduced. The approved public bank and offline national calibration references were compared by mathematical work required, not by problem position or contest year.

| Source | Public | Topic | Difficulty | Methods |
| --- | --- | --- | --- | --- |
| 1 | 353 | Derivatives | 1 | None |
| 3 | 354 | Limits | 1 | None |
| 4 | 355 | Rate of Change | 1 | None |
| 5 | 356 | Derivatives | 1 | Quotient Rule |
| 6 | 357 | Implicit Differentiation | 2 | Implicit Differentiation |
| 7 | 358 | Definite Integrals | 1 | Integral Properties |
| 8 | 359 | Differential Equations | 1 | None |
| 9 | 360 | Riemann Sums | 1 | Riemann Sums |
| 10 | 361 | Riemann Sums | 1 | Riemann Sums |
| 11 | 362 | Limits | 1 | L'Hopital's Rule |
| 12 | 363 | Inverse Functions | 1 | None |
| 13 | 364 | Function Analysis | 3 | First Derivative Test; Second Derivative Test |
| 14 | 365 | Rate of Change | 2 | Related Rates |
| 15 | 366 | Optimization | 3 | First Derivative Test |
| 16 | 367 | Differential Equations | 2 | Separation of Variables |
| 17 | 368 | Area Between Curves | 3 | None |
| 18 | 369 | Rate of Change | 2 | U-Substitution |
| 19 | 370 | Derivatives | 2 | Chain Rule; Mathematical Induction |
| 20 | 371 | Limits | 1 | None |
| 21 | 372 | Inverse Functions | 2 | Derivative of Inverse Functions |
| 22 | 373 | Derivatives | 3 | Product Rule; Chain Rule |
| 23 | 374 | Differential Equations | 4 | Separation of Variables |
| 24 | 375 | Definite Integrals | 3 | U-Substitution |
| 25 | 376 | Limits | 4 | Telescoping |
| 26 | 377 | Volumes of Revolution | 3 | Cross Sections |
| 27 | 378 | Derivatives | 2 | Trigonometric Identities |
| 28 | 379 | Optimization | 4 | Implicit Differentiation; First Derivative Test |
| 29 | 380 | Improper Integrals | 3 | Integration by Parts |
| 30 | 381 | Limits | 3 | Power Series |

## Verification Coverage

`tests/muMarchRegional2025.test.mjs` checks the documented omission, complete retained answer key and original credits, consecutive public numbering, full prior-record fingerprint, canonical labels, difficulty snapshots, strict KaTeX compilation, SVG contents and solution allowlist, and independent checks for every retained problem. Independent calculations include quadrature, symbolic identities, a three-factor polynomial product, the exact degree-2024 telescoping sum using integer arithmetic, reflected fold distances and feasibility, the original convergent infinite derivative series, and a Gamma quotient integral after removing its endpoint singularity by substitution.

`tests/questionSources.browser.mjs --march-2025-only` checks active Mu SVGs for valid XML and nonblank rasterization at desktop/mobile sizes, both new question illustrations in all five views, solution-only fold annotations, all 29 new solutions in Trainer and results at both widths, source credits, strict layout bounds, and rendered KaTeX. These are isolated local fixtures; no hosted data is written and no live deployment is implied. The release script includes the three SVG files, this audit, and the new tests while leaving unrelated workspace changes out.
