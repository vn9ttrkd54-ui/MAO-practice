import { ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import styles from "@/components/settings/settings.module.css";
import Link from "next/link";
import { redirect } from "next/navigation";

import AdminFeedbackList from "@/components/admin/AdminFeedbackList";
import AdminAccountRecovery from "@/components/admin/AdminAccountRecovery";
import { questions } from "@/data/questions";
import { hasAdminAccess, hasOwnerAccess } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Division } from "@/types/question";

type FeedbackRow = {
  id: string;
  user_id: string;
  kind: "question_report" | "general_suggestion";
  question_id: number | null;
  division: Division | null;
  message: string;
  created_at: string;
};

export default async function AdminFeedbackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: ownProfile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string }>();
  if (!hasAdminAccess(ownProfile?.role)) redirect("/dashboard");

  const { data } = await admin.from("feedback_requests").select("id, user_id, kind, question_id, division, message, created_at").eq("status", "open").order("created_at", { ascending: false });
  const rows = (data ?? []) as FeedbackRow[];
  const userIds = [...new Set(rows.map((row) => row.user_id))];
  const { data: profiles } = userIds.length
    ? await admin.from("profiles").select("id, username").in("id", userIds)
    : { data: [] as { id: string; username: string }[] };
  const usernames = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));

  const requests = rows.map((row) => {
    const question = row.question_id ? questions.find((item) => item.id === row.question_id) : null;
    return {
      id: row.id,
      kind: row.kind,
      username: usernames.get(row.user_id) ?? "Deleted user",
      questionId: row.question_id,
      division: row.division,
      questionLabel: question ? `${question.division} #${question.number} · ${question.topic}` : null,
      message: row.message,
      createdAt: row.created_at,
    };
  });

  return (
    <main className={`${styles.page} mx-auto max-w-5xl px-6 py-10 sm:px-8`}>
      <Link href="/dashboard" className="text-sm font-semibold text-blue-600">← Dashboard</Link>
      <div className={`${styles.hero} mt-5`}><div className={styles.icon}><ShieldCheck size={25} aria-hidden="true" /></div><p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">Admin</p><h1 className="mt-2 text-4xl font-bold">Admin tools</h1><p className="mt-3 text-sm text-slate-500">Review feedback and explore your community’s activity.</p></div>
      <Link href="/admin/users" className={`${styles.toolLink} mt-6`}><span className="flex items-center gap-4"><Users size={26} aria-hidden="true" /><span><span className="block font-bold">Users & statistics</span><span className="mt-1 block text-sm text-blue-100">Browse accounts, ranks, and activity</span></span></span><ArrowUpRight size={22} aria-hidden="true" /></Link>
      {hasOwnerAccess(ownProfile.role) ? <AdminAccountRecovery /> : null}
      <div className="mt-9 flex flex-wrap items-end justify-between gap-4"><h2 className="text-3xl font-bold">Feedback inbox</h2><p className="rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-800">{requests.length} open</p></div>
      <AdminFeedbackList initialRequests={requests} />
    </main>
  );
}
