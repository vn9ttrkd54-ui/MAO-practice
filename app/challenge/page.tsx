import styles from "@/components/challenge/challenge.module.css";
import { CalendarClock } from "lucide-react";
import ChallengeDivisionSelect from "@/components/challenge/ChallengeDivisionSelect";
import ChallengeAutoSchedule from "@/components/challenge/ChallengeAutoSchedule";
import QuestionImage from "@/components/questions/QuestionImage";
import QuestionSourceCredit from "@/components/questions/QuestionSourceCredit";
import ChallengeAnswerForm from "@/components/challenge/ChallengeAnswerForm";
import ChallengeLeaderboard from "@/components/challenge/ChallengeLeaderboard";
import ChallengePersonalStats from "@/components/challenge/ChallengePersonalStats";
import MathText from "@/components/math/MathText";
import { getChallengeOverview } from "@/lib/challenge";
import type { ChallengeSubmissionResult } from "@/types/challenge";

export const dynamic = "force-dynamic";

function formatChallengeDate(date: string): string {
  // The key is already a New York date, so no further zone conversion is needed.
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function ChallengePage({ searchParams }: { searchParams: Promise<{ division?: string }> }) {
  const params = await searchParams;
  const division = params.division === "Alpha" || params.division === "Theta" ? params.division : "Mu";
  const {
    dailyChallenge,
    attempt: existingAttempt,
    leaderboard,
    statistics,
    userLeaderboardEntry: userPosition,
  } = await getChallengeOverview(division);

  const initialResult: ChallengeSubmissionResult | null =
    dailyChallenge && existingAttempt
      ? {
          challengeDate: existingAttempt.challengeDate,
          questionId: existingAttempt.questionId,
          selectedAnswer: existingAttempt.selectedAnswer,
          correct: existingAttempt.correct,
          correctAnswer: dailyChallenge.question.answer,
          solution: dailyChallenge.question.solution,
          saved: true,
        }
      : null;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>
            Daily competition
          </p>
          <h1 className={styles.title}>
            Daily Challenge
          </h1>
          </div>
          <p className={styles.date}>
            <time dateTime={dailyChallenge?.date ?? statistics.asOfDate}>
              {formatChallengeDate(dailyChallenge?.date ?? statistics.asOfDate)}
            </time>
            <span className={styles.dateTimeZone}>New York time</span>
          </p>
        </header>

        <ChallengePersonalStats statistics={statistics} position={userPosition} />
        <div className={styles.layout}>
          <section className={`${styles.panel} ${styles.questionPanel}`}>
            <ChallengeDivisionSelect division={division} />
            {!dailyChallenge ? (
              <div className={styles.empty}>
                <CalendarClock size={32} aria-hidden="true" />
                <p className={styles.eyebrow}>
                  Daily Challenge
                </p>
                <ChallengeAutoSchedule key={division} division={division} />
              </div>
            ) : (
              <>
                <div className={styles.questionMeta}>
                  <p className={styles.eyebrow}>
                    Today&apos;s Challenge
                  </p>
                  <span>
                    {dailyChallenge.question.division}
                  </span>
                  <span>
                    {dailyChallenge.question.topic}
                  </span>
                  <span
                    aria-label={`Difficulty ${dailyChallenge.question.difficulty} out of 5`}
                    className={styles.difficulty}
                  >
                    {"★".repeat(dailyChallenge.question.difficulty)}
                    {"☆".repeat(5 - dailyChallenge.question.difficulty)}
                  </span>
                </div>

                <div className={styles.problem}>
                  <h2 className="sr-only">Question</h2>
                  <QuestionSourceCredit source={dailyChallenge.question.source} />
                  <div>
                    <MathText>{dailyChallenge.question.question}</MathText>
                  </div>
                  <QuestionImage illustration={dailyChallenge.question.illustration} />
                </div>

                <ChallengeAnswerForm
                  key={`${dailyChallenge.date}-${dailyChallenge.questionId}`}
                  challengeDate={dailyChallenge.date}
                  questionId={dailyChallenge.questionId}
                  choices={dailyChallenge.question.choices}
                  initialResult={initialResult}
                />
              </>
            )}
          </section>

          <aside className={styles.sidebar}>
            <ChallengeLeaderboard entries={leaderboard} />
          </aside>
        </div>
      </div>

    </main>
  );
}
