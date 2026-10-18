# January Statewide 2026 Calculus Review

## Source and Scope

Reviewed all four test pages and seven solution pages of the supplied final PDFs:
`Calc Jan 2026 Statewide Indiv Test FINAL.pdf` and
`Calc Jan 2026 Statewide Indiv Ans and Sols FINAL.pdf`.
The filename provides the year; the paper identifies January Statewide,
Calculus Individual. Both PDFs were text-extracted and visually inspected.

Updated existing Mu 207-235, without duplicate records or renumbering. Original
question 28 was already excluded. Original question 26 (bank 232, ID 10232) is
also excluded because the solution annotation explicitly states it was thrown
out. The later corrected wording does not override the requested throw-out rule.
Thus 28 usable questions remain. Original 29-30 keep bank 234-235, and their
source credits correctly say Question 29 and Question 30. Existing stored progress
is not rewritten; retired-ID lookups return 404.

Credits use `2026 January Statewide`, `Calculus Individual`, and original paper
numbers. Existing shared rendering/payload support covers Question Bank, Trainer,
player/spectator views, and match review. No new API calls, database operations,
scoring changes, polling, or migrations were introduced.

## Original Artwork

The source PDF's two embedded question graphs were extracted without redrawing
and placed side by side with a white gutter, preserving original pixels:
`mu-207-210-original.png`, 1380 by 523. The two solution diagrams were extracted
directly as `mu-217-original-solution.png` (507 by 371) and
`mu-227-original-solution.png` (380 by 354). The safe solution-image allowlist
retains its existing markers and now points to the original PNGs. Question graphs
are visible before answering; solution diagrams remain reveal-only. Old public
SVGs remain untouched to preserve historical asset URLs.

## Corrections and Explanations

Correct source wording and mathematical expressions are preserved; shared setup
is repeated for independent questions, and insufficient working is expanded.
Topics, methods, answer labels, and difficulty ratings of retained entries remain
unchanged. Specific decisions:

- Q1-4: retain the graph setup and explain open versus filled points and the
  direction of approach in the composite limit. Q1 explicitly compares 4 and 3.
- Q5: replace the source's informal "identical for large n" argument with an exact
  n-2 substitution and product of two limits.
- Q6: retain the intended tangent-line evaluation and answer D, but describe it
  as an estimate from the tangent line, not an actual approximation to a positive
  branch value that does not exist. The branch through the specified point has
  x maximum pi/4-1/2, below 3/5. The solution explains this extrapolation issue.
- Q7: justify continuity at zero by squeezing and explain why the MVT does not
  require endpoint differentiability or a bounded derivative.
- Q11: clarify the base-aligned inscribed-square configuration shown in the
  source diagram, restore the original diagram, and derive both triangle heights.
- Q13: the cubic is not globally one-to-one; specify its local inverse near x=2,
  with g(6)=2, and verify the nonzero derivative there.
- Q14: restore the three antiderivatives and endpoint evaluation of the Riemann sum.
- Q15: restore collection of derivative terms and the xy>0 logarithm-domain check.
- Q16: retain the final finite-real-limit instruction resolving the dispute.
  Show the positive logarithm numerator tends to ln(2) while tan-squared tends
  to zero from above. The selected answer remains DNE.
- Q17: restore the perpendicular foot (11/5,17/5) and distance calculation; also
  give a global minimum proof using ((x-1)^2+3)/sqrt(5).
- Q19: retain the simpler differentiated-product proof of y''=2 rather than the
  source's more cumbersome quotient-rule expansion.
- Q21: restore the source conic diagram and verify four finite-slope intersections
  algebraically, with (x-2)^2=112/41 and (y+1)^2=75/41, before pairing slopes.
- Q22: expand both integrations by parts used after the odd/even decomposition.
- Q23: retain ln(abs(y)) and ln(abs(x-1)); the source's ln(y) is not real at the
  evaluation point, where y=-1/3. The derivative remains 11/9.
- Q25: fix the existing catalog's incorrect final exponent 9/2 to 7/2 and its
  resulting 2/11 to 2/9. Restore the full expansion and evaluation to 208/315,
  matching the source's correct solution and answer D.
- Q26: excluded. The key page says A, the detailed solution says B, and the
  annotation explicitly records a throw-out. No arbitrary answer is retained.
- Q27: retain the amended distinct B/C choices and the convergent logarithmic
  evaluation of the infinite product.
- Q28: remains excluded as explicitly marked in both PDFs.
- Q29: restore the source's innermost 1/e^x, which the catalog had changed to 1/x.
  Both have the same limit, but the original problem must be preserved.
- Q30: restore the full integration-by-parts derivation of the secant-cubed
  antiderivative and back-substitution, with real absolute-value logarithms.

No new official dispute record was obtained; these decisions use the supplied
final PDFs and their annotations. Local verification is not a deployed match
or load/capacity test.

## Local Verification

- 530 unit tests passed, including all-catalog KaTeX, original-number credits,
  preserved keys/difficulties/IDs, retired-ID 404s, safe catalog payloads, and
  independent quadrature, conic-intersection, and antiderivative checks.
- Production build, focused ESLint, and whitespace checks passed.
- Isolated browser checks passed for all five source-credit views at desktop
  and mobile widths down to 320px. Original question graphs and both solution
  PNGs decoded correctly; long solutions remained within the page width.
- The historical Trainer golden selection fixture retains retired metadata only
  in the test, preserving the unchanged algorithm comparison. Those records are
  not available through the active catalog.
- Not deployed. No hosted account, match, or database state was modified.
