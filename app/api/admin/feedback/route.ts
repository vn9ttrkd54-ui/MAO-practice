import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string }>();
  return profile?.role === "admin" ? user : null;
}

export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const body = (await request.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: "Feedback ID is required." }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("feedback_requests").update({
    status: "resolved",
    resolved_at: new Date().toISOString(),
    resolved_by: user.id,
  }).eq("id", body.id).eq("status", "open");

  if (error) return NextResponse.json({ error: "Unable to resolve this request." }, { status: 500 });
  return NextResponse.json({ success: true });
}
