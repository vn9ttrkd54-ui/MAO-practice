import styles from "./dashboard.module.css";

interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  muted?: boolean;
}

export default function StatCard({
  label,
  value,
  detail,
  muted = false,
}: StatCardProps) {
  return (
    <div
      className={`${styles.stat} rounded-xl border p-5 text-gray-950 ${
        muted
          ? "bg-white/70"
          : "bg-white shadow-sm"
      }`}
    >
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-950">
        {value}
      </p>

      {detail ? (
        <p className="mt-2 text-sm text-gray-500">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
