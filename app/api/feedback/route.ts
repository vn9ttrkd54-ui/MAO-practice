import { NextResponse } from "next/server";

import { questions } from "@/data/questions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Division } from "@/types/question";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to submit feedback." }, { status: 401 });
  }

  const body = (await request.json()) as {
    kind?: "question_report" | "general_suggestion";
    questionId?: number;
    division?: Division;
    message?: string;
  };
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
  const { error } = await admin.from("feedback_requests").insert({
    user_id: user.id,
    kind: body.kind,
    question_id: questionId,
    division,
    message,
  });

  if (error) {
    return NextResponse.json(
      { error: `Unable to submit feedback: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
