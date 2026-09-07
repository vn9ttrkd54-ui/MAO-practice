import { MessageSquarePlus } from "lucide-react";
import styles from "@/components/settings/settings.module.css";
import Link from "next/link";
import { redirect } from "next/navigation";

import FeedbackForm from "@/components/feedback/FeedbackForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewSuggestionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className={`${styles.page} mx-auto max-w-3xl px-6 py-10 sm:px-8`}>
      <Link href="/dashboard" className="text-sm font-semibold text-blue-600">← Dashboard</Link>
      <section className={`${styles.hero} mt-5 rounded-3xl border bg-white p-6 shadow-sm sm:p-8`}>
        <div className={styles.icon}><MessageSquarePlus size={25} aria-hidden="true" /></div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Site feedback</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Make a suggestion</h1>
        <p className="mt-3 text-slate-600">Tell us about an account issue, feature idea, confusing experience, or anything else that could improve Mathematics Daily.</p>
        <div className={`${styles.divider} mt-8`}><FeedbackForm kind="general_suggestion" /></div>
      </section>
    </main>
  );
}
