import { NextResponse } from "next/server";

import { leavePublicSpectator, spectatePublicMatch } from "@/lib/services/multiplayerService";

interface SpectateRouteContext { params: Promise<{ id: string }>; }

export async function GET(_request: Request, { params }: SpectateRouteContext) {
  try {
    const { id } = await params;
    return NextResponse.json(await spectatePublicMatch(id), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to spectate." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: SpectateRouteContext) {
  const { id } = await params;
  await leavePublicSpectator(id);
  return new NextResponse(null, { status: 204 });
}
