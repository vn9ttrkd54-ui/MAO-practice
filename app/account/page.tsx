import { redirect } from "next/navigation";

import AccountSettings from "@/components/account/AccountSettings";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single<{ username: string }>();
  if (!profile) redirect("/dashboard");

  const usesInternalEmail = user.email?.endsWith("@users.mao-practice.local") ?? true;

  return (
    <AccountSettings
      initialUsername={profile.username}
      initialEmail={usesInternalEmail ? "" : (user.email ?? "")}
      emailVerified={!usesInternalEmail && Boolean(user.email_confirmed_at)}
    />
  );
}
