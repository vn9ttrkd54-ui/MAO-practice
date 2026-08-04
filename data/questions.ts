import type { Division, Question } from "@/types/question";

// Temporary development bank for multiplayer and practice testing.
// Replace these generated questions with official reviewed content before launch.

interface TemporaryQuestionConfig {
  division: Division;
  idBase: number;
  topic: string;
  methods: string[];
  build: (number: number) => {
    prompt: string;
    value: number;
    solution: string;
  };
}

function createChoices(value: number): string[] {
  return [value - 2, value - 1, value, value + 1, value + 2].map(String);
}

function createTemporaryDivisionQuestions({
  division,
  idBase,
  topic,
  methods,
  build,
}: TemporaryQuestionConfig): Question[] {
  return Array.from({ length: 30 }, (_, index) => {
    const number = index + 1;
    const { prompt, value, solution } = build(number);

    return {
      id: idBase + number,
      number,
      division,
      topic,
      difficulty: ((number - 1) % 5) + 1,
      methods,
      question: `[Temporary] ${prompt}`,
      choices: createChoices(value),
      answer: "C",
      solution,
    };
  });
}

const muQuestions = createTemporaryDivisionQuestions({
  division: "Mu",
  idBase: 10000,
  topic: "Arithmetic",
  methods: ["Order of Operations"],
  build: (number) => {
    const first = number + 6;
    const second = number * 2;
    const value = first + second;

    return {
      prompt: `What is ${first} + ${second}?`,
      value,
      solution: `${first} + ${second} = ${value}.`,
    };
  },
});

const alphaQuestions = createTemporaryDivisionQuestions({
  division: "Alpha",
  idBase: 20000,
  topic: "Algebra",
  methods: ["Substitution", "Simplifying Expressions"],
  build: (number) => {
    const value = 5 * number + 2;

    return {
      prompt: `If x = ${number}, what is 3x + 2(x + 1)?`,
      value,
      solution: `Substitute x = ${number}: 3(${number}) + 2(${number} + 1) = ${value}.`,
    };
  },
});

const thetaQuestions = createTemporaryDivisionQuestions({
  division: "Theta",
  idBase: 30000,
  topic: "Number Theory",
  methods: ["Modular Arithmetic"],
  build: (number) => {
    const expression = number * number + 3 * number + 5;
    const value = expression % 11;

    return {
      prompt: `What is the remainder when ${number}² + 3(${number}) + 5 is divided by 11?`,
      value,
      solution: `${number}² + 3(${number}) + 5 = ${expression}, which has remainder ${value} when divided by 11.`,
    };
  },
});

export const questions: Question[] = [
  ...muQuestions,
  ...alphaQuestions,
  ...thetaQuestions,
];
