export type Division =
  | "Mu"
  | "Alpha"
  | "Theta";

export type AnswerChoice =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E";

export interface Question {
  id: number;
  number: number;
  division: Division;
  topic: string;
  difficulty: number;
  methods: string[];
  question: string;
  choices: string[];
  answer: AnswerChoice;
  solution: string;
}