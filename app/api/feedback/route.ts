import { NextResponse } from "next/server";

import { questions } from "@/data/questions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import type { Division } from "@/types/question";

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to submit feedback." }, { status: 401 });
  }

  let body: { kind?: "question_report" | "general_suggestion"; questionId?: number; division?: Division; message?: string };
  try {
    body = await readJsonBody<typeof body>(request, 16_384);
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: status === 413 ? "Feedback is too large." : "Invalid request." }, { status });
  }
  const message = body.message?.trim() ?? "";

  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { error: "Please enter between 10 and 2,000 characters." },
      { status: 400 }
    );
  }

  let questionId: number | null = null;
  let division: Division | null = null;

  if (body.kind === "question_report") {
    const question = questions.find((item) => item.id === body.questionId);
    if (!question || question.division !== body.division) {
      return NextResponse.json({ error: "That question could not be found." }, { status: 400 });
    }
    questionId = question.id;
    division = question.division;
  } else if (body.kind !== "general_suggestion") {
    return NextResponse.json({ error: "Invalid feedback type." }, { status: 400 });
  }

  const admin = createAdminClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await admin
    .from("feedback_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", oneHourAgo);

  if (countError) {
    return NextResponse.json({ error: "Unable to submit feedback right now." }, { status: 500 });
  }
  if ((count ?? 0) >= 10) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { error } = await admin.from("feedback_requests").insert({
    user_id: user.id,
    kind: body.kind,
    question_id: questionId,
    division,
    message,
  });

  if (error) {
    return NextResponse.json(
      { error: "Unable to submit feedback right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
