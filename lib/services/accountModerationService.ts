import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasAdminAccess } from "@/lib/auth/roles";
import { accountRestriction } from "@/lib/auth/accountAccess";
import type { ModerationAuditEntry, ModerationState } from "@/lib/auth/moderation";

export async function moderationActor() {
  const client = await createClient(AbortSignal.timeout(8000), { allowRestricted: true });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || accountRestriction(user)) return null;
  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profileError || !profile || !hasAdminAccess(profile.role)) return null;
  return { user, role: profile.role as "admin" | "owner", admin, client };
}

export async function moderationDetails(targetId: string) {
  const actor = await moderationActor();
  if (!actor) throw new Error("Administrator access required.");
  const [state, audit] = await Promise.all([
    actor.admin.from("account_moderation").select("version,suspended,requires_name_change,previous_login_username").eq("user_id", targetId).maybeSingle(),
    actor.admin.from("account_moderation_audit").select("request_id,actor_id,action,reason,created_at").eq("target_id", targetId).order("created_at", { ascending: false }).limit(20),
  ]);
  if (state.error || audit.error) return null; // Fail closed while migration is not installed.
  return {
    actorId: actor.user.id, actorRole: actor.role,
    googleOnly: actor.user.app_metadata.password_login_enabled === false,
    state: (state.data ?? { version: 0, suspended: false, requires_name_change: false, previous_login_username: null }) as ModerationState,
    audit: (audit.data ?? []) as ModerationAuditEntry[],
  };
}
