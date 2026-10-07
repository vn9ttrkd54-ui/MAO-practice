import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { accountRestriction } from "@/lib/auth/accountAccess";
import RequiredNameChangeForm from "@/components/auth/RequiredNameChangeForm";
import LogoutButton from "@/components/auth/LogoutButton";
import GoogleSetupForm from "@/components/auth/GoogleSetupForm";

export const dynamic = "force-dynamic";
export default async function ResolveAccountPage() {
  const client = await createClient(undefined, { allowRestricted: true });
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const restriction = accountRestriction(user);
  if (!restriction) redirect("/dashboard");
  return <main className="min-h-screen bg-blue-50 px-5 py-12 text-slate-900"><section className="mx-auto max-w-xl rounded-2xl border border-blue-200 bg-white p-8 shadow-sm">
    <h1 className="text-3xl font-bold">{restriction === "suspended" ? "Account suspended" : "Choose a new username"}</h1>
    {restriction === "suspended" ? <p className="mt-4">Your account has been suspended by a moderator. Your saved progress is preserved. <a className="text-blue-700 underline" href="/contact">Contact us</a> if you believe this was a mistake.</p>
      : <><p className="mt-4">A moderator has asked you to change your username. Other players now see a neutral name. Choose a new name before continuing.</p><p className="mt-3 text-slate-600">Your account, password, progress, and scores stay the same. Until you finish, your previous username still works for signing in.</p>{user.app_metadata.needs_username === true ? <GoogleSetupForm /> : <RequiredNameChangeForm />}</>}
    <div className="mt-8"><LogoutButton /></div>
  </section></main>;
}
