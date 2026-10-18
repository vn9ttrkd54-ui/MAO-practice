# March Regional 2026 Calculus Individual Review

## Sources and Coverage

User-supplied sources:

- `/path/to/Downloads/Calc Mar 2026 Reg Indiv Test.pdf`: five pages, original questions 1-30.
- `/path/to/Downloads/Calc Mar 2026 Reg Indiv Ans and Sols.pdf`: ten pages, answer key and complete solutions.

Both files are image-only scans. Every page was rendered and visually inspected, including every solution continuation. Neither supplied document marks a question as thrown out or records a formal dispute; neither contains PDF annotations. All 30 questions are retained. This does not claim there were no disputes outside the supplied files.

Added stable IDs 10326-10355 as consecutive public Mu questions 204-233. Existing IDs, display numbers, content, and ratings are unchanged. Every new record credits `2026 March Regional`, `Calculus Individual`, and its original paper question number 1-30. All 30 answer letters match the supplied key:

`ACCABABBDBAECECCDDEAACCABBBDBC`

The same shared source metadata is delivered in Question Bank, Trainer, multiplayer players, spectators, and results. No API or database schema change was needed. National references remain unnumbered and excluded from production catalogs.

## Text and Mathematical Corrections

Preserved correct problem prose, source methods, and solution wording wherever possible, normalizing mathematical typography for KaTeX. Expanded missing steps and corrected the following errors or ambiguities:

- Q2: the second derivative changes from negative to positive, not positive to negative. Explain that its zero alone is not sufficient.
- Q5: restore the missing square in the general denominator `x^2-3y^2`, while retaining the correct slope 1/2 and checking the point lies on the curve.
- Q7: preserve `r=sin(x)-cos(x)+1` after integration, correcting the source's later sign reversal. The maximum occurs at 3pi/4, not 7pi/4. Add the global sine-amplitude bound.
- Q8: retain the Fundamental Theorem derivation and add the shorter equal-limits check.
- Q9: clarify that differentiating in seconds divides by an additional second; squaring and differentiation affect units differently.
- Q11-13: repeat the original shared table/context for independent delivery. The table specifies derivatives at three points, not global differentiability.
- Q12: replace the source's suggestion of discontinuities in continuous `p` with corners where derivatives do not exist. Add a concrete positive continuous construction using the exact local table jets, nonconstant exponential connectors, and exponential tails. It has no zero first or second derivative where those derivatives exist, demonstrating that none of the three statements is forced.
- Q13: retain recognition of the product derivative and the source's arc-length/integration-by-parts alternative. Supply endpoint evaluation, positivity of the denominator, and justification that convergence and the tabulated endpoint derivatives permit evaluation even without assuming endpoint continuity of `p prime` separately.
- Q14: repair the derivative-definition typo `f(x+h)-f(h)` to `f(x+h)-f(x)` and explicitly evaluate the result 2, hence NOTA.
- Q15: the reduced denominator is not automatically 99. Prove that every proposed sum above 66 forces no reduction, after which the source's gcd checks are valid. Exhibit digits 16.
- Q16: correct the solution's mistaken upper bound 3 to 2, keeping the four right rectangles and answer 65/4.
- Q17: specify the standard arccot branch in the explanation and retain the substitution/L'Hopital method, with an equivalent arctan identity check.
- Q18: move the substitution x=1 to the correct stage after the three chain-rule factors have been written.
- Q19: explain the lower-bound minus sign and chain-rule factor despite the two bounds coinciding at x=1.
- Q20: include the original general inverse-area illustration and explicitly distinguish its increasing curve from this decreasing pair. Explain why reversed inverse-integral bounds give the difference J and prove the integral identity.
- Q21: retain the complete double implicit-differentiation calculation and the use of x^2+y^2=1.
- Q22: the two integration constants need not make the antiderivatives identical. The original B's statement that nothing can be said about their relationship overlaps the freedom described by intended answer C. Clarify B to the false claim that C1-C2 cannot equal 1, preserving the intended unique C and all other choices. Explain both equal and unequal antiderivatives with examples; do not assert that equality is mandatory.
- Q23: keep the original shoreline problem and its swimming-distance parametrization. Correct "minimizing the derivative" to minimizing time, justify the landing-point domain, and verify the global minimum and distinction between swimming distance and horizontal displacement.
- Q24: clarify "finite-valued vertical asymptotes" as asymptotes at finite x-coordinates, and explicitly count nonextendable isolated undefined derivative points. A discontinuity of f by itself is not a proof about f prime; use the Mean Value Theorem and bounded-derivative contradiction at a vertical asymptote. Supply examples attaining exactly v singularities for each possible positive number of distinct horizontal asymptotes (one or two).
- Q25: use absolute-value squeeze bounds valid at both positive and negative infinity.
- Q26: apply the Mean Value Theorem only to the everywhere-differentiable candidates; use the reverse triangle inequality for negative absolute value and an explicit close pair for the discontinuous candidate.
- Q27: the inequality between the two sums forces the common ratio of a to be negative, contrary to the source's chosen positive root. The fourth power and intended answer 5 are unchanged. State the positive-denominator convention to remove the simultaneous sign ambiguity in p/q.
- Q28: retain the two-integral linear-system method, with intermediate algebra and nonzero-denominator checks.
- Q29: justify the tangent substitution by first integrating short of pi/2 and then taking the limit.
- Q30: fix the swapped zero initial conditions when determining integration constants and use the correct n-dependent coefficient in each example. Keep the source's factorial decomposition, re-indexing, exponential Taylor sums, and result 3e^2-3. Remove the reference to a hint not present in the supplied question; explain convergence and omitted initial Taylor terms.

## Images

All images are non-generative, unresized pixel crops from the original 1530 x 1980 embedded page scans:

| Asset | Source Page | Crop Box (left, top, right, bottom) | Pixels |
| --- | --- | --- | --- |
| `mu-336-338-original.png` | Test 2 | 495, 850, 1102, 1005 | 607 x 155 |
| `mu-348-original.png` | Test 4 | 455, 1058, 1145, 1417 | 690 x 359 |
| `mu-345-original-solution.png` | Solutions 6 | 520, 1285, 1078, 1845 | 558 x 560 |

The table is attached to original questions 11-13, the shoreline to original 23, and the inverse-function image remains solution-only for original 20 through the existing explicit MathText allowlist. No replacement illustrations were generated.

## Labels and Difficulty

All topics and methods already exist in the question bank's vocabulary. Methods are deliberately empty for simple problems without a useful identifying technique. Compared difficulty with the existing state-and-below Mu entries and the internal national reference labels, without importing national content into runtime code or exposing it.

The 1-5 ratings by original number are:

`1,1,1,1,2,1,2,1,2,2,2,4,4,3,3,1,3,2,2,4,2,2,3,3,2,4,3,4,3,5`

Basic power/limit/Riemann calculations stay at 1; routine chain/implicit/normal-line problems at 2; multistep substitutions, arithmetic, and optimization at 3; recognition, regularity, and integral-system problems at 4; the combined nth-order initial-value problem and factorial-series manipulation at 5. These are mathematical-work ratings, not original paper position or unprovided success statistics.

## Verification Scope

Focused tests cover all 30 entries and key letters, unique/stable IDs, consecutive public numbering, source credits, vocabulary reuse, ratings, KaTeX, image dimensions and solution rendering, source-error repairs, the Q12 counterexample, an independent polynomial satisfying Q13's table constraints, numerical integrals, fraction enumeration, global optimization, and the final series.

The existing historical Trainer algorithm fixture is capped at the pre-expansion Mu catalog so new questions do not invalidate a test intended to compare the old algorithm. The live selection tests still use all approved entries. National publication tests now allow approved catalog growth while checking the original 203-ID prefix and complete consecutive numbering.

Verified results:

- Full unit suite: 565 passed, 0 failed.
- Production webpack build and TypeScript checks: passed.
- Focused ESLint and `git diff --check`: passed.
- Actual-component browser harness: passed for credits and original table/shoreline images in all five delivery views at 1280px and 320px, long detailed solutions, solution-image reveal gating, and all 30 new questions at 320px. No page-level horizontal overflow, page errors, or KaTeX errors.
- Long formulas are formatted as separate math blocks without changing wording; oversized display equations scroll within their containers. This corrects the mobile overflow caught for Q17 during verification.
- Visually inspected table and shoreline rendering, the inverse illustration, the full final solution, the detailed Q12 counterexample, and the corrected Q17/Q20 question layouts. Final screenshots are under temporary `question-sources-aj82cz`.
- Compared each saved PNG to the stated original embedded-page crop pixel-for-pixel: all three matched exactly.

These are local tests and isolated browser fixtures, not hosted account, database, live-match, load, or deployment tests. No commit, push, database migration, hosted write, or deployment was performed.
