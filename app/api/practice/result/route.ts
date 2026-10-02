import { NextResponse } from "next/server";

import { questions } from "@/data/questions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { createTutorRevealToken } from "@/lib/tutorRevealToken";
import { isPracticeTiming, PRACTICE_TIMING_LIMIT } from "@/lib/practiceTiming";
import type { PracticeTiming } from "@/types/progress";
import { observeApi } from "@/lib/serverPerformance";

const ANSWERS = new Set(["A", "B", "C", "D", "E"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  return observeApi("practice.result", async measure => {
    try {
      if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

      const body = await readJsonBody<{
        questionId?: unknown;
        selectedAnswer?: unknown;
        elapsedSeconds?: unknown;
        trainer?: unknown;
        attemptId?: unknown;
      }>(request, 2_048);
      const answer = body.selectedAnswer ?? null;
      const elapsed = body.elapsedSeconds === undefined ? 0 : body.elapsedSeconds;

      if (typeof body.questionId !== "number" || !Number.isSafeInteger(body.questionId)
        || typeof body.attemptId !== "string" || !UUID.test(body.attemptId)
        || (answer !== null && (typeof answer !== "string" || !ANSWERS.has(answer)))
        || typeof body.trainer !== "boolean"
        || typeof elapsed !== "number" || !Number.isFinite(elapsed) || Math.abs(elapsed) > Number.MAX_SAFE_INTEGER) {
        return NextResponse.json({ error: "Invalid practice result." }, { status: 400 });
      }
      const question = questions.find((item) => item.id === body.questionId);
      if (!question) return NextResponse.json({ error: "Invalid practice result." }, { status: 400 });
      const elapsedSeconds = Math.max(0, Math.min(86_400, Math.floor(elapsed)));

      const supabase = await createClient();
      const { data: { user } } = await measure("auth", () => supabase.auth.getUser());
      if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

      const result = answer === null
        ? "give-up"
        : answer === question.answer ? "correct" : "incorrect";
      const admin = createAdminClient();
      const { data, error } = await measure("data", () => admin.rpc("finish_practice_attempt_v2", {
        target_user_id: user.id,
        target_attempt_id: body.attemptId,
        target_question_id: question.id,
        selected_answer: answer,
        result_value: result,
        elapsed_ms: elapsedSeconds * 1_000,
        award_trainer_level: body.trainer,
      }));

      if (error) throw error;
      if (data?.status === "rate_limited") return NextResponse.json({ error: "Too many practice results. Please wait a minute and retry this answer." }, { status: 429, headers: { "Retry-After": "60" } });
      if (data?.status === "conflict") return NextResponse.json({ error: "This attempt already has a different result. Please reload to start again." }, { status: 409 });
      if (data?.status === "expired") return NextResponse.json({ error: "This practice attempt has expired. Please reload to start again." }, { status: 410 });
      if (data?.status === "invalid") return NextResponse.json({ error: "Invalid practice attempt. Please reload to start again." }, { status: 400 });
      if (data?.status !== "saved" || !data.progress || !Array.isArray(data.progress.times)
        || data.progress.times.length > PRACTICE_TIMING_LIMIT || !isPracticeTiming(data.progress.timing)
        || data.progress.timing.count < data.progress.times.length
        || typeof data.isCorrect !== "boolean") throw new Error("Invalid result response");
      const stored = data as {
        progress: {
          attempts: number;
          correct: number;
          times: Array<number | null>;
          timing: PracticeTiming;
          lastResult: "correct" | "incorrect" | "give-up";
          lastCorrectAt: number | null;
        };
        levelChange: unknown;
        isCorrect: boolean;
      };
      return NextResponse.json({
        levelChange: stored.levelChange,
        tutorRevealToken: createTutorRevealToken(user.id, question.id),
        progress: {
          ...stored.progress,
          times: stored.progress.times.map((milliseconds) => Math.floor((milliseconds ?? 0) / 1_000)),
        },
        isCorrect: stored.isCorrect,
      }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      if (error instanceof RequestBodyError) return NextResponse.json({ error: error.message }, { status: error.status });
      return NextResponse.json({ error: "Unable to save this result." }, { status: 500 });
    }
  });
}
