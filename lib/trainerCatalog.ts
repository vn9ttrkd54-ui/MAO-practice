import "server-only";

import { questions } from "@/data/questions";
import type { TrainerQuestionItem } from "@/types/trainer";

// Keep catalog order: it is part of the existing weighted selection behavior.
const items: TrainerQuestionItem[] = questions.map(({ id, number, division, topic, difficulty }) => ({
  id, number, division, topic, difficulty,
}));
const byId = new Map(questions.map(question => [question.id, question]));

export function getTrainerItems() { return items; }
export function getTrainerQuestion(id: number) { return byId.get(id) ?? null; }
