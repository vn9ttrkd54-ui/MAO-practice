import type { Question } from "@/types/question";

// Metadata-only editorial references. Restricted problem text, answers, solutions,
// and illustrations are excluded from this repository and its published history.
// Never import this module in app/runtime code.
// No bank numbers are assigned while national publication permission is pending.
type NationalReference = Omit<Question, "number" | "question" | "choices" | "answer" | "solution" | "illustration"> & {
  referenceSet: string;
  publicationStatus: "permission-pending";
};

export const muNationalReferences: NationalReference[] = [
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10089,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: ["Rationalization"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10090,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 3,
    methods: ["Trigonometric Identities"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10091,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10092,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10093,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 1,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10094,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Product Rule"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10095,
    division: "Mu",
    topic: "Optimization",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10096,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10097,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["Logarithmic Differentiation"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10098,
    division: "Mu",
    topic: "Sequences",
    difficulty: 4,
    methods: ["Recursion"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10099,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10100,
    division: "Mu",
    topic: "Differentiability",
    difficulty: 2,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10101,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["U-Substitution"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10102,
    division: "Mu",
    topic: "Fundamental Theorem of Calculus",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10103,
    division: "Mu",
    topic: "Power Series",
    difficulty: 3,
    methods: ["Power Series"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10104,
    division: "Mu",
    topic: "Telescoping Series",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10105,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["Trigonometric Identities"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10106,
    division: "Mu",
    topic: "Area Between Curves",
    difficulty: 2,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10107,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 3,
    methods: ["Trigonometric Substitution"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10108,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10109,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10110,
    division: "Mu",
    topic: "Generating Functions",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10111,
    division: "Mu",
    topic: "Power Series",
    difficulty: 4,
    methods: ["Ratio Test"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10112,
    division: "Mu",
    topic: "Series",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10113,
    division: "Mu",
    topic: "Systems of Equations",
    difficulty: 2,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10114,
    division: "Mu",
    topic: "Functions",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10115,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10116,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["Distance Formula", "First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10117,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    
    
    
    
  },
{
    referenceSet: "2026 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10118,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10001,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Chain Rule"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10002,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10003,
    division: "Mu",
    topic: "Limits",
    difficulty: 3,
    methods: ["Limit Definition of Derivatives"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10004,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Mean Value Theorem"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10005,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["Vieta's Formulas", "First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10006,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["Integral Properties"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10007,
    division: "Mu",
    topic: "Analytic Geometry",
    difficulty: 3,
    methods: ["Implicit Differentiation", "Tangency"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10008,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 3,
    methods: ["Continued Fractions", "Implicit Differentiation"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10009,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 3,
    methods: ["First Derivative Test", "Second Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10010,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 3,
    methods: ["Power Series"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10011,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["Distance Formula"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10012,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: ["Reverse Power Rule"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10013,
    division: "Mu",
    topic: "Area Between Curves",
    difficulty: 2,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10014,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: ["Simpson's Rule"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10015,
    division: "Mu",
    topic: "Volumes of Revolution",
    difficulty: 3,
    methods: ["Shell Method"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10016,
    division: "Mu",
    topic: "Riemann Sums",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10017,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10018,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["U-Substitution"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10019,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10020,
    division: "Mu",
    topic: "Fundamental Theorem of Calculus",
    difficulty: 4,
    methods: ["Chain Rule"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10021,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 5,
    methods: ["First-Order Linear Equations", "Integration by Parts"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10022,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 5,
    methods: ["Law of Cosines"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10023,
    division: "Mu",
    topic: "Inequalities",
    difficulty: 4,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10024,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10025,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 5,
    methods: ["Weierstrass Substitution"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10026,
    division: "Mu",
    topic: "Differentiability",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10027,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Gaussian Integral"],
    
    
    
    
  },
{
    referenceSet: "2025 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10028,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 1,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10029,
    division: "Mu",
    topic: "Limits",
    difficulty: 1,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10030,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 2,
    methods: ["Second Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10031,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 1,
    methods: ["Chain Rule"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10032,
    division: "Mu",
    topic: "Analytic Geometry",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10033,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 2,
    methods: ["Implicit Differentiation"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10034,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 3,
    methods: ["Logarithmic Differentiation", "Implicit Differentiation"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10035,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["Critical Points", "First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10036,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 3,
    methods: ["U-Substitution", "Power Rule"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10037,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["Integral Properties"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10038,
    division: "Mu",
    topic: "Rate of Change",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10039,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["U-Substitution"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10040,
    division: "Mu",
    topic: "Analytic Geometry",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10041,
    division: "Mu",
    topic: "Applications of Integration",
    difficulty: 4,
    methods: ["Reverse Power Rule"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10042,
    division: "Mu",
    topic: "Analytic Geometry",
    difficulty: 3,
    methods: ["Distance Formula"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10043,
    division: "Mu",
    topic: "Probability",
    difficulty: 4,
    methods: ["Infinite Geometric Series", "Complement Rule"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10044,
    division: "Mu",
    topic: "Fundamental Theorem of Calculus",
    difficulty: 4,
    methods: ["Limit Definition of Derivatives"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10045,
    division: "Mu",
    topic: "Probability",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10046,
    division: "Mu",
    topic: "Optimization",
    difficulty: 3,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10047,
    division: "Mu",
    topic: "Number Theory",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10048,
    division: "Mu",
    topic: "Probability",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10049,
    division: "Mu",
    topic: "Probability",
    difficulty: 4,
    methods: ["Recursion"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10050,
    division: "Mu",
    topic: "Applications of Integration",
    difficulty: 2,
    methods: ["Shell Method", "U-Substitution"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10051,
    division: "Mu",
    topic: "Applications of Integration",
    difficulty: 3,
    methods: ["Disk Method", "Gaussian Integral"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10052,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 5,
    methods: ["Integration by Parts", "Power Series", "Gaussian Integral"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10053,
    division: "Mu",
    topic: "Probability",
    difficulty: 5,
    methods: ["Riemann Sums"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10054,
    division: "Mu",
    topic: "Power Series",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10055,
    division: "Mu",
    topic: "Function Analysis",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10056,
    division: "Mu",
    topic: "Limits",
    difficulty: 5,
    methods: ["Taylor's Theorem", "Squeeze Theorem"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10057,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 4,
    methods: ["U-Substitution"],
    
    
    
    
  },
{
    referenceSet: "2024 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10058,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10059,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 1,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10060,
    division: "Mu",
    topic: "Trigonometry",
    difficulty: 2,
    methods: ["L'Hopital's Rule"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10061,
    division: "Mu",
    topic: "Complex Numbers",
    difficulty: 2,
    methods: ["De Moivre's Theorem"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10062,
    division: "Mu",
    topic: "Matrices",
    difficulty: 3,
    methods: ["Determinant"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10063,
    division: "Mu",
    topic: "Conic Sections",
    difficulty: 1,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10064,
    division: "Mu",
    topic: "Polynomial Equations",
    difficulty: 2,
    methods: ["Vieta's Formulas"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10065,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Chain Rule"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10066,
    division: "Mu",
    topic: "Optimization",
    difficulty: 2,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10067,
    division: "Mu",
    topic: "Limits",
    difficulty: 4,
    methods: ["Power Series"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10068,
    division: "Mu",
    topic: "Fundamental Theorem of Calculus",
    difficulty: 3,
    methods: ["Chain Rule"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10069,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10070,
    division: "Mu",
    topic: "Probability",
    difficulty: 4,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10071,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 2,
    methods: ["Trigonometric Substitution"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10072,
    division: "Mu",
    topic: "Implicit Differentiation",
    difficulty: 3,
    methods: ["Implicit Differentiation"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10073,
    division: "Mu",
    topic: "Power Series",
    difficulty: 3,
    methods: ["Power Series"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10074,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["U-Substitution"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10075,
    division: "Mu",
    topic: "Limits",
    difficulty: 2,
    methods: ["L'Hopital's Rule"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10076,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 3,
    methods: ["Separation of Variables"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10077,
    division: "Mu",
    topic: "Conic Sections",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10078,
    division: "Mu",
    topic: "Parametric",
    difficulty: 2,
    methods: ["Chain Rule"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10079,
    division: "Mu",
    topic: "Derivatives",
    difficulty: 2,
    methods: ["Second Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10080,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10081,
    division: "Mu",
    topic: "Differential Equations",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10082,
    division: "Mu",
    topic: "Polar Area",
    difficulty: 3,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10083,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 3,
    methods: ["King's Rule", "Queen's Rule"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10084,
    division: "Mu",
    topic: "Definite Integrals",
    difficulty: 4,
    methods: ["King's Rule", "Queen's Rule", "Weierstrass Substitution"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10085,
    division: "Mu",
    topic: "Telescoping Series",
    difficulty: 5,
    methods: [],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10086,
    division: "Mu",
    topic: "Improper Integrals",
    difficulty: 2,
    methods: ["U-Substitution"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10087,
    division: "Mu",
    topic: "Optimization",
    difficulty: 4,
    methods: ["First Derivative Test"],
    
    
    
    
  },
{
    referenceSet: "2023 MAO National Convention - Mu Individual",
    publicationStatus: "permission-pending",
    id: 10088,
    division: "Mu",
    topic: "Analytic Geometry",
    difficulty: 1,
    methods: ["Determinant"],
    
    
    
    
  },
];
