import { NextResponse } from "next/server";

import { questions } from "@/data/questions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AnswerChoice } from "@/types/question";

const ANSWERS = new Set<AnswerChoice>(["A", "B", "C", "D", "E"]);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 2_048) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    const body = JSON.parse(rawBody) as {
      questionId?: number;
      selectedAnswer?: AnswerChoice | null;
      elapsedSeconds?: number;
      trainer?: boolean;
    };
    const question = questions.find((item) => item.id === body.questionId);
    const answer = body.selectedAnswer ?? null;
    const elapsedSeconds = Math.max(0, Math.min(86_400, Math.floor(body.elapsedSeconds ?? 0)));

    if (!question || (answer !== null && !ANSWERS.has(answer)) || typeof body.trainer !== "boolean") {
      return NextResponse.json({ error: "Invalid practice result." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const result = answer === null
      ? "give-up"
      : answer === question.answer ? "correct" : "incorrect";
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("record_verified_practice_result", {
      target_user_id: user.id,
      target_question_id: question.id,
      result_value: result,
      elapsed_ms: elapsedSeconds * 1_000,
      award_trainer_level: body.trainer,
    });

    if (error) throw error;
    const stored = data as {
      progress: {
        attempts: number;
        correct: number;
        times: number[];
        lastResult: "correct" | "incorrect" | "give-up";
        lastCorrectAt: number | null;
      };
      levelChange: unknown;
    };
    return NextResponse.json({
      ...stored,
      progress: {
        ...stored.progress,
        times: stored.progress.times.map((milliseconds) => Math.floor(milliseconds / 1_000)),
      },
      isCorrect: result === "correct",
    });
  } catch {
    return NextResponse.json({ error: "Unable to save this result." }, { status: 500 });
  }
}
