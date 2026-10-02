import { NextResponse } from "next/server";
import { acknowledgeMultiplayerQuestionReady } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { observeApi } from "@/lib/serverPerformance";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return observeApi("multiplayer.ready", async measure => {
    try {
      if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      const { questionNumber } = await readJsonBody<{ questionNumber: number }>(request, 1024);
      if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > 30) {
        return NextResponse.json({ error: "Choose a valid question." }, { status: 400 });
      }
      const { id } = await params;
      await measure("service", () => acknowledgeMultiplayerQuestionReady(id, questionNumber));
      return NextResponse.json({ ready: true }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      return NextResponse.json({ error: "Unable to confirm readiness." }, {
        status: error instanceof RequestBodyError ? error.status : 503,
      });
    }
  });
}
