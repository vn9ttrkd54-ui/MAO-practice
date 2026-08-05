import type { Question } from "@/types/question";

import { alphaQuestions } from "@/data/questions/alpha";
import { muQuestions } from "@/data/questions/mu";
import { thetaQuestions } from "@/data/questions/theta";

export { alphaQuestions, muQuestions, thetaQuestions };

export const questions: Question[] = [
  ...muQuestions,
  ...alphaQuestions,
  ...thetaQuestions,
];
