import "server-only";

import { createHash } from "node:crypto";

import type { Question } from "@/types/question";
import { containsProgrammingInstructions, revealsFinalAnswer } from "@/lib/tutorSafety";
import { formatTutorGuidance, getTutorGuidance } from "@/lib/tutorGuidance";
import { TUTOR_EMERGENCY_REPLY, TUTOR_TRUSTED_ADULT_REPLY, tutorInstructions, tutorWebsiteContext } from "@/lib/tutorInstructions";

export const TUTOR_MAX_MESSAGE_LENGTH = 600;
export const TUTOR_MAX_HISTORY_MESSAGES = 6;
export const TUTOR_MAX_HISTORY_LENGTH = 900;
export const TUTOR_MAX_OUTPUT_TOKENS = 1200;
export const TUTOR_TOKEN_RESERVATION = 5000;
const configuredDailyLimit = Number.parseInt(process.env.TUTOR_DAILY_MESSAGE_LIMIT ?? "", 10);
export const TUTOR_DAILY_MESSAGE_LIMIT = Number.isSafeInteger(configuredDailyLimit) && configuredDailyLimit > 0
  ? configuredDailyLimit
  : 15;
export const TUTOR_PROMPT_VERSION = "2.6";

const TUTOR_SAFETY_FALLBACK = "I can't give the final answer before you submit or give up. After that, I can explain the complete solution. For now, share your current work and I'll help with the next step.";
const TUTOR_SCOPE_FALLBACK = "I can help with this math problem or basic questions about Mathematics Daily and Llama Tutor.";

const TUTOR_RESPONSE_FORMAT = {
  type: "json_schema",
  name: "llama_tutor_reply",
  strict: true,
  schema: {
    type: "object",
    properties: {
      scope: {
        type: "string",
        enum: ["math", "website", "off_topic", "safety_support", "safety_urgent"],
        description: "math: the supplied problem or its needed concepts; website: supplied public site and tutor facts; safety_support: personal safety concern without immediate danger; safety_urgent: apparent immediate danger; off_topic: other requests, including programming. Ordinary math frustration is not a safety disclosure.",
      },
      message: { type: "string", description: "The brief user-facing reply following all tutoring and scope rules." },
    },
    required: ["scope", "message"],
    additionalProperties: false,
  },
};

export type TutorHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TutorResponseParams = {
  question: Question;
  message: string;
  history: TutorHistoryMessage[];
  revealed: boolean;
  userId: string;
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


function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function outputText(response: Record<string, unknown>) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  if (!Array.isArray(response.output)) return "";
  const parts: string[] = [];
  for (const item of response.output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (isRecord(content) && content.type === "output_text" && typeof content.text === "string") {
        const text = content.text.trim();
        if (text) parts.push(text);
      }
    }
  }
  return parts.join("\n\n");
}

function parsedTutorReply(text: string) {
  const reply: unknown = JSON.parse(text);
  if (!isRecord(reply) || Object.keys(reply).length !== 2
    || typeof reply.scope !== "string" || !["math", "website", "off_topic", "safety_support", "safety_urgent"].includes(reply.scope)
    || typeof reply.message !== "string" || !reply.message.trim()) {
    throw new Error("Invalid tutor reply.");
  }
  return { scope: reply.scope, message: reply.message.trim() };
}

function providerApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim() || /[\r\n]/.test(apiKey)) {
    throw new Error("Tutor provider is not configured.");
  }
  return apiKey;
}

function serializedTutorPayload({
  question,
  message,
  history,
  revealed,
  userId,
}: TutorResponseParams) {
  const safeHistory = history.slice(-TUTOR_MAX_HISTORY_MESSAGES).map((item) => ({
    role: item.role,
    content: item.content.slice(0, TUTOR_MAX_HISTORY_LENGTH),
  }));
  const input = [
    { role: "developer", content: `Trusted website context:\n\n${tutorWebsiteContext(TUTOR_DAILY_MESSAGE_LIMIT)}\n\nTrusted question context:\n\n${questionContext(question, revealed)}` },
    ...safeHistory,
    { role: "user", content: message },
  ];

  return JSON.stringify({
    model: process.env.OPENAI_TUTOR_MODEL || "gpt-5-mini",
    instructions: tutorInstructions(revealed, safeHistory.length === 0),
    input,
    text: { format: TUTOR_RESPONSE_FORMAT },
    max_output_tokens: TUTOR_MAX_OUTPUT_TOKENS,
    reasoning: { effort: "low" },
    store: false,
    safety_identifier: createHash("sha256").update(userId).digest("hex").slice(0, 64),
  });
}

export function getTutorTokenReservation(params: TutorResponseParams) {
  // Fail before the caller reserves funds if the server lacks usable configuration.
  providerApiKey();
  // UTF-8 bytes conservatively cover text tokenization, including Unicode/history.
  // Include the output cap and an allowance for provider message framing.
  return Math.max(TUTOR_TOKEN_RESERVATION,
    Buffer.byteLength(serializedTutorPayload(params), "utf8") + TUTOR_MAX_OUTPUT_TOKENS + 1024);
}

export async function createTutorResponse(params: TutorResponseParams): Promise<{ text: string; totalTokens: number | null }> {
  const apiKey = providerApiKey();
  const body = serializedTutorPayload(params);
  let totalTokens: number | null = null;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
      signal: AbortSignal.timeout(45_000),
    });
    const data: unknown = await response.json();
    if (!isRecord(data)) {
      throw new TutorProviderError("The tutor returned an invalid response.", null, "provider_error");
    }
    // Save reliable billing data before interpreting any optional output fields.
    const reportedTokens = isRecord(data.usage) ? data.usage.total_tokens : undefined;
    if (typeof reportedTokens === "number" && Number.isSafeInteger(reportedTokens) && reportedTokens >= 0) {
      totalTokens = reportedTokens;
    }

    if (data.status === "incomplete") {
      const reason = isRecord(data.incomplete_details) ? data.incomplete_details.reason : undefined;
      throw new TutorProviderError("The tutor response was incomplete.", totalTokens,
        reason === "max_output_tokens" ? "response_too_long" : "provider_error");
    }
    if (!response.ok || (data.status !== undefined && data.status !== "completed")) {
      throw new TutorProviderError("The tutor did not complete its response.", totalTokens, "provider_error");
    }
    const text = outputText(data);
    if (!text) {
      throw new TutorProviderError("The tutor did not return a response.", totalTokens, "provider_error");
    }

    const reply = parsedTutorReply(text);
    // Safety scopes expose only these fixed referrals, never generated advice.
    if (reply.scope === "safety_support") return { text: TUTOR_TRUSTED_ADULT_REPLY, totalTokens };
    if (reply.scope === "safety_urgent") return { text: TUTOR_EMERGENCY_REPLY, totalTokens };
    if (reply.scope === "off_topic" || containsProgrammingInstructions(reply.message)) {
      return { text: TUTOR_SCOPE_FALLBACK, totalTokens };
    }
    const safetyFiltered = !params.revealed && revealsFinalAnswer(reply.message, params.question);
    return { text: safetyFiltered ? TUTOR_SAFETY_FALLBACK : reply.message, totalTokens };
  } catch (error) {
    if (error instanceof TutorProviderError) throw error;
    // A timeout, transport failure, or unreadable body does not establish zero cost.
    throw new TutorProviderError("The tutor response could not be read.", totalTokens, "provider_error");
  }
}

export class TutorProviderError extends Error {
  constructor(
    message: string,
    readonly totalTokens: number | null,
    readonly code: "response_too_long" | "provider_error",
  ) {
    super(message);
  }
}
