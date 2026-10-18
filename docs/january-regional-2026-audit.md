# January Regional 2026 Calculus Audit

## Source and Scope

Reviewed the user's ten supplied screenshots of January Regional 2026,
Calculus Individual Test and Answers and Solutions. Updated the existing
Mu 236-265 records, without creating duplicate questions or renumbering others.
Original question 13 (ID 10248) is excluded: the supplied annotation explicitly
states it was thrown out in Region 5. Although the test-bank wording was later
repaired, the requested exclusion rule is applied consistently with the February
Regional review. Existing saved references to the retired ID are not migrated;
new Trainer/API catalog lookups do not return it.

All 29 retained questions have source credits with competition
`2026 January Regional`, event `Calculus Individual`, and the original paper
question number. The existing credit component and safe multiplayer mappings
carry these into Question Bank, Trainer, player/spectator views, and match review.
No database migration, scoring change, polling change, or new request is needed.

Existing topics and difficulty ratings are unchanged. Question 21 retains the
existing `Integration by Parts` method; the inaccurate `Infinite Series` method
was removed because its solution uses a finite recurrence, not an infinite series.

## Original Diagrams

Direct, non-generative crops of the supplied source screenshots replace the
previous schematic redraws for this test:

- Q3-5: `public/questions/mu-238-240-original.png`, 374 by 272 pixels.
- Q15: `public/questions/mu-250-original.png`, 440 by 245 pixels.

These are question illustrations, not solution-only diagrams, so participants
can see them before answering. The old public SVGs are left in place to avoid
breaking historical public asset URLs; active question records use the PNGs.
Tables for Q19-20 remain structured LaTeX, transcribed from the supplied table.

## Mathematical and Wording Decisions

Correct supplied wording is retained; compressed explanations are restored and
expanded. Shared graph/table setups are repeated for independently usable items.
Formatting differences include LaTeX delimiters, display placement, and typeset
fractions. Specific corrections and substantial expansions:

- Q1: the supplied solution reverses the signs of f1 at the endpoints.
  Correct to f1(-2)=1/2 and f1(1)=-1. Explain using a continuous subinterval for f2.
- Q2: justify the one-sided vertical asymptote, absolute-value factor at negative
  infinity, and why the other domain endpoint is not a vertical asymptote.
- Q3-4: retain the supplied endpoint/domain and vertical-tangent clarifications
  resolving the regional disputes. Explain endpoint continuity, all three
  discontinuities, and all six failures of differentiability.
- Q5: explicitly compare the hole's height 0 and filled point f(1)=-2.
- Q8: restore the derivative cycle and chain-rule factors; avoid the supplied
  solution's inconsistent early derivative notation.
- Q9: restore the sign-chart intervals and the no-sign-change reasoning at zero.
- Q11: restore the half-height convention, derivatives, permitted interval, and
  endpoint/global maximum checks.
- Q12: restore the exact telescoping recurrence for x_n squared and its harmonic
  error bound. Justify the logarithmic error divided by n tending to zero.
- Q13: excluded under the throw-out rule above.
- Q15: retain the corrected p,r,s labels matching the original diagram, rather
  than the supplied prompt's p,q,r typo. Expand the slope/sign-pattern reasoning.
- Q19-20: retain the table and chain-rule/inverse-rule evaluations. The inner
  derivative factor 2 in Q20 gives -18, NOTA.
- Q21: replace the video-only explanation with integration by parts, the full
  exponent-reduction recurrence, both starting integrals, odd and even exponent
  cases, examples, and the count of integers congruent to 3 modulo 4. Clarify
  natural density in the prompt because a uniform distribution on all positive
  integers does not exist.
- Q21 rigor: irrationality of pi and ln(2) separately does not establish
  irrationality of their linear combination. The even-exponent case explicitly
  uses Baker's nonzero-linear-form theorem, checks its algebraic inputs and
  coefficients, and proves the form is nonzero. The advanced theorem is stated,
  not presented as an elementary consequence of integration by parts.
- Q22: give explicit limit evaluations, including the squeeze theorem.
- Q24: justify the inverse-tangent branch, extend by symmetry, and evaluate the
  remaining inverse-tangent integral by parts.
- Q25: restore the floor definition and explicitly specify the improper endpoint;
  show the partial fractions, telescoping partial sum, and convergence.
- Q27: show the permissible tangency coordinate, both intercepts, the area
  derivative and its sign change, and the limiting endpoint areas.
- Q29: explicitly compute y'=1 and y''=-2/3 at (-1,1), and justify the vertical
  tangent at (2,1) without treating an undefined quotient alone as sufficient.
- Q30: retain the corrected distinct A/C choices from the supplied amended test;
  restore both trigonometric identities before differentiating.

## Primary Reference for Q21

Alan Baker, *Linear forms in the logarithms of algebraic numbers (III)*,
Mathematika 14 (1967), 220-228:
[publisher abstract and article](https://www.cambridge.org/core/journals/mathematika/article/abs/linear-forms-in-the-logarithms-of-algebraic-numbers-iii/C3A7D8C6F454E237D6A3FBAD8DBD006D).
The abstract explicitly gives the nonvanishing-linear-form transcendence result.
No video is necessary to read or use the stored solution.

## Verification Scope

Source/dispute decisions use the supplied annotations, not a newly obtained
official dispute log. Local tests do not establish hosted deployment or live
capacity. No hosted database records were changed.

Local verification completed:

- 527 unit tests passed, including all-catalog KaTeX, original-number metadata,
  retained IDs/difficulties, answer keys, retired-ID 404s, and multiplayer asset
  delivery without answer leakage or extra reads.
- Independent numerical checks confirm the question 21 recurrence for exponents
  1-30, the rational examples 1/6 and 19/210, and the other high-risk integrals.
  Numerical approximation is not used as a proof of irrationality.
- Production build, focused ESLint, and whitespace checks passed.
- Isolated browser checks passed at desktop and mobile widths down to 320px
  for all source-credit views, original graph decoding, and long solutions.
- Local preview server remains available on port 3000. No deployment was made.
