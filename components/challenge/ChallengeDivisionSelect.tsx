"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Division } from "@/types/question";

export default function ChallengeDivisionSelect({ division }: { division: Division }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <div className="mb-6 flex flex-wrap items-center gap-3">
    <label htmlFor="challenge-division" className="font-semibold">Division</label>
    <select id="challenge-division" value={division} disabled={pending}
      onChange={event => { const value = event.target.value; startTransition(() => router.replace(`/challenge?division=${value}`, { scroll: false })); }}
      className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 focus:outline-blue-600">
      <option>Mu</option><option>Alpha</option><option>Theta</option>
    </select>
    {pending ? <span role="status" className="text-sm text-slate-500">Loading question…</span> : null}
    <p className="w-full text-sm text-slate-600">One correct answer in any division earns today’s streak. Extra questions are optional.</p>
  </div>;
}
