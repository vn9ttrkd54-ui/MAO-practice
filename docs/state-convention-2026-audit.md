# 2026 FAMAT State Convention Calculus Review

## Source and Scope

Source: the supplied `2026 States Calculus Individual+Solutions.pdf`, 13 pages.
All six question pages, the key, and six solution pages were text-extracted and
visually reviewed. The printed heading is `2026 FAMAT State Convention`, event
`Calculus Individual`.

Updated the existing 29 records, Mu 119-147, without duplicates, renumbering,
or changing established difficulty ratings/topics/methods. Original paper Q1-25
map to bank 119-143, and original Q27-30 map to bank 144-147. Every retained
entry has the original paper number in its source credit, not the bank number.
Existing source rendering covers Question Bank, Trainer, multiplayer players,
spectators, and match review without additional requests or database reads.

Original Q26 was already absent from the catalog with a comment recording a
prior throw-out decision. That exclusion is preserved. This particular PDF
does not contain that dispute annotation, so it is not presented as new evidence
of an official throw-out. No newly obtained official dispute log is claimed.

## Wording and Mathematics

Correct source wording and expressions are retained or restored; insufficient
explanations are expanded and errors corrected. Notable decisions:

- Q1-6: retain the trigonometric identities, tangent-line coefficients, corner
  argument, coefficient extraction, FTC/L'Hopital proof, and power-series
  substitution. No answer changes are needed.
- Q7: the origin already lies on the polar curve. Specify northeast travel to
  the next intersection, and show all three segment distances explicitly.
- Q8-10: retain the characteristic-function lengths, limit, and full algebraic
  self-intersection proof. The proof excludes identical parameter values and
  establishes that the origin is the only self-intersection.
- Q11: show the bump derivative and its sign. The quadratic in the denominator
  has a minimum, not a maximum, at its midpoint; the bump function has the maximum.
- Q12: specify the volume-rate units in cubic centimeters per minute; retain
  the chain-rule factor sqrt(h) before substituting h=4.
- Q13: expand the orthogonality explanation using product-to-sum, parity, and
  the sine-square integral. Specify positive integer frequencies when invoking
  the usual normalization, avoiding the source's unrestricted integer claim.
- Q14: retain the requested closed interval [0,1]. The derivative is nonnegative
  there and the second derivative is positive in its interior; including endpoints
  does not change the interval's monotonicity/convexity.
- Q15: retain the correct inverse derivative 1/9.
- Q16: retain the correct paired alternating-harmonic series. The source's
  last summation has a sign typo: ln(2) uses (-1)^(n+1)/n starting at n=1.
- Q17-19: retain the derivative counts and convergence classification; explicitly
  differentiate the positive magnitudes in series (b) to justify monotonicity.
- Q20: remove the catalog's false claim that a=1 solves the critical-point
  equation. Prove existence of an interior global minimum by endpoint divergence,
  derive a+ln(a)/a=2 without solving for a, and check the second derivative using
  the stationarity identity. Answer C remains correct.
- Q21: repeat the source's global fractional-part definition in the standalone
  prompt, so it is usable outside the full paper.
- Q22: use "arc length" rather than "perimeter": the traced curve is open.
  Preserve the explicit polar arc-length proof; no closing segment is counted.
- Q23: retain the correct tangent intercept -5/2. The source's intermediate
  subtraction 14/4 is a typo; the product of slope and x-coordinate is 3=12/4.
- Q24: retain the corrected half-open dyadic intervals and convergent improper
  integral. The single endpoint x=1 does not affect the integral; the source's
  closed-interval assertion is incorrect at its upper endpoint.
- Q25: preserve the prior direct-transfer/constant-rate clarification and correct
  height-rate units from cubic inches/hour to inches/hour. Volume rate is 308
  cubic inches/hour, and height rate is 77/(4*pi). The one-gallon moment is feasible.
- Q26: keep the prior catalog exclusion; no question is restored on the strength
  of this PDF's unrevised key alone.
- Q27-28: retain the convergent exponential-series derivation and detailed
  rectangular cross-section integration.
- Q29: preserve the existing corrected answer C, sqrt(2), rather than this PDF's
  printed A. The source treats x and y as fixed while varying a, then cancels
  x-y even though the geometry imposes x=y=sqrt(a*b). The stored derivation
  enforces the angle constraints, obtains c=sqrt(a(a+b)), d=sqrt(b(a+b)), and
  rationalizes before taking the limit. A direct coordinate check independently
  confirms the central right angle and the limit sqrt(2).
- Q30: retain the explanation that each absolute-value summand creates a distinct
  jump of 2 in slope that cannot be canceled by the other smooth summands.

## Original Diagram

`public/questions/mu-146-original.png` is a non-generative raster extraction
of the original vector diagram on PDF page 6, at 200 dpi (600 by 390 pixels).
The diagram was visually inspected, including its angle labels and right-angle
markers. It replaces the active schematic SVG reference; the old public SVG
is left intact to avoid breaking historical URLs. This is a problem diagram,
so it is available before answering rather than only after solution reveal.

No database migration, auth/permission change, scoring change, new polling,
or deployment is part of this review.

## Local Verification

- 537 unit tests passed, including all-catalog KaTeX, original-number credits,
  stable IDs/answer keys/difficulties, and independent minimum-distance, geometry,
  series, integration, bump-maximum, and unit-conversion calculations.
- Production build, focused ESLint, and whitespace checks passed.
- Isolated browser checks passed for Question Bank, Trainer, players, spectators,
  and match review at desktop and mobile widths down to 320px. The original
  diagram decoded correctly, and long solutions did not cause page overflow.
- No hosted database writes, live match/load test, or deployment was performed.
