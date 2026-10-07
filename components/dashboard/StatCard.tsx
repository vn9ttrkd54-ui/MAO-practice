import styles from "./dashboard.module.css";

interface StatCardProps { label: string; value: string | number; detail?: string; }

export default function StatCard({ label, value, detail }: StatCardProps) {
  return <div className={styles.stat}>
    <p className={styles.statLabel}>{label}</p>
    <p className={styles.statValue}>{value}</p>
    {detail ? <p className={styles.statDetail}>{detail}</p> : null}
  </div>;
}
