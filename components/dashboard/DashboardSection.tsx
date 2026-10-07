import type { ReactNode } from "react";
import styles from "./dashboard.module.css";

interface DashboardSectionProps {
  title: string;
  label: string;
  theme: "training" | "trends" | "challenge" | "multiplayer" | "bank";
  action?: ReactNode;
  children: ReactNode;
}

export default function DashboardSection({ title, label, theme, action, children }: DashboardSectionProps) {
  return <section aria-label={title} className={`${styles.chapter} ${styles[theme]}`}>
    <header className={styles.chapterHeader}>
      <div><p className={styles.eyebrow}>{label}</p><h2>{title}</h2></div>
      {action}
    </header>
    <div className={styles.chapterBody}>{children}</div>
  </section>;
}
