import { NextResponse } from "next/server";

import { acknowledgeMultiplayerQuestionDelivery } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";

interface DeliveryRouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: DeliveryRouteContext) {
  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const { id } = await params;
    const body = await readJsonBody<{ questionNumber?: number }>(request, 1_024);
    if (!body.questionNumber) {
      return NextResponse.json({ error: "Choose a valid question." }, { status: 400 });
    }

    const receipt = await acknowledgeMultiplayerQuestionDelivery(id, body.questionNumber);
    return NextResponse.json(receipt, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to start your question timer.",
    }, { status });
  }
}
