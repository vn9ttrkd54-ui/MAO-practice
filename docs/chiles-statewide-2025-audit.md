# 2025 Chiles Statewide Calculus Individual Audit

## Scope and Source

- Test: /path/to/Downloads/Calculus Individual Test - Chiles Statewide 2025.pdf (4 pages).
- Answers: /path/to/Downloads/Calculus Individual Answers and Solutions - Chiles Statewide 2025.pdf (5 pages).
- Printed competition date: January 11, 2025.
- All nine pages were text-extracted and visually inspected. Neither PDF contains an official dispute/throw-out note or PDF annotation. No problems were excluded.
- Added 30 records: stable IDs 10356-10385; public Mu numbers 234-263; original source question numbers 1-30.
- Credit on every record: 2025 Chiles Statewide / Calculus Individual / original question number.
- Existing national reference sets remain unpublished and unnumbered. Used only for offline label calibration.

Correct problem wording and correct solution prose are retained, with mathematical typesetting and standalone shared context. Added explanations justify intermediate steps, domains, and global conclusions. Exceptions below are editorial corrections, not claims that the organizer issued an erratum.

## Answer-Key Changes

The supplied key is:

DBADBCBBEBEDAEDDBEDADBDDCAABDC

The corrected bank key is:

DBADBCBBEBEDAEDDBEDADBDDCAEBEC

Only source questions 27 and 29 change answer letter.

| Original | Correction |
| --- | --- |
| 27 | A to E (NOTA). Correct ellipse derivative is -3(x-2)/(5(y+1)); the source changes 10y+10 to 10y+5, then changes the river constant -2 to -1. Correct closest x is 2+5/sqrt(17), absent from A-D. A point-to-line distance bound independently verifies the global minimum. Original river and road retained. |
| 29 | D to E (NOTA). Printed SUM has terms tending to 1 and diverges to positive infinity. The source incorrectly adds exponents when adding powers. Its telescoping work evaluates a PRODUCT, not the printed sum. Keep the sum and explain both the divergence and the intended product as a separate comparison. |

## Other Repairs and Explanation Additions

| Original | Treatment |
| --- | --- |
| 1 | Explicit opposite infinite one-sided limits; a vertical asymptote alone need not settle all two-sided cases. |
| 2-4 | Show all chain factors, tangent values, and exponential/logarithm simplification. |
| 5 | Table is incompatible with a continuous global inverse on the real line. Specify a fixed chosen preimage of -1 (e.g. 2); its derivative with respect to x is zero. Distinguish this from evaluating the derivative of an inverse function. B retained. |
| 6 | Source substitutes f'(2), g'(2) into a derivative limit without assuming derivative continuity. Replace that step with the definition-of-derivative difference-quotient proof; differentiability alone suffices. C retained. |
| 7-8 | Show quotient/chain lookup positions and both integration constants; explain why the even power has no linear term. |
| 9 | Correct bound variable x to n. Logarithm proof gives e squared, hence E. |
| 10 | Distinguish requested tangent approximation from actual f(1). |
| 11 | Correct solution opening "minimum" to "maximum"; check both endpoints and both critical points. Maximum 7/4, E. |
| 12-13 | Explain sine-limit scaling and positive-x conjugate simplification. |
| 14 | Check MVT hypotheses, nondifferentiable cusp, and absence of a zero derivative; equal endpoint values do not imply MVT applies. |
| 15 | Expand all implicit product/chain factors and specify where division gives a finite derivative. |
| 16 | Correct area-rate units from cm/sec to square cm/sec, and missing square in equilateral area formula. Separate circle/triangle area variables; retain D. No diagram appears in either supplied PDF. |
| 17 | Replace ambiguous "could" with "must ... for every admissible value of a." Original D also coincides with zero at a=0. The repaired universal reading uniquely gives intended B. |
| 18 | Explicit extended-real convention resolves DNE versus positive infinity. Show denominator sign from left; intended E retained. |
| 19 | Preserve e squared as a constant multiplier; include finite-sum verification of Riemann-sum argument. |
| 20 | Add positive-real and nonzero implicit denominator assumptions. Correct "natural log ... twice" to once. |
| 21 | Retain lower-branch distance method; add full-curve parameterization, factorization, and global minimum proof instead of unsupported uniqueness "by inspection." |
| 22 | Correct "tow" to "two"; explain parity and reverse product rule, with separate-integral check. |
| 23 | Repair D's erroneous single fourth root of the whole sum to the sum of four separate fourth roots, matching the correct midpoint computation and intended D. Wrong single-root distractor C remains unchanged. |
| 24 | Fully expand determinant and implicit derivative; clarify that a nonzero determinant level defines a different curve despite the constant differentiating to zero. |
| 25 | Correct final solution evaluation label f(a) to f(b). |
| 26 | Correct position formula's right-side variable from x to time t. Give full velocity/acceleration sign chart, durations, and rejection of the other intervals. Negative times permitted by supplied current-time wording. |
| 28 | Explain substitution branch and absolute value in square root of cosine squared; differentiate primitive as check. |
| 30 | Correct erroneous factors in multiplication and substitution differential; give the full cosecant integration and domain justification. |

## Original Visual

Shared table attached to source questions 5-7:

- public/questions/mu-360-362-original.png
- 906 by 161 pixels; original PDF page 1 rendered at a 1700-pixel long edge.
- Exact crop rectangle (114, 838, 1020, 999), no regeneration or rescaling.
- Descriptive alt text includes every original table value.
- No embedded raster images occur in the PDFs; the original vector/text table is preserved as a rendered crop.

## Labels

No new topic or method vocabulary. Determinant is already used in Alpha, Theta, and offline Mu references. Methods omitted where no specific established method adds useful information.

Difficulty sequence (original order):

1, 2, 1, 2, 1, 2, 2, 3, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3, 3, 1, 4, 1, 4, 4, 4, 2, 4.

Compared work required with existing public and internal national benchmarks, including the existing difficulty-3 parabola distance optimization. The repaired divergent series is difficulty 2 because its term test is immediate; do not rate the unrelated intended product instead.

## Validation

Regression coverage in tests/muChilesStatewide2025.test.mjs checks completeness, original/public numbering, source credits, the two answer changes, established labels, every KaTeX expression, original image dimensions, and explicit editorial repairs. Independent calculations check derivatives, finite sums, quadrature, determinant gradients, velocity/acceleration durations, a full-curve distance minimum, a sampled ellipse global bound, primitive derivatives, and divergent-series versus telescoping-product behavior.

The browser source-credit harness includes all 30 solutions at 320px and the table/credit in bank, trainer, play, spectator, and results views at desktop and mobile widths.

Completed local checks: 575 tests passed, zero failed; production webpack build passed; focused ESLint and git diff whitespace checks passed. The original table crop was compared pixel for pixel with the rendered PDF page and matched. Browser checks passed with no page overflow or broken KaTeX. Screenshots: /var/folders/wp/bjk7x7vj3vl6rn7ztrxrkd7h0000gn/T/question-sources-NGMH8k. Visually inspected the mobile bank/table and corrected ellipse solution screenshots; long display equations remain horizontally scrollable within their math containers.

No deployment, commit, push, database migration, or changes to held national content are part of this import.
