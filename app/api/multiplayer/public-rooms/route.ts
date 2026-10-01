import { NextResponse } from "next/server";
import { listPublicRooms } from "@/lib/services/multiplayerService";

// Shared public lobby data only: no private rooms or account-specific fields.
export async function GET() {
  try {
    return NextResponse.json(await listPublicRooms(), {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=1, must-revalidate" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to refresh public rooms." }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
