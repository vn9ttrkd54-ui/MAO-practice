import { NextResponse } from "next/server";

import { acknowledgeMultiplayerResult } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest } from "@/lib/security/request";
import { observeApi } from "@/lib/serverPerformance";

interface Context { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Context) {
  return observeApi("multiplayer.results.ack", async measure => {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    const { id } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }
    try {
      const acknowledged = await measure("service", () => acknowledgeMultiplayerResult(id));
      return new NextResponse(null, { status: acknowledged ? 204 : 404 });
    } catch {
      return NextResponse.json({ error: "Please retry." }, { status: 503 });
    }
  });
}
