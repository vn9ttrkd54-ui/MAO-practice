import type { Question } from "@/types/question";

// Temporary Alpha development bank.
// Replace these questions with reviewed competition content before launch.
export const alphaQuestions: Question[] = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const value = 5 * number + 2;

  return {
    id: 20000 + number,
    number,
    division: "Alpha",
    topic: "Algebra",
    difficulty: ((number - 1) % 5) + 1,
    methods: ["Substitution", "Simplifying Expressions"],
    question: `[Temporary] If x = ${number}, what is 3x + 2(x + 1)?`,
    choices: [value - 2, value - 1, value, value + 1, value + 2].map(String),
    answer: "C",
    solution: `Substitute x = ${number}: 3(${number}) + 2(${number} + 1) = ${value}.`,
  };
});
