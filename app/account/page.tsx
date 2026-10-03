import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

import AccountSettings from "@/components/account/AccountSettings";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GOOGLE_DELETE_COOKIE } from "@/lib/auth/googleFlow";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ google?: string }> }) {
  const { google } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.app_metadata.needs_username === true) redirect("/auth/setup");

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single<{ username: string }>();
  if (!profile) redirect("/dashboard");

  const usesInternalEmail = user.email?.endsWith("@users.mao-practice.local") ?? true;
  const passwordEnabled = user.app_metadata.password_login_enabled !== false;
  let googleDeleteVerified = false;
  const token = (await cookies()).get(GOOGLE_DELETE_COOKIE)?.value;
  if (!passwordEnabled && token && /^[0-9a-f]{64}$/.test(token)) {
    const { data: claims } = await supabase.auth.getClaims();
    const sessionId = claims?.claims.session_id;
    if (typeof sessionId === "string") {
      const { data: proof } = await createAdminClient().from("google_delete_verifications").select("user_id")
        .eq("user_id",user.id).eq("session_id",sessionId).eq("token_hash",createHash("sha256").update(token).digest("hex"))
        .gt("expires_at",new Date().toISOString()).maybeSingle();
      googleDeleteVerified = Boolean(proof);
    }
  }

  return (
    <AccountSettings
      initialUsername={profile.username}
      initialEmail={usesInternalEmail ? "" : (user.email ?? "")}
      emailVerified={!usesInternalEmail && Boolean(user.email_confirmed_at)}
      passwordEnabled={passwordEnabled}
      hasGoogle={user.identities?.some((identity) => identity.provider === "google") ?? false}
      googleDeleteVerified={googleDeleteVerified}
      googleStatus={google}
    />
  );
}
