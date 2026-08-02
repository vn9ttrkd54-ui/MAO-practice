import { UserPlus } from "lucide-react";
import { redirect } from "next/navigation";

import SignupForm from "@/components/auth/SignupForm";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-6 py-12 sm:px-8">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <UserPlus size={22} />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Create your account
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          Save your question progress, bookmarks, Trainer history,
          and level across sessions.
        </p>

        <SignupForm />
      </div>
    </main>
  );
}
