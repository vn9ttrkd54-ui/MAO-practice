"use client";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Division } from "@/types/question";
import styles from "./challenge.module.css";

export default function ChallengeDivisionSelect({ division }: { division: Division }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <div className={styles.divisionControl}>
    <div className={styles.divisionToolbar}>
      <div className={styles.divisions} role="group" aria-label="Division">
        {(["Mu", "Alpha", "Theta"] as const).map(value => <button key={value} type="button" aria-pressed={division === value} disabled={pending}
          onClick={() => startTransition(() => router.replace(`/challenge?division=${value}`, { scroll: false }))}>{value.toUpperCase()}</button>)}
      </div>
      <Link href="/challenge/submit" className={styles.submitQuestion}>
        <FilePlus2 size={15} aria-hidden="true" />Submit Question
      </Link>
    </div>
    {pending ? <span role="status" className="text-sm text-slate-500">Loading question…</span> : null}
    <p className={styles.rule}>One correct answer in any division earns today’s streak. Extra questions are optional.</p>
  </div>;
}
