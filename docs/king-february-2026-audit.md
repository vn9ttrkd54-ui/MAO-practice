# King February 2026 Calculus audit

## Scope and provenance

The supplied 15 screenshots contain the King February 2026 Statewide Calculus
Individual paper and worked solutions. The set already existed as Mu bank
296-325, IDs 10296-10325. This update preserves those IDs, bank numbers, all 30
answer labels, all existing difficulty ratings, and the existing canonical topic
labels. No duplicate question is added and no new topic or method label is created.

Source credit is `2026 February King Invitational · Calculus Individual · Question N`,
with N always the original paper number 1-30, never its bank number or match-round
number. FAMAT calls the competition an Invitational on its event page and Statewide
on the paper/results page:

- https://famat.org/competitions/220/
- https://famat.org/results/2026-February-Statewide-at-King/
- https://famat.org/results/static/details/Calculus_Details_King%20Statewide%202026.html

The final public detail report lists a valid answer for each of questions 1-30,
matching `ADACDABBACAACEBCDDDBBECCDABBAB`. No thrown-out question is identified in
the supplied screenshots or that report, so none is excluded. This is not a claim
to have a separate official dispute log. If one is supplied later, explicitly
thrown-out items must be excluded without reassigning saved question IDs.

## Editorial corrections

Question and choice wording is retained, with repeated shared setups so random
practice questions stand alone. Original worked explanations are restored or
expanded where the existing catalog had abbreviated them. Corrections are
mathematical/editorial fixes, not invented official dispute decisions:

- Q4: volume is a solid's volume, not a surface's volume.
- Q5: stationary points are x = 2 pi k, not odd multiples of pi/2. Explain
  concavity changes and why these are not extrema.
- Q6: the Mean Value Theorem point lies in the open interval (1,e).
- Q9: write multiplication explicitly after substituting trig values so y' times
  0 or 1 is not confused with evaluating y' at 0 or 1.
- Q11: justify nonzero sine and y derivative before dividing.
- Q12: recurrence starts at n >= 0 so x1 is defined. Justify the positive square
  root without requiring a calculator or an unprovided plot.
- Q14: restore both floor and ceiling from the screenshot. The original proof's
  noninteger claim misses sine values +/-1; use integer and quarter-offset
  subsequences instead.
- Q15: restore the displayed nested expression. In the derivative of the implicit
  polynomial, d(2xy^2)/dx includes 2y^2, not 2xy^2.
- Q18: explicitly give the continuous endpoint value 0; the infinite list has no
  attained minimum at x=0. Restore the original graph and geometric-series proof.
- Q19: justify both improper boundary terms.
- Q20: retain the necessary t factor in t(ln t)^3. The screenshot's integral
  without t diverges at infinity; its finite keyed answer applies to the corrected
  integral. Include a direct substitution check as well as L'Hopital's argument.
- Q21: make the shifted-tail integral and finite-interval FTC justification explicit.
- Q22: the symmetry sum is ln(1+sin theta) + ln(1-sin theta), not two copies of
  the minus term. Explain integrability at both endpoints.
- Q24: the "sadder" inequality need only hold at one point, not throughout the
  interval. Prove it near 0 for choice C and rule out the other choices globally;
  avoid the source proof's incorrect derivative comparison for x/(1-x).
- Q25: retain the absolute value in statement I, the source counterexample image,
  and add an explicit algebraic counterexample. Choose a fixed interior point
  near 1 to justify statement II, including negative values of g.
- Q26: equality at the minimum is allowed because "sadder" requires a strict inequality.
- Q27: correct the intermediate factor: one-half f'(1/2) = -4 f'(4) = -20,
  hence f'(1/2) = -40. Give a genuine example satisfying the functional equation.
- Q28-29: include the supplied definition and first two polynomials in each
  standalone question. Derive the needed Hermite identities rather than relying
  on another question or an unexplained differential equation.
- Q30: restore the supplied reflection diagram and angle explanation.

The four PNG diagrams in `public/questions/mu-{302,313,320,325}-solution.png`
are direct crops of supplied screenshots, not generated or redrawn images.
They are rendered only inside revealed solutions through MathText's explicit
local allowlist, never exposed in open-round multiplayer question payloads.

## Delivery and verification

`Question.source` is optional for historical questions with unverified provenance.
All 30 questions in this set have full credits. Unknown origins elsewhere in the
catalog are not guessed. The shared credit component appears on Question Bank
details, Trainer questions, Multiplayer play, spectators and post-match review.
Player/guest round and preload mappings carry only public provenance metadata.
Trainer's existing single-question response already carries the complete question.
No database schema, query, identity check, answer handling or selection rule changes.

Checks cover all answer labels, stable IDs and ratings, canonical labels,
catalog-wide LaTeX, original diagram availability, independent integral/algebra
checks, Hermite polynomial identities, source delivery and absence of answer or
solution leaks in open rounds. Browser fixtures use actual components and real
KaTeX with mocked API/auth; they do not prove hosted deployment behavior.
