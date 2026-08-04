import { NextResponse } from "next/server";

import { getMultiplayerRoundState, submitMultiplayerAnswer } from "@/lib/services/multiplayerService";
import type { AnswerChoice } from "@/types/question";

interface RoundRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RoundRouteContext) {
  const { id } = await params;
  const round = await getMultiplayerRoundState(id);
  return round ? NextResponse.json(round, { headers: { "Cache-Control": "no-store" } }) : new NextResponse(null, { status: 204 });
}

export async function POST(request: Request, { params }: RoundRouteContext) {
  try {
    const { id } = await params;
    const body = await request.json() as { questionId?: number; selectedAnswer?: AnswerChoice };
    if (!body.questionId || !body.selectedAnswer) return NextResponse.json({ error: "Choose an answer." }, { status: 400 });
    const round = await submitMultiplayerAnswer({ roomId: id, questionId: body.questionId, selectedAnswer: body.selectedAnswer });
    return round ? NextResponse.json(round) : new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to submit answer." }, { status: 400 });
  }
}
