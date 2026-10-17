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

export interface QuestionIllustration {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface QuestionSource {
  competition: string;
  event: string;
  questionNumber: number;
}

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
  illustration?: QuestionIllustration;
  source?: QuestionSource;
}
