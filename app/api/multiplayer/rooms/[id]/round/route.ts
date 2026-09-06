import { NextResponse } from "next/server";

import { getMultiplayerRoom, getMultiplayerRoundState, submitMultiplayerAnswer } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import type { AnswerChoice } from "@/types/question";

interface RoundRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RoundRouteContext) {
  const serverReceivedAt = Date.now();
  const { id } = await params;
  const round = await getMultiplayerRoundState(id);
  if (round) return NextResponse.json({ ...round, serverReceivedAt, serverSentAt: Date.now() }, { headers: { "Cache-Control": "no-store" } });
  const access = await getMultiplayerRoom(id);
  if (access?.room.status === "completed") return new NextResponse(null, { status: 204 });
  return NextResponse.json({ status: "preparing" }, { status: 202, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request, { params }: RoundRouteContext) {
  try {
    if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    const { id } = await params;
    const body = await readJsonBody<{ questionId?: number; selectedAnswer?: AnswerChoice }>(request, 2_048);
    if (!body.questionId || !body.selectedAnswer) return NextResponse.json({ error: "Choose an answer." }, { status: 400 });
    await submitMultiplayerAnswer({ roomId: id, questionId: body.questionId, selectedAnswer: body.selectedAnswer });
    return NextResponse.json({ accepted: true });
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 503;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to submit answer." }, { status });
  }
}
