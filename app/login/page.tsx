import { redirect } from "next/navigation";

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
    <main className="mx-auto max-w-xl px-6 py-12 sm:px-8">
      <section className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
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
