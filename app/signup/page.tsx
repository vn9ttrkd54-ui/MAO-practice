import { UserPlus } from "lucide-react";
import styles from "@/components/auth/auth.module.css";
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
    <main className={`${styles.page} px-6 py-12 sm:px-8 sm:py-16`}>
      <div className={`${styles.card} mx-auto max-w-lg rounded-3xl border p-6 sm:p-8`}>
        <div className={styles.icon}>
          <UserPlus size={25} aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Start your journey</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
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
