import { Brain } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";

interface TrainerSectionProps {
  level: {
    level: number;
    progress: number;
  };

  trainer: {
    sessionsCompleted: number;
    questionsAnswered: number;
    accuracy: number;
  };
}

export default function TrainerSection({
  level,
  trainer,
}: TrainerSectionProps) {
  return (
    <section className="mt-12">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
          <Brain size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Trainer
          </h2>

          <p className="mt-1 text-gray-600">
            Practice continuously, improve accuracy,
            and increase your level.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current Level"
          value={`Level ${level.level}`}
          detail={`${level.progress} / 30 progress`}
        />

        <StatCard
          label="Sessions Completed"
          value={trainer.sessionsCompleted}
        />

        <StatCard
          label="Questions Answered"
          value={trainer.questionsAnswered}
        />

        <StatCard
          label="Overall Accuracy"
          value={`${trainer.accuracy}%`}
        />
      </div>
    </section>
  );
}
