import { NextResponse } from "next/server";
import { listPublicRooms } from "@/lib/services/multiplayerService";
import { observeApi } from "@/lib/serverPerformance";

// Shared public lobby data only: no private rooms or account-specific fields.
export async function GET() {
  return observeApi("multiplayer.directory", async measure => {
    try {
      return NextResponse.json(await measure("service", () => listPublicRooms()), {
        headers: { "Cache-Control": "public, max-age=0, s-maxage=1, must-revalidate" },
      });
    } catch {
      return NextResponse.json({ error: "Unable to refresh public rooms." }, {
        status: 503, headers: { "Cache-Control": "no-store" },
      });
    }
  });
}
