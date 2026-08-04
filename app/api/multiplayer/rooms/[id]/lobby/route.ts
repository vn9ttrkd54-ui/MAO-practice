import { NextResponse } from "next/server";

import { getPrivateLobby, updatePrivateRoomPresence } from "@/lib/services/multiplayerService";

interface LobbyRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: LobbyRouteContext) {
  const { id } = await params;
  const lobby = await getPrivateLobby(id);
  if (!lobby) return NextResponse.json({ error: "Room not found." }, { status: 404 });
  return NextResponse.json(lobby, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(_request: Request, { params }: LobbyRouteContext) {
  const { id } = await params;
  const updated = await updatePrivateRoomPresence(id, false);
  return new NextResponse(null, { status: updated ? 204 : 404 });
}
