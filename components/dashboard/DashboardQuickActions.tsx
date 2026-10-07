import Link from "next/link";
import { Lightbulb, Settings, ShieldCheck } from "lucide-react";
import styles from "./dashboard.module.css";

export default function DashboardQuickActions({ isAdmin }: { isAdmin: boolean }) {
  return <nav className={styles.quickActions} aria-label="Dashboard shortcuts">
    <Link href="/suggestions/new"><Lightbulb size={16} aria-hidden="true" />Make a suggestion</Link>
    <Link href="/account"><Settings size={16} aria-hidden="true" />Account settings</Link>
    {isAdmin ? <Link href="/admin/feedback"><ShieldCheck size={16} aria-hidden="true" />Admin feedback</Link> : null}
  </nav>;
}
