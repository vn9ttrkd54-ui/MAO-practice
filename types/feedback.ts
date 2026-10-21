import type { Division } from "@/types/question";

export type FeedbackKind = "question_report" | "general_suggestion" | "question_submission";
export type FeedbackStatus = "open" | "resolved";

export interface FeedbackRequest {
  id: string;
  userId: string;
  username: string;
  kind: FeedbackKind;
  questionId: number | null;
  division: Division | null;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
}
