import { NextResponse } from "next/server";

import { leavePublicSpectator, spectatePublicMatch } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest } from "@/lib/security/request";

interface SpectateRouteContext { params: Promise<{ id: string }>; }

export async function GET(_request: Request, { params }: SpectateRouteContext) {
  try {
    const { id } = await params;
    return NextResponse.json(await spectatePublicMatch(id), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to spectate.";
    if (message === "That public match is no longer in progress.") {
      return NextResponse.json({ completed: true }, { headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: SpectateRouteContext) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  await leavePublicSpectator(id);
  return new NextResponse(null, { status: 204 });
}
