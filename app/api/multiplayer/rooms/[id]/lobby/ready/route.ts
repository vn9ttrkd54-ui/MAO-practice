import { NextResponse } from "next/server";

import { updateMultiplayerLobbyReady } from "@/lib/services/multiplayerService";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { observeApi } from "@/lib/serverPerformance";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validUuid = (value: unknown): value is string => typeof value === "string" && uuid.test(value);
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

// Deliberately separate from /ready, which acknowledges a loaded game question.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return observeApi("multiplayer.lobby.ready", async measure => {
    if (!isTrustedMutationRequest(request)) return json({ error: "Invalid request origin." }, 403);
    try {
      const { id } = await params;
      const { ready, settingsVersion, connectionId, playerId } = await readJsonBody<Record<string, unknown>>(request, 1024);
      if (!validUuid(id) || !validUuid(connectionId) || !validUuid(playerId) || typeof ready !== "boolean" ||
        typeof settingsVersion !== "number" || !Number.isSafeInteger(settingsVersion) || settingsVersion < 0) {
        return json({ error: "Invalid Ready request." }, 400);
      }
      return json(await measure("service", () => updateMultiplayerLobbyReady(id, ready, settingsVersion, connectionId, playerId)));
    } catch (error) {
      return error instanceof RequestBodyError ? json({ error: error.message }, error.status)
        : json({ error: "Unable to confirm Ready. Please retry." }, 503);
    }
  });
}
