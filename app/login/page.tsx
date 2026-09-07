import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import styles from "@/components/auth/auth.module.css";

import LoginForm from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className={`${styles.page} px-6 py-12 sm:px-8 sm:py-16`}>
      <section className={`${styles.card} mx-auto max-w-lg rounded-3xl border p-6 sm:p-8`}>
        <div className={styles.icon}><LogIn size={25} aria-hidden="true" /></div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Welcome Back
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Log in to Mathematics Daily
        </h1>

        <p className="mt-3 text-gray-600">
          Use your username and password to continue your saved progress.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
