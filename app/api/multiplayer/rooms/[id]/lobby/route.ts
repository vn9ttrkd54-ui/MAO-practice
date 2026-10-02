import { NextResponse } from "next/server";

import { changeMultiplayerLobbyPresence, confirmMultiplayerLeave, getPrivateLobby } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { observeApi } from "@/lib/serverPerformance";

interface LobbyRouteContext {
  params: Promise<{ id: string }>;
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validUuid = (value: unknown): value is string => typeof value === "string" && uuid.test(value);
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
function failure(error: unknown) {
  return error instanceof RequestBodyError ? json({ error: error.message }, error.status)
    : json({ error: "Unable to update the room. Please retry." }, 503);
}

export async function GET(_request: Request, { params }: LobbyRouteContext) {
  return observeApi("multiplayer.lobby.read", async measure => {
    try {
      const { id } = await params;
      if (!validUuid(id)) return json({ error: "Invalid room." }, 400);
      const lobby = await measure("service", () => getPrivateLobby(id));
      return lobby ? json(lobby) : json({ error: "Room not found." }, 404);
    } catch (error) { return failure(error); }
  });
}

export async function POST(request: Request, { params }: LobbyRouteContext) {
  return observeApi("multiplayer.lobby.presence", async measure => {
    if (!isTrustedMutationRequest(request)) return json({ error: "Invalid request origin." }, 403);
    try {
      const { id } = await params;
      const { action, tabId, connectionId, generation, playerId } = await readJsonBody<Record<string, unknown>>(request, 1024);
      if (!validUuid(id) || !validUuid(tabId) || !validUuid(connectionId) || !validUuid(playerId) ||
        typeof generation !== "number" || !Number.isSafeInteger(generation) || generation < 1 ||
        (action !== "connect" && action !== "heartbeat" && action !== "disconnect")) return json({ error: "Invalid presence request." }, 400);
      return json(await measure("service", () => changeMultiplayerLobbyPresence(id, action, tabId, connectionId, generation, playerId)));
    } catch (error) { return failure(error); }
  });
}

export async function DELETE(request: Request, { params }: LobbyRouteContext) {
  return observeApi("multiplayer.lobby.leave", async measure => {
    if (!isTrustedMutationRequest(request)) return json({ error: "Invalid request origin." }, 403);
    try {
      const { id } = await params;
      const { connectionId } = await readJsonBody<Record<string, unknown>>(request, 1024);
      if (!validUuid(id) || !validUuid(connectionId)) return json({ error: "Invalid leave request." }, 400);
      return json({ status: await measure("service", () => confirmMultiplayerLeave(id, connectionId)) });
    } catch (error) { return failure(error); }
  });
}
