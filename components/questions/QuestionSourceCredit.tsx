import type { QuestionSource } from "@/types/question";

export default function QuestionSourceCredit({ source }: { source?: QuestionSource }) {
  if (!source) return null;

  return <p aria-label="Question source" className="mb-4 mt-2 break-words text-xs font-normal leading-5 text-slate-600">
    Source: {source.competition} · {source.event} · Question {source.questionNumber}
  </p>;
}
