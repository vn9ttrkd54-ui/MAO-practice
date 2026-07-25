import type { Question } from "@/types/question";

export const questions: Question[] = [
  
  
  {
    id: 20001,
    number: 1,
    division: "Alpha",
    topic: "Algebra",
    difficulty: 2,
    methods: ["Equations"],
    question: "Example Alpha question 1",
    choices: [
      "Choice A",
      "Choice B",
      "Choice C",
      "Choice D",
      "Choice E",
    ],
    answer: "B",
    solution: "Example solution",
  },
  {
    id: 30001,
    number: 1,
    division: "Theta",
    topic: "Number Theory",
    difficulty: 3,
    methods: ["Modular Arithmetic"],
    question: "Example Theta question 1",
    choices: [
      "Choice A",
      "Choice B",
      "Choice C",
      "Choice D",
      "Choice E",
    ],
    answer: "D",
    solution: "Example solution",
  },
];