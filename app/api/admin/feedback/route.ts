import { NextResponse } from "next/server";

import { hasAdminAccess } from "@/lib/auth/roles";
import { isTrustedMutationRequest, readJsonBody, RequestBodyError } from "@/lib/security/request";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string }>();
  return hasAdminAccess(profile?.role) ? user : null;
}

export async function PATCH(request: Request) {
  if (!isTrustedMutationRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  let body: { id?: unknown };
  try {
    body = await readJsonBody<typeof body>(request, 2_048);
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status });
  }
  if (typeof body.id !== "string" || !UUID_PATTERN.test(body.id)) {
    return NextResponse.json({ error: "A valid feedback ID is required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("feedback_requests").update({
    status: "resolved",
    resolved_at: new Date().toISOString(),
    resolved_by: user.id,
  }).eq("id", body.id).eq("status", "open");

  if (error) return NextResponse.json({ error: "Unable to resolve this request." }, { status: 500 });
  return NextResponse.json({ success: true });
}
