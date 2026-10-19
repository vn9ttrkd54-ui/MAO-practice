import "server-only";

import { getChallengeQuestionById } from "@/data/challengeQuestions";
import { questions } from "@/data/questions";
import { toBankChallenge } from "@/lib/challengeBankFallback";
import type { ChallengeQuestion, ChallengeQuestionId } from "@/types/challenge";

// Only the published bank is eligible, never data/question-references.
const bank = new Map(questions.map(question => [`CH-BANK-${question.id}`, question]));

export function requireDailyQuestionById(id: ChallengeQuestionId): ChallengeQuestion {
  const uploaded = getChallengeQuestionById(id);
  if (uploaded) return uploaded;
  const question = bank.get(id);
  if (question) return toBankChallenge(question);
  throw new Error("Daily question is unavailable. Please try again later.");
}
