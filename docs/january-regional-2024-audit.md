# January Regional 2024 Calculus Individual Audit

## Sources and Retention

Reviewed every rendered page of both user-supplied scanned PDFs:

- Test: /path/to/Downloads/Calc Jan 2024 Reg Indiv Test.pdf (5 pages). SHA-256: 6d9cd0899d51975ae4ccc9f9e5c0ebdda0f8617a44bc52d310a8b0bc536c3300.
- Answers and solutions: /path/to/Downloads/Calc Jan 2024 Reg Indiv Ans and Sols.pdf (5 pages, including the full key on page 1). SHA-256: 90e4703d1d732cb855421ba248024f70ff64a838ae79a33ad8c905d005c70adc.

These PDFs have no extractable text or annotation objects. All questions, formulas, choices, figures, explanations, and possible dispute notes were read from rendered pages. No supplied page contains a throw-out or dispute note. Retain all 30 questions, correcting mathematical errors rather than inventing exclusions.

This is a different test from the previously imported 2024 FAMAT January Invitational. It is not a replacement or a duplicate of that set.

## Numbering and Credit

New stable IDs 10535-10564; consecutive public Mu numbers 412-441. Every record credits "2024 January Regional", "Calculus Individual", and its original question number 1-30. The year is taken from the supplied filenames; the scanned page headers say "January Regional."

The previous 411 public records are unchanged. Their structured SHA-256 remains 3ed73a672ca247137840df109565b08007e350592114ed6d0dbc138001b3fec9. No existing IDs, progress, history, or bookmarks are reassigned. The 118 unnumbered national references remain withheld and are used only for offline label calibration.

## Corrections and Wording

Preserve original wording and answer choices, with shared definitions repeated so each imported record is self-contained. Normalize typography and mathematical layout to KaTeX. Preserve sound solution prose while adding needed calculations and proofs. Source question 29's decorative scroll border is not a mathematical diagram; all its construction text is transcribed into the question instead of retained as a raster image.

| Original | Answer | Review / repair |
| --- | --- | --- |
| 1 | C | Leading cubic coefficient is 2, so third derivative is constant 12. |
| 2 | A | Add b>0, since a finite real slope at (0,sqrt(b)) requires a nonzero real y-coordinate. Explain implicit derivative and rationalization. |
| 3 | D | Correct source's general-limit typo: base is 1+a/x, not x+a/x. Show logarithm argument giving e^100. |
| 4 | C | Correct source's MVT point to c in (1,e), not the closed interval; verify c=e-1 is admissible. |
| 5 | C | Repeat the shared function; substitution at 0 gives b=-2024 independently of a. |
| 6 | A | Repeat the function independently of original 5; polynomial division proves a=-1 and b=1. |
| 7 | A | Point (3,17), slope 8, tangent y=8x-7. |
| 8 | D | A finite-limit contradiction alone does not establish divergence to positive infinity. Prove positivity, monotonicity, and unboundedness; also provide x_n^2>=1+2n. |
| 9 | B | Show full finite-difference expansion 6a+1. Distinguish this from f'(a). |
| 10 | A | Quotient rule and sin(pi)=0, cos(pi)=-1 give 1/2. |
| 11 | C | Supply remainder-controlled sine/logarithm expansions and positive logarithm domain, rather than treating a truncation as an exact equality. |
| 12 | C | Second derivative 6(x-1)>0 precisely for x>1. |
| 13 | B | Fixed-point equation (x-1)^3=0 has one distinct root, not three. |
| 14 | D | Repeat the piecewise definition; left limit and g(0) match when d=1/2. |
| 15 | C | Repeat definition; fully compute derivative limit a/2, showing cancellation of b. Explain that matching derivative limits alone does not enforce continuity. |
| 16 | C | Specify integer n. Justify chopping the unbounded integral with errors <=1/(n+1) on [0,1] and <=1/(n-1) on [1,infinity], rather than relying on pointwise convergence alone. |
| 17 | B | Logarithmic differentiation is valid near 3; compute y=32sqrt(2) and factor 19/8. |
| 18 | C | Clarify that the quantity is minimum surface-path length between vertices, not a moving ant's unspecified remaining distance. Give an unfolding construction and a geometric lower bound proving s sqrt(5) is globally shortest; time derivative is 2sqrt(5). |
| 19 | C | Retain sum-of-cubes identity and telescoping; show finite partial sum and limit 2. |
| 20 | B | Recreate source square/parabolas as SVG; make outward perpendicular axes explicit. Prove the diagonal is the common tangent using both parabolas, then ratio 2. |
| 21 | D | Logarithmic derivative gives x^x(ln x+1), hence 2e^e. |
| 22 | A | Cosine power series at pi gives -1; termwise differentiation is justified by infinite radius of convergence. |
| 23 | C | Fix source's erroneous positive sign in the intermediate e times exp(x/2): exponent is -x/2. Include remainders proving limit -e/2. |
| 24 | A | Say "set of values" rather than a single interval, since the answer is two disjoint rays. Keep all source choices, laid out as scrollable display math where long. Recreate solution-only graph; prove full intersection counts from three monotone branches and both end limits. Exclude the boundary intercepts because they give two distinct intersections. |
| 25 | B | Factor out 20^n and squeeze the remaining nth root between 1 and 3^(1/n). |
| 26 | A, corrected from B | Source misfactors x^2+x-20: correct roots are -5 and 4, not -4 and 5. Prove recurrence stays below -5, increases, never divides by zero, and converges to -5. Do not repeat the false general assertion that Newton's Method always converges to the nearest root. |
| 27 | B, corrected from A | Source correctly reduces to cos(11pi/3), then evaluates its sign incorrectly. That cosine is +1/2. Check independently by complex multiplication; the sequence expression is constant for all positive integer n. |
| 28 | C | Fix a,b versus x,y mismatch and missing optimization quantifier: fix y>=0, minimize over x>=0. Prove global minimum and include y=0 endpoint. No new Young's Inequality label is introduced. |
| 29 | B | Source includes m=0, where its construction is undefined. Restrict to nonzero slopes; include limiting point (0,1) to complete the intended graph. Use the upper-circle branch and show f(x)=1/sqrt(1+x^2), derivative at 1=-sqrt(2)/4. |
| 30 | D | Explicitly interpret quotients by polynomial cancellation, including at roots. Replace invalid real-log manipulation across sign changes with a direct finite-product derivative identity. FTC at the two root endpoints gives requested integral -1012, without assuming roots are ordered or distinct. |

Corrected key: CADCCAADBACCBDCCBCCBDACABABCBD. Only answer letters 26 and 27 differ from the supplied key.

## SVG Assets

- public/questions/mu-554-parabolas.svg, 480 x 420: source 20 question figure; centered small square, midpoint vertices, outward quadratic paths, dashed diagonals, and outer square with all four tangencies. Actual geometry is consistent, even though the source warns its image is not to scale.
- public/questions/mu-558-solution.svg, 620 x 380: source 24 solution graph; exact sampled vector path for ln(1+x^2) and its two slope-1/2 tangents, uniform coordinate grid, and axes. Registered in MathText's explicit local allowlist, visible only when solutions are shown.

Both use genuine vector shapes, paths, and text, with accessible titles/descriptions and no embedded images, scripts, external URLs, or public PNG copies.

## Labels and Difficulty

Reuse existing canonical topic and method vocabulary only. Difficulty snapshot in source order:

1,1,1,1,1,2,1,2,1,1,3,1,1,1,2,3,2,3,2,3,2,1,3,3,1,3,3,3,3,3.

Direct recognition and one-step calculations are 1; ordinary combined calculations/recursions are 2; careful limiting, geometric setup, branch counting, optimization, and structural identities are 3. No artificial 4/5 ratings are assigned by contest position. Compare required work to the existing public bank and offline national calibration metadata.

Methods are optional. No Integral Properties label is added: original 30 uses a finite-product derivative identity and FTC, not elementary interval additivity/linearity bookkeeping. Source 16 is labeled Squeeze Theorem for its explicit error bounds, not a new dominated-convergence method label.

## Verification Scope

The dedicated test independently checks every retained source item and guards keys, credit, stable IDs, display numbering, vocabulary, difficulty snapshot, exact preexisting-record fingerprint, strict KaTeX, SVG geometry, and solution-only rendering. The scoped browser run exercises both SVGs and every new question/solution at desktop/mobile sizes with isolated local fixtures, never hosted database writes.

The first browser passes exposed real mobile overflow in source 24's long choices in Question Bank and results. Corrected the shared practice choice grid to use a shrinkable minmax track and min-width-zero answer buttons with horizontally scrollable choice text. Multiplayer play, spectator, and results choice grids/text now use the same shrinkable layout principle. These are sizing-only changes: no selection, scoring, delivery, or submission behavior changes. Long source choices retain their mathematical content, using display-math layout where needed.

Completed checks:

- All 678 root tests pass, including 22 dedicated Regional tests, strict math rendering, vector validation, the unchanged 411-record fingerprint, consecutive numbering, and national publication protections.
- Production webpack build and TypeScript checks pass.
- ESLint passes for all changed TS/TSX/MJS files; git diff whitespace check and release-script syntax check pass.
- Scoped desktop/mobile browser checks pass for every new solution in Trainer/results at 1280/320 pixels, both illustrated source questions across Question Bank/Trainer/play/spectate/results, all source credits, solution-only graph gating, and all active SVGs at 390/1280 pixels. No uncaught browser error, KaTeX error, missing SVG, blank image, or page-width overflow.
- Manually inspected both new SVGs, the desktop parabola question, narrow-screen long choices in Question Bank/results, and corrected source 26's complete mobile solution. Long formulas scroll within their own containers rather than widening the page.
- Browser evidence: /var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-hyMxqz.
- React review: no new effects, state, network calls, dynamic imports, or unsafe content interpretation; only static local diagram registration and CSS/flex/grid sizing. Existing component keys and interaction handlers are preserved.
- All 73 scoped release paths exist. Nothing was staged, committed, pushed, or deployed. Unrelated dashboard/security work remains untouched.
