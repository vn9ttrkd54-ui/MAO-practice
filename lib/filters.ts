import { questions } from "@/data/questions";

import type {
  Division,
  Question,
} from "@/types/question";

type FilterQuestionsOptions = {
  division: Division;
  topic: string;
  difficulty: string;
  method: string;
};

export function getTopics(
  division: Division
): string[] {
  return Array.from(
    new Set(
      questions
        .filter(
          (question) =>
            question.division === division
        )
        .map(
          (question) =>
            question.topic
        )
    )
  ).sort();
}

export function getDifficulties(
  division: Division
): number[] {
  return Array.from(
    new Set(
      questions
        .filter(
          (question) =>
            question.division === division
        )
        .map(
          (question) =>
            question.difficulty
        )
    )
  ).sort((a, b) => a - b);
}

export function getMethods(
  division: Division
): string[] {
  return Array.from(
    new Set(
      questions
        .filter(
          (question) =>
            question.division === division
        )
        .flatMap(
          (question) =>
            question.methods
        )
    )
  ).sort();
}

export function filterQuestions({
  division,
  topic,
  difficulty,
  method,
}: FilterQuestionsOptions): Question[] {
  return questions.filter((question) => {
    if (question.division !== division) {
      return false;
    }

    if (
      topic !== "All Topics" &&
      question.topic !== topic
    ) {
      return false;
    }

    if (
      difficulty !== "All Difficulties" &&
      question.difficulty !== Number(difficulty)
    ) {
      return false;
    }

    if (
      method !== "All Methods" &&
      !question.methods.includes(method)
    ) {
      return false;
    }

    return true;
  });
}