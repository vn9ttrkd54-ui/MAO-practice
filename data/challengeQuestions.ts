import type {
  ChallengeQuestion,
  ChallengeQuestionId,
} from "@/types/challenge";

export const challengeQuestions = [
  {
    id: "CH-0001",
    division: "Mu",
    topic: "Algebra",
    difficulty: 2,
    question:
      "Three consecutive integers have a sum of 72. What is the greatest of the three integers?",
    choices: {
      A: "23",
      B: "24",
      C: "25",
      D: "26",
      E: "27",
    },
    answer: "C",
    solution:
      "Let the integers be n - 1, n, and n + 1. Their sum is 3n = 72, so n = 24. The greatest integer is 25.",
  },
  {
    id: "CH-0002",
    division: "Alpha",
    topic: "Geometry",
    difficulty: 3,
    question:
      "A rectangle has perimeter 34 units and length 3 units greater than its width. What is its area?",
    choices: {
      A: "60 square units",
      B: "64 square units",
      C: "70 square units",
      D: "72 square units",
      E: "77 square units",
    },
    answer: "C",
    solution:
      "If the width is w, the length is w + 3. Then 2w + 2(w + 3) = 34, so w = 7 and the length is 10. The area is 7 × 10 = 70 square units.",
  },
  {
    id: "CH-0003",
    division: "Theta",
    topic: "Number Theory",
    difficulty: 4,
    question:
      "What is the remainder when 2^20 is divided by 7?",
    choices: {
      A: "1",
      B: "2",
      C: "3",
      D: "4",
      E: "6",
    },
    answer: "D",
    solution:
      "Powers of 2 modulo 7 repeat every 3 exponents because 2^3 = 8 has remainder 1. Since 20 has remainder 2 when divided by 3, 2^20 has the same remainder as 2^2, which is 4.",
  },
  {
    id: "CH-0004",
    division: "Mu",
    topic: "Counting",
    difficulty: 3,
    question:
      "How many different three-letter arrangements can be made from the letters M, A, T, and H if no letter may be repeated?",
    choices: {
      A: "12",
      B: "18",
      C: "24",
      D: "36",
      E: "64",
    },
    answer: "C",
    solution:
      "There are 4 choices for the first letter, 3 for the second, and 2 for the third. Therefore, there are 4 × 3 × 2 = 24 arrangements.",
  },
  {
    id: "CH-0005",
    division: "Alpha",
    topic: "Probability",
    difficulty: 4,
    question:
      "A fair six-sided die is rolled twice. What is the probability that the sum of the two rolls is 9?",
    choices: {
      A: "1/12",
      B: "1/9",
      C: "1/8",
      D: "5/36",
      E: "1/6",
    },
    answer: "B",
    solution:
      "There are 36 equally likely ordered outcomes. The four outcomes with sum 9 are (3, 6), (4, 5), (5, 4), and (6, 3), so the probability is 4/36 = 1/9.",
  },
  {
    id: "CH-0006",
    division: "Theta",
    topic: "Arithmetic",
    difficulty: 1,
    question: "What is 1 + 1?",
    choices: {
      A: "1",
      B: "2",
      C: "3",
      D: "4",
      E: "5",
    },
    answer: "B",
    solution: "Adding 1 and 1 gives 2.",
  },
  {
    id: "CH-0007",
    division: "Mu",
    topic: "Percents",
    difficulty: 2,
    question:
      "A number is increased by 40%, and the result is 56. What was the original number?",
    choices: {
      A: "32",
      B: "36",
      C: "40",
      D: "42",
      E: "44",
    },
    answer: "C",
    solution:
      "Let the original number be n. Increasing n by 40% gives 1.4n = 56. Dividing by 1.4 gives n = 40.",
  },
  {
    id: "CH-0008",
    division: "Alpha",
    topic: "Algebra",
    difficulty: 3,
    question:
      "If x is nonzero and x + 1/x = 5, what is the value of x^2 + 1/x^2?",
    choices: {
      A: "21",
      B: "22",
      C: "24",
      D: "23",
      E: "25",
    },
    answer: "D",
    solution:
      "Square the given equation: (x + 1/x)^2 = x^2 + 2 + 1/x^2 = 25. Therefore, x^2 + 1/x^2 = 25 - 2 = 23.",
  },
  {
    id: "CH-0009",
    division: "Theta",
    topic: "Algebra",
    difficulty: 4,
    question:
      "If r is a root of x^2 - 5x + 1 = 0, what is the value of r^3 + 1/r^3?",
    choices: {
      A: "98",
      B: "100",
      C: "105",
      D: "108",
      E: "110",
    },
    answer: "E",
    solution:
      "Since r is nonzero, divide r^2 - 5r + 1 = 0 by r to get r + 1/r = 5. Using (r + 1/r)^3 = r^3 + 1/r^3 + 3(r + 1/r), we get 125 = r^3 + 1/r^3 + 15. Thus, r^3 + 1/r^3 = 110.",
  },
  {
    id: "CH-0010",
    division: "Mu",
    topic: "Number Theory",
    difficulty: 2,
    question:
      "What is the least positive integer that is divisible by both 12 and 18?",
    choices: {
      A: "24",
      B: "30",
      C: "36",
      D: "48",
      E: "72",
    },
    answer: "C",
    solution:
      "The prime factorizations are 12 = 2^2 times 3 and 18 = 2 times 3^2. Their least common multiple is 2^2 times 3^2 = 36.",
  },
  {
    id: "CH-0011",
    division: "Alpha",
    topic: "Geometry",
    difficulty: 3,
    question:
      "A right triangle has legs of length 9 and 12. What is the radius of its inscribed circle?",
    choices: {
      A: "2",
      B: "3",
      C: "4",
      D: "5",
      E: "6",
    },
    answer: "B",
    solution:
      "The hypotenuse is 15 by the Pythagorean theorem. The triangle has area 9 times 12 divided by 2, or 54, and semiperimeter (9 + 12 + 15)/2 = 18. Since area equals inradius times semiperimeter, the inradius is 54/18 = 3.",
  },
  {
    id: "CH-0012",
    division: "Theta",
    topic: "Counting",
    difficulty: 4,
    question:
      "How many four-digit even positive integers have no repeated digits?",
    choices: {
      A: "2016",
      B: "2160",
      C: "2240",
      D: "2296",
      E: "2304",
    },
    answer: "D",
    solution:
      "If the units digit is 0, there are 9 choices for the thousands digit, then 8 and 7 choices for the remaining digits, giving 9 times 8 times 7 = 504. If the units digit is 2, 4, 6, or 8, there are 4 choices for it, 8 choices for the nonzero thousands digit, then 8 and 7 choices for the remaining digits. This gives 4 times 8 times 8 times 7 = 1792. The total is 504 + 1792 = 2296.",
  },
  {
    id: "CH-0013",
    division: "Mu",
    topic: "Geometry",
    difficulty: 3,
    question:
      "A rectangular garden is 14 meters long and 9 meters wide. A path 1 meter wide runs along the inside edge of the garden. What is the area of the path?",
    choices: {
      A: "38 square meters",
      B: "40 square meters",
      C: "42 square meters",
      D: "44 square meters",
      E: "46 square meters",
    },
    answer: "C",
    solution:
      "The whole garden has area 14 times 9 = 126 square meters. Removing a 1-meter path from every edge leaves an inner rectangle measuring 12 by 7, with area 84. The path has area 126 - 84 = 42 square meters.",
  },
  {
    id: "CH-0014",
    division: "Alpha",
    topic: "Number Theory",
    difficulty: 4,
    question:
      "How many positive divisors does 360 have?",
    choices: {
      A: "12",
      B: "18",
      C: "20",
      D: "24",
      E: "30",
    },
    answer: "D",
    solution:
      "The prime factorization is 360 = 2^3 times 3^2 times 5. A divisor can use 0 through 3 factors of 2, 0 through 2 factors of 3, and 0 or 1 factor of 5. Therefore, the number of positive divisors is (3 + 1)(2 + 1)(1 + 1) = 24.",
  },
  {
    id: "CH-0015",
    division: "Theta",
    topic: "Geometry",
    difficulty: 4,
    question:
      "A triangle has side lengths 13, 14, and 15. What is the radius of its inscribed circle?",
    choices: {
      A: "3",
      B: "4",
      C: "5",
      D: "6",
      E: "7",
    },
    answer: "B",
    solution:
      "The semiperimeter is (13 + 14 + 15)/2 = 21. By Heron's formula, the area is the square root of 21 times 8 times 7 times 6, which is the square root of 7056, or 84. Since area equals inradius times semiperimeter, the inradius is 84/21 = 4.",
  },
  {
    id: "CH-0016",
    division: "Mu",
    topic: "Counting",
    difficulty: 3,
    question:
      "How many three-digit positive integers have hundreds digit 2 and no repeated digits?",
    choices: {
      A: "56",
      B: "63",
      C: "64",
      D: "72",
      E: "81",
    },
    answer: "D",
    solution:
      "The hundreds digit is fixed as 2. The tens digit can be any of the other 9 digits, including 0. After that choice, the units digit can be any of the 8 unused digits. Therefore, there are 9 times 8 = 72 integers.",
  },
  {
    id: "CH-0017",
    division: "Alpha",
    topic: "Probability",
    difficulty: 3,
    question:
      "A bag contains 4 red marbles and 3 blue marbles. Two marbles are drawn without replacement. What is the probability that exactly one marble is red?",
    choices: {
      A: "3/7",
      B: "1/2",
      C: "4/7",
      D: "2/3",
      E: "5/7",
    },
    answer: "C",
    solution:
      "There are 7 choose 2 = 21 equally likely pairs of marbles. To get exactly one red marble, choose 1 of the 4 red marbles and 1 of the 3 blue marbles, giving 4 times 3 = 12 pairs. The probability is 12/21 = 4/7.",
  },
  {
    id: "CH-0018",
    division: "Theta",
    topic: "Number Theory",
    difficulty: 4,
    question:
      "How many ordered pairs (x, y) of positive integers satisfy x^2 - y^2 = 45?",
    choices: {
      A: "2",
      B: "3",
      C: "4",
      D: "5",
      E: "6",
    },
    answer: "B",
    solution:
      "Factor the equation as (x - y)(x + y) = 45. The positive factor pairs (1, 45), (3, 15), and (5, 9) give (x, y) = (23, 22), (9, 6), and (7, 2), respectively. Thus, there are 3 ordered pairs.",
  },
  {
    id: "CH-0019",
    division: "Mu",
    topic: "Algebra",
    difficulty: 2,
    question:
      "What value of x satisfies 5(x - 2) = 3x + 14?",
    choices: {
      A: "8",
      B: "10",
      C: "12",
      D: "14",
      E: "16",
    },
    answer: "C",
    solution:
      "Expand the left side to get 5x - 10 = 3x + 14. Subtracting 3x and adding 10 gives 2x = 24, so x = 12.",
  },
  {
    id: "CH-0020",
    division: "Alpha",
    topic: "Sequences",
    difficulty: 3,
    question:
      "In an arithmetic sequence, the third term is 11 and the eighth term is 31. What is the twelfth term?",
    choices: {
      A: "39",
      B: "43",
      C: "45",
      D: "47",
      E: "51",
    },
    answer: "D",
    solution:
      "From the third term to the eighth term are 5 equal steps, so the common difference is (31 - 11)/5 = 4. The twelfth term is 4 steps after the eighth term, so it equals 31 + 4 times 4 = 47.",
  },
  {
    id: "CH-0021",
    division: "Theta",
    topic: "Polynomials",
    difficulty: 4,
    question:
      "What is the remainder when x^2026 is divided by x^2 + x + 1?",
    choices: {
      A: "x",
      B: "1",
      C: "x + 1",
      D: "-x - 1",
      E: "0",
    },
    answer: "A",
    solution:
      "Because x^3 - 1 = (x - 1)(x^2 + x + 1), we have x^3 congruent to 1 modulo x^2 + x + 1. Since 2026 has remainder 1 when divided by 3, x^2026 has the same remainder as x.",
  },
] as const satisfies readonly ChallengeQuestion[];

function buildChallengeQuestionMap(
  questions: readonly ChallengeQuestion[]
) {
  const questionMap = new Map<
    ChallengeQuestionId,
    ChallengeQuestion
  >();

  for (const question of questions) {
    if (questionMap.has(question.id)) {
      throw new Error(
        `Duplicate Challenge question ID: ${question.id}`
      );
    }

    questionMap.set(question.id, question);
  }

  return questionMap;
}

const challengeQuestionById = buildChallengeQuestionMap(
  challengeQuestions
);

export function getChallengeQuestionById(
  id: ChallengeQuestionId
): ChallengeQuestion | null {
  return challengeQuestionById.get(id) ?? null;
}

export function requireChallengeQuestionById(
  id: ChallengeQuestionId
): ChallengeQuestion {
  const question = getChallengeQuestionById(id);

  if (!question) {
    throw new Error(`Challenge question not found: ${id}`);
  }

  return question;
}
