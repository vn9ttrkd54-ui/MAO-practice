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
      className={`rounded-xl border p-5 ${
        muted
          ? "bg-white/70"
          : "bg-white shadow-sm"
      }`}
    >
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
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