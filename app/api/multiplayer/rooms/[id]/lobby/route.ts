import { NextResponse } from "next/server";

import { beginPublicRoomIfReady, getPrivateLobby, updatePrivateRoomPresence } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest } from "@/lib/security/request";

interface LobbyRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: LobbyRouteContext) {
  const { id } = await params;
  let lobby = await getPrivateLobby(id);
  if (!lobby) return NextResponse.json({ error: "Room not found." }, { status: 404 });
  if (lobby.room.visibility === "public") {
    await beginPublicRoomIfReady(id);
    lobby = await getPrivateLobby(id);
    if (!lobby) return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
  return NextResponse.json(lobby, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request, { params }: LobbyRouteContext) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  const updated = await updatePrivateRoomPresence(id, false);
  return new NextResponse(null, { status: updated ? 204 : 404 });
}
