import { questions } from "@/data/questions";

import type {
  Division,
  Question,
} from "@/types/question";

export function getQuestionsByDivision(
  division: Division
): Question[] {
  return questions
    .filter(
      (question) =>
        question.division === division
    )
    .sort(
      (a, b) =>
        a.number - b.number
    );
}

export function getNextQuestion(
  id: number
): Question | null {
  const currentQuestion =
    questions.find(
      (question) =>
        question.id === id
    );

  if (!currentQuestion) {
    return null;
  }

  const divisionQuestions =
    getQuestionsByDivision(
      currentQuestion.division
    );

  const currentIndex =
    divisionQuestions.findIndex(
      (question) =>
        question.id === id
    );

  if (
    currentIndex === -1 ||
    currentIndex ===
      divisionQuestions.length - 1
  ) {
    return null;
  }

  return divisionQuestions[
    currentIndex + 1
  ];
}

export function getPreviousQuestion(
  id: number
): Question | null {
  const currentQuestion =
    questions.find(
      (question) =>
        question.id === id
    );

  if (!currentQuestion) {
    return null;
  }

  const divisionQuestions =
    getQuestionsByDivision(
      currentQuestion.division
    );

  const currentIndex =
    divisionQuestions.findIndex(
      (question) =>
        question.id === id
    );

  if (currentIndex <= 0) {
    return null;
  }

  return divisionQuestions[
    currentIndex - 1
  ];
}