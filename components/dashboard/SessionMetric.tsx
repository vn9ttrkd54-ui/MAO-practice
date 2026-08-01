interface SessionMetricProps {
  label: string;
  value: number;
}

export default function SessionMetric({
  label,
  value,
}: SessionMetricProps) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}