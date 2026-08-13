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
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border-2 border-[#111827] bg-gradient-to-r from-[#2563eb] to-[#111827] p-6 text-white shadow-[0_12px_30px_rgba(17,24,39,0.18)] sm:p-7">

      <Link
        href={backHref}
        className="
          mb-6
          inline-flex
          items-center
          gap-2
          text-blue-100
          transition
          hover:text-white
          hover:underline
        "
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
