# February Regional 2026 Calculus Audit

## Scope and Credits

Source: the user's 13 supplied screenshots of February Regional 2026,
Calculus Individual Test and Answers and Solutions.

Updated existing Mu 266-295 in place. Original paper questions 13 and 20
(IDs 10278 and 10285) are excluded because the supplied solution notes explicitly
identify them as thrown out in Region 5. Although the source says those prompts
were later corrected, the requested exclusion rule is applied conservatively.
No other records are renumbered, no progress rows are modified, and no duplicates
are created. Previously stored references to those two retired IDs are not migrated.

All 28 retained entries carry the competition `2026 February Regional`,
event `Calculus Individual`, and original paper question number. The existing
shared source-credit display and payload mappings cover Question Bank, Trainer,
Multiplayer, spectators, and match review. No new requests or database changes.

Existing difficulties and topics are preserved. Q6 uses the existing
`U-Substitution` method instead of the inaccurate `Trigonometric Substitution` label.
There are no diagrams in the supplied Regional test or solution pages to extract.

## Text and Mathematical Review

Source wording and mathematical expressions are retained where correct; omitted
working is restored and insufficient explanations are expanded. Shared setups
are repeated for standalone questions. Formatting-only differences include math
delimiters, display equations, and prose expansion of slash fractions.

- Q1-9: restore derivative/antiderivative evaluations, substitution bounds, and
  the Riemann-sum derivative tests. Q6 is ordinary u-substitution.
- Q10: retain the source concavity argument and explain the sign-based choice
  of integration endpoints using the factorization of f.
- Q11: correct the source's undefined phrase "discontinuous set" to "discrete set"
  and specify that derivative statements hold wherever derivatives exist.
  Define the source counterexample at zero so it is a function on the whole
  real line. Explain independent integration constants and both parity identities.
- Q12: specify the x-coordinate of the inflection point, not an entire point
  represented as a fraction; use relatively prime positive integers. Show both
  derivatives and verify the concavity sign change.
- Q13: excluded; original note says thrown out in Region 5.
- Q14: the velocity integration constant is 3, not the source's erroneous 3/2.
  Time to stop is 3/2; distance is 9/4. Show endpoint arithmetic.
- Q15-16: retain the shared triangle setup independently. Expand all numerical
  related-rate substitutions and keep shrinking-side velocity negative.
- Q17-18: retain the shared positive-integer assumptions and Euler hint. Explain
  the zero-frequency case, including the dependence on m=n for Q18 (NOTA).
- Q19: restore square completion and both substitutions. Restrict the complex
  side-note to Re(a)>0 with a square-root convention. The original "if and only
  if" convergence claim is false for conditional oscillatory boundary cases.
- Q20: excluded; original note says thrown out in Region 5.
- Q21: show bounds, logarithm identity, and integration-by-parts evaluation.
- Q22: explain distinct positive quadratic roots, their correspondence to x>0,
  and why neither parameter endpoint is included.
- Q23: retain the supplied dispute correction requesting the absolute difference;
  restore the extraneous-root check, second derivative, and endpoint comparisons.
- Q24: correct the source's definition of analyticity to local agreement with
  the Taylor series, not global agreement with a series centered at zero.
  Prove derivatives at zero with difference quotients and induction, then
  distinguish convergence from agreement with the function.
- Q25-26: resolve the supplied speed dispute with "measured along the curve."
  Use the squared speed constraint rather than the source's incorrect assumption
  that dy/dt is positive. At the larger root x=6, dy/dt is negative; the resulting
  positive dx/dt is sqrt(2)/10, choice C. Keep the correct larger root rather than
  the source solution's smaller-root evaluation, which coincidentally matches.
- Q27: retain the reciprocal substitution and the equation involving I on both
  sides, with the positive-domain inverse-tangent identity stated.
- Q28: retain the positive-leading-coefficient correction (otherwise orthogonality
  leaves an independent sign ambiguity). Restore all normalization equations and
  solve the coefficient system explicitly, including the sign choice.
- Q29: restore the change-of-variables factors and evaluate the final logarithm
  and angle terms.
- Q30: restore the component-by-component acceleration evaluation.

No claim of a newly obtained official dispute log or hosted verification is made.
The exclusion/dispute decisions above are grounded in the supplied annotations.

## Local Verification

- 524 unit tests passed, including full-catalog KaTeX, source delivery, and
  independent integral, normalization, and parameter-root calculations.
- Production build and focused ESLint checks passed.
- Isolated browser checks passed for Question Bank, Trainer, player, spectator,
  and match-review credits at desktop and mobile widths, including 320 pixels.
- The longer Legendre equation exposed grid minimum-width overflow in player
  and spectator views. Scoped grid sizing fixes contain horizontally scrollable
  display math within each panel; no gameplay, polling, or scoring code changed.
- The historical Trainer selection golden fixture retains its two original
  metadata-only records solely to keep the pre-refactor comparison meaningful.
  Separate live-catalog checks verify those retired IDs return 404.
- Not deployed; no hosted multiplayer match or load test was run.
