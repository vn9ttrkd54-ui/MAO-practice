import "server-only";

import { questions } from "@/data/questions";
import { toQuestionBankItem } from "@/lib/questionBankListing";
import type { Division } from "@/types/question";

const listings = {
  Mu: questions.filter(question => question.division === "Mu").map(toQuestionBankItem).sort((a, b) => a.number - b.number),
  Alpha: questions.filter(question => question.division === "Alpha").map(toQuestionBankItem).sort((a, b) => a.number - b.number),
  Theta: questions.filter(question => question.division === "Theta").map(toQuestionBankItem).sort((a, b) => a.number - b.number),
};

export function getQuestionBankListing(division: Division) {
  return listings[division];
}
