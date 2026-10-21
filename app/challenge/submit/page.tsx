import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, FilePlus2 } from "lucide-react";

import FeedbackForm from "@/components/feedback/FeedbackForm";
import { createClient } from "@/lib/supabase/server";
import styles from "@/components/settings/settings.module.css";

export const metadata: Metadata = { title: "Submit a Problem | Mathematics Daily" };

export default async function SubmitChallengeQuestionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className={`${styles.page} mx-auto max-w-3xl px-6 py-10 sm:px-8`}>
      <Link href="/challenge" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-600">
        <ArrowLeft size={16} aria-hidden="true" />Daily Challenge
      </Link>
      <section className={`${styles.hero} mt-5`} aria-labelledby="submission-heading">
        <div className={styles.icon}><FilePlus2 size={25} aria-hidden="true" /></div>
        <p className="text-sm font-bold uppercase text-blue-600">Daily Challenge</p>
        <h1 id="submission-heading" className="mt-2 text-3xl font-bold">Submit a problem</h1>
        <p className="mt-3 leading-7 text-slate-600">Submit a problem to be featured in the Daily Challenge. Include the full problem, answer, a detailed solution, and source or author credit.</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">Only submit problems you wrote or have permission to share. Submissions are reviewed before being featured.</p>
        <div className={`${styles.divider} mt-8`}><FeedbackForm kind="question_submission" /></div>
      </section>
    </main>
  );
}
