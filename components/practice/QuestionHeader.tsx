import Link from "next/link";

type QuestionHeaderProps = {
  questionNumber: number;
  division: string;
  topic: string;
  difficulty: string;
  status: string;
  backHref: string;
};

export default function QuestionHeader({
  questionNumber,
  division,
  topic,
  difficulty,
  status,
  backHref,
}: QuestionHeaderProps) {
  const divisionTheme = {
    Mu: {
      background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 52%, #4338ca 100%)",
      borderColor: "#3b82f6",
      linkClass: "text-blue-100",
    },
    Alpha: {
      background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 52%, #9333ea 100%)",
      borderColor: "#8b5cf6",
      linkClass: "text-purple-100",
    },
    Theta: {
      background: "linear-gradient(135deg, #047857 0%, #059669 52%, #0f766e 100%)",
      borderColor: "#10b981",
      linkClass: "text-emerald-100",
    },
  }[division] ?? {
    background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 52%, #4338ca 100%)",
    borderColor: "#3b82f6",
    linkClass: "text-blue-100",
  };

  return (
    <div
      className="mb-8 overflow-hidden rounded-2xl border-2 p-6 text-white shadow-[0_12px_30px_rgba(17,24,39,0.18)] sm:p-7"
      style={{ background: divisionTheme.background, borderColor: divisionTheme.borderColor }}
    >

      <Link
        href={backHref}
        className={`
          mb-6
          inline-flex
          items-center
          gap-2
          ${divisionTheme.linkClass}
          transition
          hover:text-white
          hover:underline
        `}
      >
        ← Question Bank
      </Link>

      <h1 className="text-3xl font-bold mb-4">
        Question {questionNumber}
      </h1>

      <div className="flex flex-wrap gap-3">

        <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1">
          {division}
        </span>

        <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1">
          {topic}
        </span>

        <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1">
          {difficulty}
        </span>

        <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1">
          {status}
        </span>

      </div>

    </div>
  );
}
