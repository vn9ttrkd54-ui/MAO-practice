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
