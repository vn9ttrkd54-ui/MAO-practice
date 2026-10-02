import { readDashboardSnapshot } from "@/lib/dashboardServer";
import { withRequestTimeout } from "@/lib/requestTimeout";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  const owner = new URL(request.url).searchParams.get("owner");
  if (!owner || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(owner)) {
    return Response.json({ error: "Invalid dashboard request." }, { status: 400, headers });
  }
  try {
    return await withRequestTimeout(async (signal) => {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      signal.throwIfAborted();
      if (error || !user) return Response.json({ error: "Sign in to view your dashboard." }, { status: 401, headers });
      if (user.id !== owner) return Response.json({ error: "Your account changed. Reload the dashboard." }, { status: 409, headers });
      const data = await readDashboardSnapshot(supabase, user.id, signal);
      return Response.json(data, { headers });
    }, { signal: request.signal });
  } catch {
    return Response.json({ error: "Unable to load your dashboard right now. Please try again." }, { status: 503, headers });
  }
}
