import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import styles from "@/components/auth/auth.module.css";

import LoginForm from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ google?: string }> }) {
  const { google } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(user.app_metadata.needs_username === true ? "/auth/setup" : "/dashboard");
  }

  return (
    <main className={`${styles.page} px-6 py-12 sm:px-8 sm:py-16`}>
      <section className={`${styles.card} mx-auto max-w-lg rounded-3xl border p-6 sm:p-8`}>
        <div className={styles.icon}><LogIn size={25} aria-hidden="true" /></div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Log in to Mathematics Daily
        </h1>

        <p className="mt-3 text-gray-600">
          Continue with Google or your username and password.
        </p>

        {google === "error" && <p role="alert" className="mt-4 text-sm text-red-700">Google sign-in could not finish. Please try again.</p>}
        {google === "wrong-account" && <p role="alert" className="mt-4 text-sm text-red-700">Choose the Google account connected to your Mathematics Daily account.</p>}
        <LoginForm />
      </section>
    </main>
  );
}
