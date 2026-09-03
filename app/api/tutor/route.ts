import { NextResponse } from "next/server";

import { questions } from "@/data/questions";
import {
  createTutorResponse,
  TUTOR_DAILY_MESSAGE_LIMIT,
  TUTOR_MAX_HISTORY_LENGTH,
  TUTOR_MAX_HISTORY_MESSAGES,
  TUTOR_MAX_MESSAGE_LENGTH,
  TUTOR_TOKEN_RESERVATION,
  TutorProviderError,
  type TutorHistoryMessage,
} from "@/lib/aiTutor";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyTutorRevealToken } from "@/lib/tutorRevealToken";

type TutorRequest = {
  questionId?: number;
  message?: string;
  history?: TutorHistoryMessage[];
  revealToken?: string | null;
};

type ReservationResult = {
  status?: "reserved" | "busy" | "active" | "daily_limit" | "rate_limited" | "pool_exhausted" | "invalid";
  messages_remaining?: number;
};

function validHistory(value: unknown): value is TutorHistoryMessage[] {
  return Array.isArray(value)
    && value.length <= TUTOR_MAX_HISTORY_MESSAGES
    && value.every((item) => item
      && typeof item === "object"
      && (item.role === "user" || item.role === "assistant")
      && typeof item.content === "string"
      && item.content.length > 0
      && item.content.length <= TUTOR_MAX_HISTORY_LENGTH);
}

function currentEasternDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to use the Llama Tutor.", code: "authentication" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("ai_tutor_daily_usage")
      .select("messages_used")
      .eq("user_id", user.id)
      .eq("usage_date", currentEasternDate())
      .maybeSingle();
    if (error) throw error;

    const messagesUsed = Math.max(0, data?.messages_used ?? 0);
    return NextResponse.json(
      { messagesRemaining: Math.max(0, TUTOR_DAILY_MESSAGE_LIMIT - messagesUsed) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Unable to check tutor usage." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let requestId: string | null = null;
  let admin: ReturnType<typeof createAdminClient> | null = null;

  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const body = await readJsonBody<TutorRequest>(request, 8_192);
    const question = questions.find((item) => item.id === body.questionId);
    const message = body.message?.trim() ?? "";
    const history = body.history ?? [];
    if (message.length > TUTOR_MAX_MESSAGE_LENGTH) {
      return NextResponse.json({
        error: "That is too much for one llama-sized message. Please shorten it, or ask ChatGPT if you need to send the whole thing.",
        code: "message_too_long",
      }, { status: 400 });
    }
    if (
      !question
      || !message
      || !validHistory(history)
      || (body.revealToken !== undefined && body.revealToken !== null
        && (typeof body.revealToken !== "string" || body.revealToken.length > 256))
    ) {
      return NextResponse.json({ error: "Invalid tutor request." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to use the Llama Tutor.", code: "authentication" }, { status: 401 });
    }

    const revealed = Boolean(body.revealToken && verifyTutorRevealToken(
      body.revealToken,
      user.id,
      question.id,
    ));

    admin = createAdminClient();
    requestId = crypto.randomUUID();
    const { data: reservationData, error: reservationError } = await admin.rpc("reserve_ai_tutor_request", {
      target_user_id: user.id,
      target_request_id: requestId,
      token_reservation: TUTOR_TOKEN_RESERVATION,
      daily_message_limit: TUTOR_DAILY_MESSAGE_LIMIT,
      concurrent_limit: 3,
      per_user_minute_limit: 3,
      global_minute_limit: 12,
    });
    if (reservationError) throw reservationError;

    const reservation = reservationData as ReservationResult;
    if (reservation.status === "busy" || reservation.status === "active") {
      return NextResponse.json({ code: "busy", retryAfterMs: 1_200 }, { status: 429 });
    }
    if (reservation.status === "rate_limited") {
      return NextResponse.json({ error: "Please wait a moment before asking again.", code: "rate_limited" }, { status: 429 });
    }
    if (reservation.status === "daily_limit") {
      return NextResponse.json({ error: "The Llama Tutor is resting until tomorrow.", code: "daily_limit", messagesRemaining: 0 }, { status: 429 });
    }
    if (reservation.status === "pool_exhausted") {
      return NextResponse.json({
        error: "I've used all my tokens for this month. Please ask ChatGPT until my supply is refilled.",
        code: "pool_exhausted",
      }, { status: 503 });
    }
    if (reservation.status !== "reserved") {
      throw new Error("Unable to reserve a tutor request.");
    }

    const result = await createTutorResponse({
      question,
      message,
      history,
      revealed,
      userId: user.id,
    });
    const { data: finishData, error: finishError } = await admin.rpc("finish_ai_tutor_request", {
      target_request_id: requestId,
      actual_tokens: result.totalTokens,
      count_message: true,
      charge_tokens: true,
    });
    if (finishError) throw finishError;
    requestId = null;

    const finish = finishData as { messages_remaining?: number };
    return NextResponse.json({
      message: result.text,
      messagesRemaining: finish.messages_remaining ?? Math.max(0, (reservation.messages_remaining ?? 1) - 1),
    });
  } catch (error) {
    if (requestId && admin) {
      const actualTokens = error instanceof TutorProviderError ? error.totalTokens : 0;
      await admin.rpc("finish_ai_tutor_request", {
        target_request_id: requestId,
        actual_tokens: actualTokens,
        count_message: false,
        charge_tokens: actualTokens > 0,
      });
    }
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof TutorProviderError && error.code === "response_too_long") {
      return NextResponse.json({
        error: "That answer needs more tokens than I can safely use in one reply. Ask me a smaller question, or use ChatGPT for the full version.",
        code: "response_too_long",
      }, { status: 503 });
    }
    return NextResponse.json({ error: "I couldn't connect right now. Please wait a moment and try again.", code: "unavailable" }, { status: 503 });
  }
}
