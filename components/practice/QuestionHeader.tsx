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
    <div className="mb-8">

      <Link
        href={backHref}
        className="
          inline-flex
          items-center
          gap-2
          text-blue-600
          hover:text-blue-800
          hover:underline
          mb-6
        "
      >
        ← Question Bank
      </Link>

      <h1 className="text-3xl font-bold mb-4">
        Question {questionNumber}
      </h1>

      <div className="flex flex-wrap gap-3">

        <span className="border rounded-full px-3 py-1">
          {division}
        </span>

        <span className="border rounded-full px-3 py-1">
          {topic}
        </span>

        <span className="border rounded-full px-3 py-1">
          {difficulty}
        </span>

        <span className="border rounded-full px-3 py-1">
          {status}
        </span>

      </div>

    </div>
  );
}
