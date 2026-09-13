import { NextResponse } from "next/server";

import { questions } from "@/data/questions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    const body = await readJsonBody<{ questionId?: unknown; trainer?: unknown; requestId?: unknown }>(request, 2_048);
    if (typeof body.questionId !== "number" || !Number.isSafeInteger(body.questionId)
      || !questions.some((question) => question.id === body.questionId)
      || typeof body.trainer !== "boolean"
      || typeof body.requestId !== "string" || !UUID.test(body.requestId)) {
      return NextResponse.json({ error: "Invalid practice attempt." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const { data, error } = await createAdminClient().rpc("begin_practice_attempt", {
      target_user_id: user.id,
      target_question_id: body.questionId,
      award_trainer_level: body.trainer,
      client_request_id: body.requestId,
    });
    if (error) throw error;
    if (data?.status === "rate_limited") return NextResponse.json({ error: "Too many practice requests. Please wait a minute and try again." }, { status: 429, headers: { "Retry-After": "60" } });
    if (data?.status === "conflict") return NextResponse.json({ error: "This attempt belongs to a different question. Please reload the page." }, { status: 409 });
    if (data?.status === "expired") return NextResponse.json({ error: "This practice attempt has expired. Please reload to start again." }, { status: 410 });
    if (data?.status === "invalid") return NextResponse.json({ error: "Invalid practice attempt." }, { status: 400 });
    if (data?.status !== "started" || typeof data.attemptId !== "string" || !UUID.test(data.attemptId)) throw new Error("Invalid attempt response");
    return NextResponse.json({ attemptId: data.attemptId }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof RequestBodyError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Unable to start this practice attempt. Please try again." }, { status: 500 });
  }
}
