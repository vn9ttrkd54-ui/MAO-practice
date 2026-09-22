import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const questionFiles = ["alpha.ts", "mu.ts", "theta.ts"];
const sources = questionFiles.map(file => ({
  file,
  source: readFileSync(new URL(`../data/questions/${file}`, import.meta.url), "utf8"),
}));

const topics = sources.flatMap(({ source }) =>
  [...source.matchAll(/topic:\s*"([^"]+)"/g)].map(match => match[1]),
);
const methods = sources.flatMap(({ source }) =>
  [...source.matchAll(/methods:\s*\[([^\]]*)\]/g)].flatMap(match =>
    [...match[1].matchAll(/"([^"]+)"/g)].map(label => label[1]),
  ),
);

test("question-bank labels use canonical names", () => {
  const approvedTopics = [
    "Algebra", "Analytic Geometry", "Applications of Integration", "Area Between Curves",
    "Binomial Expansion", "Combinatorics", "Complex Numbers", "Conic Sections", "Continuity",
    "Definite Integrals", "Derivatives", "Differentiability", "Differential Equations",
    "Function Analysis", "Functions", "Fundamental Theorem of Calculus",
    "Generating Functions", "Geometric Series", "Geometry", "Hyperbolic Functions",
    "Implicit Differentiation", "Improper Integrals",
    "Indefinite Integrals", "Inequalities", "Inverse Functions", "Limits",
    "Linear Approximation", "Logs and Exponents", "Matrices", "Number Theory",
    "Optimization", "Parametric", "Polar", "Polar Area", "Polynomial Equations",
    "Polynomials", "Power Series", "Probability", "Quadratics", "Rate of Change", "Riemann Sums",
    "Sequences", "Sequences and Series", "Series", "Simplification", "Statistics",
    "Systems of Equations", "Telescoping Series", "Trigonometry", "Vectors",
    "Volumes of Revolution",
  ];
  const approvedMethods = [
    "AM-GM", "Absolute Value", "Alternating Series Test", "Angle Bisector Theorem", "Angle Chasing", "Arc Length", "Arguments of Complex Numbers",
    "Asymptotes", "Base Conversion", "Binomial Theorem", "Cauchy-Schwarz Inequality",
    "Chain Rule", "Change of Base", "Chinese Remainder Theorem", "Comparison Test", "Complement Rule", "Completing the Square",
    "Conditional Probability", "Conjugates", "Continued Fractions", "Critical Points",
    "Cross Product", "Cross Sections", "De Moivre's Theorem",
    "Derivative of Inverse Functions", "Determinant", "Difference of Squares", "Discriminant Test", "Disk Method",
    "Distance Formula", "Dot Product", "Double-Angle Identity", "Eccentricity",
    "Eigenvalues", "Euler's Formula", "Even Functions", "Exponential Limits",
    "Fermat's Last Theorem", "First Derivative Test",
    "Expected Value", "First-Order Linear Equations", "Gaussian Integral", "Geometric Probability", "Geometric Sequence",
    "Generating Functions", "Geometric Series", "Half-Angle", "Heron's Formula", "Homogeneous First-Order Equations",
    "Hyperbolic Functions", "Imaginary-Part Argument",
    "Implicit Differentiation", "Infinite Geometric Series", "Infinite Series",
    "Inclusion-Exclusion", "Integral Properties", "Integration by Parts", "Intermediate Value Theorem", "Inverse Functions",
    "King's Rule", "L'Hopital's Rule", "Law of Cosines", "Law of Sines",
    "Limit Comparison Test", "Limit Definition of Derivatives", "Linear Approximation",
    "Logarithmic Differentiation", "Logarithms", "Mathematical Induction", "Matrix Inverse", "Matrix Multiplication",
    "Mean Value Theorem", "Modular Arithmetic", "Multinomial Theorem", "Nested Functions",
    "Optimization", "Pappus's Theorem", "Parity", "Partial Fractions", "Pick's Theorem", "Planes",
    "Point-to-Line Distance Formula", "Power Rule", "Power Series", "Product Rule",
    "Product-to-Sum Identity", "Queen's Rule", "Quotient Rule", "Ratio Test",
    "Pythagorean Theorem", "Quadratic Formula", "Rational Root Theorem", "Rationalization",
    "Real and Imaginary Parts", "Recursion", "Reflection", "Related Rates",
    "Remainder Theorem", "Removable Discontinuity", "Reverse Power Rule", "Riemann Sums", "Root Test",
    "Roots of Unity", "Row Operations", "Scalar Triple Product", "Second Derivative Test",
    "Separation of Variables", "Shell Method", "Simpson's Rule", "Squeeze Theorem",
    "Shoelace Theorem", "Stirling's Approximation", "Substitution", "Sum-to-Product Identity", "Symmetry",
    "Synthetic Division", "Tangency", "Taylor's Theorem", "Telescoping", "Triangle Inequality",
    "Trigonometric Identities", "Trigonometric Substitution", "U-Substitution",
    "Vieta's Formulas", "Weierstrass Substitution", "Z-Score",
  ];

  assert.deepEqual([...new Set(topics)].sort(), approvedTopics.sort());
  assert.deepEqual([...new Set(methods)].sort(), approvedMethods.sort());
});
