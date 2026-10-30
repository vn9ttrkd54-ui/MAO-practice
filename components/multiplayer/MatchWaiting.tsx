import { Trophy, Sigma } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./matchSurface.module.css";

export default function MatchWaiting({ title = "Waiting for final results", description = "The final round is wrapping up. Results will appear here when ready.", preparing = false, children }: { title?: string; description?: string; preparing?: boolean; children?: ReactNode }) {
  return <main className={`${styles.page} px-6 py-16`}>
    <section className={`${styles.panel} ${styles.waiting} rounded-3xl border`}>
      <div className={styles.orbit} aria-hidden="true">{preparing ? <Sigma size={38} /> : <Trophy size={38} />}</div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
      {children}
    </section>
  </main>;
}
