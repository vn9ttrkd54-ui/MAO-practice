import "server-only";

import { createHash } from "node:crypto";

import type { Question } from "@/types/question";
import { revealsFinalAnswer } from "@/lib/tutorSafety";
import { formatTutorGuidance, getTutorGuidance } from "@/lib/tutorGuidance";
import { tutorInstructions } from "@/lib/tutorInstructions";

export const TUTOR_MAX_MESSAGE_LENGTH = 600;
export const TUTOR_MAX_HISTORY_MESSAGES = 6;
export const TUTOR_MAX_HISTORY_LENGTH = 900;
export const TUTOR_MAX_OUTPUT_TOKENS = 1200;
export const TUTOR_TOKEN_RESERVATION = 5000;
const configuredDailyLimit = Number.parseInt(process.env.TUTOR_DAILY_MESSAGE_LIMIT ?? "", 10);
export const TUTOR_DAILY_MESSAGE_LIMIT = Number.isSafeInteger(configuredDailyLimit) && configuredDailyLimit > 0
  ? configuredDailyLimit
  : 15;
export const TUTOR_PROMPT_VERSION = "2.3";

const TUTOR_SAFETY_FALLBACK = "I can't give the final answer before you submit or give up. After that, I can explain the complete solution. For now, share your current work and I'll help with the next step.";

export type TutorHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIResponse = {
  status?: "completed" | "incomplete" | "failed";
  incomplete_details?: { reason?: string } | null;
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string };
};

function questionContext(question: Question, revealed: boolean) {
  const guidance = getTutorGuidance(question.id);
  const choices = question.choices
    .map((choice, index) => `${String.fromCharCode(65 + index)}. ${choice}`)
    .join("\n");
  const publicContext = [
    `Division: ${question.division}`,
    `Topic: ${question.topic}`,
    `Difficulty: ${question.difficulty}/5`,
    `Listed methods: ${question.methods.length ? question.methods.join(", ") : "Not specified"}`,
    `Question: ${question.question}`,
    `Choices:\n${choices}`,
  ];

  if (revealed) {
    publicContext.push(`Correct answer: ${question.answer}`);
    publicContext.push(`Official solution: ${question.solution}`);
  }

  if (guidance) {
    publicContext.push(`Tutor guidance written by the curriculum designer:\n${formatTutorGuidance(guidance)}`);
  }

  return publicContext.join("\n\n").slice(0, 16_000);
}


function outputText(response: OpenAIResponse) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text?.trim())
    .filter(Boolean)
    .join("\n\n");
}

export async function createTutorResponse({
  question,
  message,
  history,
  revealed,
  userId,
}: {
  question: Question;
  message: string;
  history: TutorHistoryMessage[];
  revealed: boolean;
  userId: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const safeHistory = history.slice(-TUTOR_MAX_HISTORY_MESSAGES).map((item) => ({
    role: item.role,
    content: item.content.slice(0, TUTOR_MAX_HISTORY_LENGTH),
  }));
  const input = [
    { role: "developer", content: `Trusted question context:\n\n${questionContext(question, revealed)}` },
    ...safeHistory,
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TUTOR_MODEL || "gpt-5-mini",
      instructions: tutorInstructions(revealed, safeHistory.length === 0),
      input,
      max_output_tokens: TUTOR_MAX_OUTPUT_TOKENS,
      reasoning: { effort: "low" },
      store: false,
      safety_identifier: createHash("sha256").update(userId).digest("hex").slice(0, 64),
    }),
    signal: AbortSignal.timeout(45_000),
  });
  const data = (await response.json()) as OpenAIResponse;
  const text = outputText(data);
  const totalTokens = Math.max(0, Math.floor(data.usage?.total_tokens ?? 0));

  if (process.env.NODE_ENV === "development") {
    console.info("[tutor] OpenAI response", {
      promptVersion: TUTOR_PROMPT_VERSION,
      firstMessage: safeHistory.length === 0,
      status: data.status ?? "unknown",
      incompleteReason: data.incomplete_details?.reason ?? null,
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0,
      totalTokens,
    });
  }

  if (data.status === "incomplete") {
    throw new TutorProviderError(
      `The tutor response was incomplete (${data.incomplete_details?.reason ?? "unknown reason"}).`,
      totalTokens,
      data.incomplete_details?.reason === "max_output_tokens" ? "response_too_long" : "provider_error",
    );
  }

  if (!response.ok || !text) {
    throw new TutorProviderError(data.error?.message ?? "The tutor did not return a response.", totalTokens, "provider_error");
  }

  const safetyFiltered = !revealed && revealsFinalAnswer(text, question);
  if (safetyFiltered && process.env.NODE_ENV === "development") {
    console.warn("[tutor] Replaced a response that appeared to reveal the final answer.", {
      promptVersion: TUTOR_PROMPT_VERSION,
      questionId: question.id,
    });
  }

  return { text: safetyFiltered ? TUTOR_SAFETY_FALLBACK : text, totalTokens };
}

export class TutorProviderError extends Error {
  constructor(
    message: string,
    readonly totalTokens: number,
    readonly code: "response_too_long" | "provider_error",
  ) {
    super(message);
  }
}
