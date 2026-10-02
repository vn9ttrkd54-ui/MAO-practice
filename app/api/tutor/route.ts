import { NextResponse } from "next/server";

import { questions } from "@/data/questions";
import {
  createTutorResponse,
  getTutorTokenReservation,
  TUTOR_DAILY_MESSAGE_LIMIT,
  TUTOR_MAX_HISTORY_LENGTH,
  TUTOR_MAX_HISTORY_MESSAGES,
  TUTOR_MAX_MESSAGE_LENGTH,
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
  status?: "reserved" | "busy" | "active" | "daily_limit" | "rate_limited" | "pool_exhausted" | "invalid" | "duplicate" | "unavailable";
  accounting_version?: number;
  daily_slot_version?: number;
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

function validRemaining(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value)
    && value >= 0 && value <= TUTOR_DAILY_MESSAGE_LIMIT;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to use the Llama Tutor.", code: "authentication" }, {
        status: 401, headers: { "Cache-Control": "no-store" },
      });
    }

    const admin = createAdminClient();
    // The database uses one snapshot and its Eastern date for counted answers
    // plus unresolved daily slots, including requests whose lease has expired.
    const { data, error } = await admin.rpc("get_ai_tutor_allowance", {
      target_user_id: user.id,
      daily_message_limit: TUTOR_DAILY_MESSAGE_LIMIT,
    });
    if (error) throw error;
    if (!data || data.status !== "available" || data.daily_slot_version !== 1
      || !validRemaining(data.messages_remaining)) {
      throw new Error("Unable to verify tutor allowance.");
    }
    return NextResponse.json(
      { messagesRemaining: data.messages_remaining },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Unable to check tutor usage." }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}

export async function POST(request: Request) {
  let requestId: string | null = null;
  let admin: ReturnType<typeof createAdminClient> | null = null;
  let providerStarted = false;
  let knownTokens: number | null = null;
  let countMessage = false;

  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const body = await readJsonBody<TutorRequest>(request, 8_192);
    if (!Number.isSafeInteger(body.questionId) || typeof body.message !== "string") {
      return NextResponse.json({ error: "Invalid tutor request." }, { status: 400 });
    }
    const question = questions.find((item) => item.id === body.questionId);
    const message = body.message.trim();
    const history = body.history === undefined ? [] : body.history;
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

    const tutorParams = { question, message, history, revealed, userId: user.id };
    // Validate configuration and reserve against this exact payload before any
    // provider call. Missing configuration must not consume the shared budget.
    const tokenReservation = getTutorTokenReservation(tutorParams);

    admin = createAdminClient();
    requestId = crypto.randomUUID();
    const { data: reservationData, error: reservationError } = await admin.rpc("reserve_ai_tutor_request_v2", {
      target_user_id: user.id,
      target_request_id: requestId,
      token_reservation: tokenReservation,
      daily_message_limit: TUTOR_DAILY_MESSAGE_LIMIT,
      concurrent_limit: 3,
      per_user_minute_limit: 5,
      global_minute_limit: 12,
    });
    if (reservationError) throw reservationError;

    if (!reservationData || typeof reservationData !== "object") {
      throw new Error("Invalid tutor reservation response.");
    }
    const reservation = reservationData as ReservationResult;
    if (["busy", "active", "daily_limit", "rate_limited", "pool_exhausted", "invalid", "duplicate", "unavailable"].includes(reservation.status ?? "")) {
      // This call created no reservation. In particular, never settle an existing
      // request ID if the database reports a duplicate.
      requestId = null;
    }
    if (reservation.status === "busy" || reservation.status === "active") {
      return NextResponse.json({ code: "busy", retryAfterMs: 3_000 }, {
        status: 429, headers: { "Retry-After": "3", "Cache-Control": "no-store" },
      });
    }
    if (reservation.status === "rate_limited") {
      return NextResponse.json({ error: "Please wait a moment before asking again.", code: "rate_limited" }, { status: 429 });
    }
    if (reservation.status === "daily_limit") {
      return NextResponse.json({ error: "Today's tutor requests are used or still processing. Check again later, or come back tomorrow.", code: "daily_limit", messagesRemaining: 0 }, { status: 429 });
    }
    if (reservation.status === "pool_exhausted") {
      return NextResponse.json({
        error: "I've used all my tokens for this month. Please ask ChatGPT until my supply is refilled.",
        code: "pool_exhausted",
      }, { status: 503 });
    }
    if (reservation.status !== "reserved" || reservation.accounting_version !== 2
      || reservation.daily_slot_version !== 1) {
      throw new Error("Unable to reserve a tutor request.");
    }

    providerStarted = true;
    const result = await createTutorResponse(tutorParams);
    knownTokens = result.totalTokens;
    countMessage = true;
    const { data: finishData, error: finishError } = await admin.rpc("finish_ai_tutor_request", {
      target_request_id: requestId,
      actual_tokens: knownTokens,
      count_message: countMessage,
      charge_tokens: knownTokens !== null,
    });
    if (finishError) throw finishError;

    const finish = finishData as { status?: string; accounting?: string; daily_slot_version?: number; messages_remaining?: number } | null;
    if (!finish || finish.status !== "finished" || finish.daily_slot_version !== 1
      || finish.accounting !== (knownTokens === null ? "held" : "settled")
      || !validRemaining(finish.messages_remaining)) {
      throw new Error("Unable to confirm tutor accounting.");
    }
    requestId = null;
    return NextResponse.json({
      message: result.text,
      messagesRemaining: finish.messages_remaining,
    });
  } catch (error) {
    if (requestId && admin) {
      if (error instanceof TutorProviderError) knownTokens = error.totalTokens;
      // A failed settlement must not erase usage already returned by the provider.
      // An unknown provider outcome keeps its durable debit; only a request that
      // definitely never reached the provider may be settled as known zero.
      const actualTokens = providerStarted ? knownTokens : 0;
      try {
        await admin.rpc("finish_ai_tutor_request", {
          target_request_id: requestId,
          actual_tokens: actualTokens,
          count_message: countMessage,
          charge_tokens: actualTokens !== null,
        });
      } catch {
        // The database retains the reservation debit if cleanup also fails.
        // Return the normal safe error instead of exposing a transport failure.
      }
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
