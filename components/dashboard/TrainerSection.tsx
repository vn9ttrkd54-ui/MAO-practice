import {
  BarChart3,
  Brain,
  Clock3,
  Gauge,
  Medal,
  Target,
} from "lucide-react";

interface TrainerSectionProps {
  level: {
    level: number;
    progress: number;
  };

  trainer: {
    sessionsCompleted: number;
    questionsAnswered: number;
    accuracy: number;
    averageQuestionsPerSession: number;
    averageSessionDurationSeconds: number;
    bestSessionAccuracy: number;
    bestSessionCorrect: number;
  };
}

function formatDuration(totalSeconds: number) {
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return seconds > 0
    ? `${minutes}m ${seconds}s`
    : `${minutes}m`;
}

export default function TrainerSection({
  level,
  trainer,
}: TrainerSectionProps) {
  const metrics = [
    {
      label: "Current Level",
      value: `Level ${level.level}`,
      detail: `${level.progress} / 30 progress`,
      icon: Brain,
      iconClasses: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Lifetime Accuracy",
      value: `${trainer.accuracy}%`,
      detail: `${trainer.questionsAnswered} total answers`,
      icon: Target,
      iconClasses: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Sessions Completed",
      value: trainer.sessionsCompleted,
      detail:
        trainer.sessionsCompleted === 1
          ? "1 saved session"
          : `${trainer.sessionsCompleted} saved sessions`,
      icon: BarChart3,
      iconClasses: "bg-sky-50 text-sky-700",
    },
    {
      label: "Questions per Session",
      value: trainer.averageQuestionsPerSession,
      detail: "Lifetime average",
      icon: Gauge,
      iconClasses: "bg-violet-50 text-violet-700",
    },
    {
      label: "Average Session Length",
      value: formatDuration(
        trainer.averageSessionDurationSeconds
      ),
      detail: "From start to finish",
      icon: Clock3,
      iconClasses: "bg-amber-50 text-amber-700",
    },
    {
      label: "Best Session",
      value: `${trainer.bestSessionAccuracy}%`,
      detail:
        trainer.sessionsCompleted > 0
          ? `${trainer.bestSessionCorrect} correct answers`
          : "Complete a session to begin",
      icon: Medal,
      iconClasses: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <section className="mt-12">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
          <Brain size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Trainer Analytics
          </h2>

          <p className="mt-1 text-gray-600">
            Review your lifetime Trainer performance and
            session habits.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                    {metric.value}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-3 ${metric.iconClasses}`}
                >
                  <Icon size={21} aria-hidden="true" />
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                {metric.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
