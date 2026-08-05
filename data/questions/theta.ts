import type { Question } from "@/types/question";

// Temporary Theta development bank.
// Replace these questions with reviewed competition content before launch.
export const thetaQuestions: Question[] = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const expression = number * number + 3 * number + 5;
  const value = expression % 11;

  return {
    id: 30000 + number,
    number,
    division: "Theta",
    topic: "Number Theory",
    difficulty: ((number - 1) % 5) + 1,
    methods: ["Modular Arithmetic"],
    question: `[Temporary] What is the remainder when ${number}² + 3(${number}) + 5 is divided by 11?`,
    choices: [value - 2, value - 1, value, value + 1, value + 2].map(String),
    answer: "C",
    solution: `${number}² + 3(${number}) + 5 = ${expression}, which has remainder ${value} when divided by 11.`,
  };
});
