import { NextResponse } from "next/server";

import { getPrivateLobby } from "@/lib/services/multiplayerService";

interface LobbyRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: LobbyRouteContext) {
  const { id } = await params;
  const lobby = await getPrivateLobby(id);
  if (!lobby) return NextResponse.json({ error: "Room not found." }, { status: 404 });
  return NextResponse.json(lobby, { headers: { "Cache-Control": "no-store" } });
}
