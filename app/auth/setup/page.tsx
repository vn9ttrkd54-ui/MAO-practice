import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import GoogleSetupForm from "@/components/auth/GoogleSetupForm";
import styles from "@/components/auth/auth.module.css";

export default async function GoogleSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.app_metadata.needs_username !== true) redirect("/dashboard");
  return (
    <main className={`${styles.page} px-6 py-12 sm:px-8 sm:py-16`}>
      <section className={`${styles.card} mx-auto max-w-lg rounded-lg border p-6 sm:p-8`}>
        <div className={styles.icon}><UserRound size={25} aria-hidden="true" /></div>
        <h1 className="text-3xl font-bold">Choose your username</h1>
        <GoogleSetupForm />
      </section>
    </main>
  );
}
