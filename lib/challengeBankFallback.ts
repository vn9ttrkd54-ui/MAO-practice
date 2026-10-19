import type { ChallengeQuestion, ChallengeQuestionId } from "@/types/challenge";
import type { AnswerChoice, Division, Question } from "@/types/question";

const choices: AnswerChoice[] = ["A", "B", "C", "D", "E"];

export function toBankChallenge(question: Question): ChallengeQuestion {
  return {
    id: `CH-BANK-${question.id}`,
    division: question.division,
    topic: question.topic,
    difficulty: question.difficulty,
    question: question.question,
    choices: Object.fromEntries(choices.map((choice, i) => [choice, question.choices[i]])) as Record<AnswerChoice, string>,
    answer: question.answer,
    solution: question.solution,
    illustration: question.illustration,
    source: question.source,
  };
}

/** Random among unused questions; after exhaustion, rotate the oldest assignment. */
export function pickBankChallenge(
  bank: readonly Question[],
  division: Division,
  history: readonly { question_id: string; challenge_date: string }[],
  random: () => number = Math.random,
): ChallengeQuestionId | null {
  const lastUsed = new Map<string, string>();
  for (const row of history) {
    if (row.challenge_date > (lastUsed.get(row.question_id) ?? "")) {
      lastUsed.set(row.question_id, row.challenge_date);
    }
  }
  let oldest = "9999-12-31";
  let candidates: ChallengeQuestionId[] = [];
  for (const question of bank) {
    if (question.division !== division) continue;
    const id: ChallengeQuestionId = `CH-BANK-${question.id}`;
    const used = lastUsed.get(id) ?? "";
    if (used < oldest) { oldest = used; candidates = [id]; }
    else if (used === oldest) candidates.push(id);
  }
  return candidates.length ? candidates[Math.floor(random() * candidates.length)] : null;
}
