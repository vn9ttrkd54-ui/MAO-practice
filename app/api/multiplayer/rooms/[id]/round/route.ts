import { NextResponse } from "next/server";

import { getMultiplayerRoom, getMultiplayerRoundState, submitMultiplayerAnswer } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import type { AnswerChoice } from "@/types/question";
import { observeApi } from "@/lib/serverPerformance";

interface RoundRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RoundRouteContext) {
  return observeApi("multiplayer.round.read", async measure => {
    const serverReceivedAt = Date.now();
    const { id } = await params;
    const rawVersion = new URL(_request.url).searchParams.get("version");
    const version = rawVersion === null ? -1 : Number(rawVersion);
    const round = await measure("service", () => getMultiplayerRoundState(id, Number.isSafeInteger(version) ? version : -1));
    if (round) return NextResponse.json({ ...round, serverReceivedAt, serverSentAt: Date.now() }, { headers: { "Cache-Control": "no-store" } });
    const access = await measure("service", () => getMultiplayerRoom(id));
    if (access?.room.status === "completed") return new NextResponse(null, { status: 204 });
    return NextResponse.json({ status: "preparing" }, { status: 202, headers: { "Cache-Control": "no-store" } });
  });
}

export async function POST(request: Request, { params }: RoundRouteContext) {
  return observeApi("multiplayer.round.submit", async measure => {
    try {
      if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      const { id } = await params;
      const body = await readJsonBody<{ questionId?: number; selectedAnswer?: AnswerChoice | null }>(request, 2_048);
      if (!Number.isSafeInteger(body.questionId) || body.questionId! <= 0
        || (body.selectedAnswer !== null && !["A", "B", "C", "D", "E"].includes(body.selectedAnswer ?? ""))) {
        return NextResponse.json({ error: "Choose an answer or Give up." }, { status: 400 });
      }
      const selectedAnswer = body.selectedAnswer as AnswerChoice | null;
      await measure("service", () => submitMultiplayerAnswer({ roomId: id, questionId: body.questionId!, selectedAnswer }));
      return NextResponse.json({ accepted: true });
    } catch (error) {
      const status = error instanceof RequestBodyError ? error.status : 503;
      return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to submit answer." }, { status });
    }
  });
}
