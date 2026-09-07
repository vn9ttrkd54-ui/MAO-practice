import styles from "./dashboard.module.css";
import Link from "next/link";
import { Lightbulb, Settings, ShieldCheck } from "lucide-react";

export default function DashboardQuickActions({ isAdmin }: { isAdmin: boolean }) {
  return (
    <section
      className={`${styles.quickActions} mx-auto mt-5 grid w-full gap-4 sm:grid-cols-2 ${
        isAdmin ? "max-w-6xl lg:grid-cols-3" : "max-w-4xl"
      }`}
    >
      <Link href="/suggestions/new" className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-700"><Lightbulb size={21} /></span>
        <span><span className="block font-bold">Make a suggestion</span><span className="mt-0.5 block text-sm text-slate-500">Share an idea or report a site issue</span></span>
      </Link>

      <Link href="/account" className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><Settings size={21} /></span>
        <span><span className="block font-bold">Account settings</span><span className="mt-0.5 block text-sm text-slate-500">Username, password, or account deletion</span></span>
      </Link>

      {isAdmin ? (
        <Link href="/admin/feedback" className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-white"><ShieldCheck size={21} /></span>
          <span><span className="block font-bold">Admin feedback</span><span className="mt-0.5 block text-sm text-slate-500">Review and resolve open requests</span></span>
        </Link>
      ) : null}
    </section>
  );
}
