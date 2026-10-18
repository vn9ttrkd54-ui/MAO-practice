# 2025 FAMAT State Convention Calculus Review

## Source and Existing Catalog

Reviewed all four pages of `2025 States Calculus Individual.pdf` and all four
pages of `2025 States Calculus Individual Solutions.pdf`, using text extraction
and rendered-page visual inspection. Neither PDF contains a question/solution
diagram to extract or a separate annotated dispute log.

Updated existing Mu 148-176, preserving all 29 IDs and bank numbers. Original
paper Q1-16 map to bank 148-163, and Q18-30 map to bank 164-176. Original Q17
was already absent and remains absent. Its source uses cubic meters per minute,
cubic feet for volume, and feet per second for the requested height rate, while
the printed solution ignores the conversions. This PDF does not document an
official throw-out; preserving the omission is not claimed as new evidence of one.

All retained records have credits using `2025 FAMAT State Convention`,
`Calculus Individual`, and original paper numbers. Existing shared credit displays
cover Question Bank, Trainer, multiplayer players, spectators, and match review.
No duplicates, metadata difficulty changes, new topic/method labels, gameplay
logic, database migrations, network requests, or polling were added.

## Text and Mathematical Corrections

Correct source wording and formulas are retained. Shared problem setups and
global restrictions are repeated where needed for standalone questions. Existing
detailed solutions remain; errors are repaired and missing working is restored.

- Q1-5: retain the constant limit, normalized density, support restriction,
  elementary derivative, and monic-cubic coefficient calculation.
- Q6: retain the geometric-series method and restore the source's elementary
  alternative, repairing dropped r powers and denominator typos. Explain why
  shifts/subtractions are permitted and why r=1/2 is not a solution.
- Q7: retain the quotient-rule/inflection calculation.
- Q8: retain the convergent improper integral and square-root substitution.
- Q9: the global instruction that uppercase letters are positive integers cannot
  apply to a general integration constant. Specify arbitrary real K on valid real
  branches with x,y nonzero. Retain absolute-value logarithms, restore the K=0
  solutions divided out during separation, and check the family by differentiation.
- Q10: explicitly evaluate the two positive Riemann-sum examples. Midpoint
  cancellation follows from odd symmetry for every equal-width partition.
- Q11: fix the existing transcription from (4-x^2)/2 to the actual source's
  4-x^2/2. The former does not yield the source's limit. Verify direction of
  approach with x=-2+h and use the outer formula to the right of 2. Answer B,
  limit 3, is unchanged and now follows from the actual stored function.
- Q12: restore finite partial sums before telescoping; separately subtracting
  divergent harmonic tails is not valid. Specify the direct partial-fraction
  telescoping form when identifying R,Y,T,M to avoid arbitrary rational-number
  re-representations unrelated to the intended harmonic identity.
- Q13: count concavity sign changes rather than merely zeros. Add examples
  attaining both extrema: f=x^2025 for one inflection and a second derivative
  with 2023 distinct simple roots for the maximum.
- Q14: retain the supplied derivative-name classification.
- Q15: repair two literal `qquad` tokens to actual LaTeX spacing. Explain the
  nonzero denominators and restore the formulas for a and c from the source.
- Q16: retain the full Maclaurin coefficient/factorial calculation.
- Q17: keep the existing omission; no record is newly deleted or renumbered.
- Q18: retain the substitution and odd/even integral calculation.
- Q19: preserve the catalog's existing unrestricted-query answer E (one exact
  transcendental evaluation), not the PDF's positive-integer-query answer A.
  Explicitly allow exact real input to resolve the ambiguous n domain. Restore
  the source's two-query base-expansion argument as a contrasting restricted
  variant, including S=0 and why one positive-integer query is insufficient.
  Exact uniqueness is not represented as finite-precision numerical recovery.
- Q20: preserve the upper-branch maximum calculation; check the extraneous root
  from squaring and compare the domain endpoints. Repeat positive-integer A,B,C.
- Q21: derive the lower branch exactly by rationalizing y^2 and differentiate
  y=x/sqrt(1+sqrt(1-x)). This establishes the slope limit without assuming that
  asymptotic equivalence can simply be differentiated.
- Q22: differentiate the explicit upper-branch identity. Its derivative numerator
  tends to 2 and denominator tends to zero positively. Remove the invalid step
  setting x=0 in an implicit derivative that is indeterminate at the origin.
- Q23: retain the polar-area substitution and repeat relatively prime positive
  A,B so the source's global lowest-terms rule is present in standalone use.
- Q24: retain the corrected substitution-variable notation.
- Q25: retain the clearer half-angle solution, avoiding separate undefined
  cosecant/cotangent terms at the lower endpoint in the source's presentation.
- Q26: retain the limiting segments and add a monotone-variation bound proving
  the vertical contribution is 2, rather than losing it under pointwise convergence.
- Q27: justify the minimum by containing the unit disk and the unattained area
  supremum 4 by containment of inner squares, not a sketch alone.
- Q28: retain the correct signed reciprocal derivatives. The source incorrectly
  inserts absolute values in the denominators of derivatives of logarithms.
- Q29: retain the source triangle-centroid/Pappus calculation.
- Q30: replace the source's unjustified divisibility shortcut and trial-based
  minimum claim. Modulo 3 twice forces q divisible by 3; nonconstancy then gives
  N^2>=540, hence integer N>=24. The explicit sequence attains 24.

No deployment or hosted data changes were made. Source exceptions are documented
above rather than silently treating the printed key as infallible.

## Local Verification

- 544 unit tests passed, including original credits and numbering, preserved
  difficulties/keys, all-catalog KaTeX, safe multiplayer metadata, independent
  one-sided composition limits, harmonic cancellation, branch derivatives,
  quadrature, and an exhaustive check for smaller arithmetic-sequence squares.
- Production build, focused ESLint, and whitespace checks passed.
- Isolated browser checks passed for Question Bank, Trainer, players, spectators,
  and match review at desktop and mobile widths down to 320px, including the
  corrected piecewise function and long solutions without page overflow.
- No hosted database writes, live match/load test, or deployment was performed.
