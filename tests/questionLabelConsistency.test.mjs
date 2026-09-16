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
    "Analytic Geometry", "Applications of Integration", "Area Between Curves",
    "Binomial Expansion", "Complex Numbers", "Conic Sections", "Continuity",
    "Definite Integrals", "Derivatives", "Differentiability", "Differential Equations",
    "Function Analysis", "Functions", "Fundamental Theorem of Calculus",
    "Generating Functions", "Geometry", "Implicit Differentiation", "Improper Integrals",
    "Indefinite Integrals", "Inequalities", "Inverse Functions", "Limits",
    "Linear Approximation", "Logs and Exponents", "Matrices", "Number Theory",
    "Optimization", "Parametric", "Polar", "Polar Area", "Polynomial Equations",
    "Polynomials", "Power Series", "Probability", "Rate of Change", "Riemann Sums",
    "Sequences", "Sequences and Series", "Series", "Simplification", "Statistics",
    "Systems of Equations", "Telescoping Series", "Trigonometry", "Vectors",
    "Volumes of Revolution",
  ];
  const approvedMethods = [
    "Alternating Series Test", "Arc Length", "Arguments of Complex Numbers",
    "Binomial Theorem", "Cauchy-Schwarz Inequality", "Chain Rule", "Comparison Test",
    "Complement Rule", "Conditional Probability", "Continued Fractions", "Critical Points",
    "Cross Product", "Cross Sections", "De Moivre's Theorem",
    "Derivative of Inverse Functions", "Determinant", "Discriminant Test", "Disk Method",
    "Distance Formula", "Dot Product", "Double-Angle Identity", "Eccentricity",
    "Euler's Formula", "Even Functions", "Exponential Limits", "First Derivative Test",
    "First-Order Linear Equations", "Gaussian Integral", "Geometric Sequence",
    "Geometric Series", "Homogeneous First-Order Equations", "Imaginary-Part Argument",
    "Implicit Differentiation", "Infinite Geometric Series", "Infinite Series",
    "Integral Properties", "Integration by Parts", "Intermediate Value Theorem",
    "King's Rule", "L'Hopital's Rule", "Law of Cosines", "Law of Sines",
    "Limit Comparison Test", "Limit Definition of Derivatives", "Linear Approximation",
    "Logarithmic Differentiation", "Logarithms", "Matrix Inverse", "Matrix Multiplication",
    "Mean Value Theorem", "Modular Arithmetic", "Pappus's Theorem", "Partial Fractions",
    "Point-to-Line Distance Formula", "Power Rule", "Power Series", "Product Rule",
    "Product-to-Sum Identity", "Queen's Rule", "Quotient Rule", "Ratio Test",
    "Rational Root Theorem", "Rationalization", "Recursion", "Related Rates",
    "Remainder Theorem", "Reverse Power Rule", "Riemann Sums", "Root Test",
    "Roots of Unity", "Row Operations", "Second Derivative Test",
    "Separation of Variables", "Shell Method", "Simpson's Rule", "Squeeze Theorem",
    "Stirling's Approximation", "Substitution", "Sum-to-Product Identity", "Symmetry",
    "Synthetic Division", "Tangency", "Taylor's Theorem", "Telescoping",
    "Trigonometric Identities", "Trigonometric Substitution", "U-Substitution",
    "Vieta's Formulas", "Weierstrass Substitution", "Z-Score",
  ];

  assert.deepEqual([...new Set(topics)].sort(), approvedTopics.sort());
  assert.deepEqual([...new Set(methods)].sort(), approvedMethods.sort());
});
