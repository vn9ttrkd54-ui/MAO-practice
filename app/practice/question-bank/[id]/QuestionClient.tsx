"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Question } from "@/types/question";
import type { QuestionProgress } from "@/types/progress";

import {
  saveQuestionAttempt,
  saveQuestionGiveUp,
} from "@/lib/services/progressService";

import { getQuestionState, setQuestionBookmark, QuestionStateAccountError } from "@/lib/services/questionStateService";
import { createClient } from "@/lib/supabase/client";

import { questionBankHref, questionBankReturnTo, type questionBankNavigation } from "@/lib/questionBankListing";
import { createPracticeAttempt, type PracticeAttempt } from "@/lib/services/practiceAttemptService";

import QuestionHeader from "@/components/practice/QuestionDetailHeader";
import QuestionStats from "@/components/practice/QuestionStats";
import Timer from "@/components/practice/Timer";
import MultipleChoice from "@/components/practice/MultipleChoice";
import SolutionPanel from "@/components/practice/SolutionPanel";
import QuestionNavigation from "@/components/practice/QuestionNavigation";
import BookmarkButton from "@/components/practice/BookmarkButton";
import QuestionReportButton from "@/components/feedback/QuestionReportButton";
import MathText from "@/components/math/MathText";
import QuestionImage from "@/components/questions/QuestionImage";
import LlamaTutor from "@/components/practice/LlamaTutor";
import styles from "@/components/practice/question-detail.module.css";

export default function QuestionClient({
  question,
  navigation,
}: {
  question: Question;
  navigation: ReturnType<typeof questionBankNavigation>;
}) {
  return <QuestionSession key={question.id} question={question} navigation={navigation} />;
}

function QuestionSession({ question, navigation }: { question: Question; navigation: ReturnType<typeof questionBankNavigation> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = questionBankReturnTo(searchParams.get("returnTo"), question.division);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [tutorRevealToken, setTutorRevealToken] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isBookmarkSaving, setIsBookmarkSaving] =
    useState(false);

  const startTime = useRef(0);
  const attempt = useRef<PracticeAttempt | null>(null);
  const pending = useRef<{ answer: string | null; time: number } | null>(null);
  const busy = useRef(false);
  const [hasPending, setHasPending] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const owner = useRef<string | null | undefined>(undefined);
  const active = useRef(false);
  const blocked = useRef(false);
  const revision = useRef(0);
  const bookmarkRequest = useRef<AbortController | null>(null);
  const bookmarkIntent = useRef<boolean | null>(null);
  const retryState = useRef<() => void>(() => undefined);
  const [accountChanged, setAccountChanged] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [stateLoading, setStateLoading] = useState(true);
  const [stateError, setStateError] = useState<string | null>(null);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [bookmarkPending, setBookmarkPending] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  const [attemptNumber, setAttemptNumber] =
    useState(0);

  const [bookmarked, setBookmarked] =
    useState(false);

  const [progress, setProgress] =
    useState<QuestionProgress | null>(null);

  useEffect(() => {
    active.current = true;
    let disposed = false;
    let request: AbortController | null = null;
    let lastStart = -Infinity;
    startTime.current = Date.now();
    const invalidate = () => {
      blocked.current = true;
      request?.abort();
      bookmarkRequest.current?.abort();
      bookmarkRequest.current = null;
      attempt.current = null;
      setProgress(null);
      setBookmarked(false);
      setDataReady(false);
      setHasAccount(false);
      setAccountChanged(true);
    };
    async function loadQuestionState(force = false) {
      if (disposed || blocked.current || request || busy.current || bookmarkIntent.current !== null
        || document.visibilityState === "hidden" || (!force && Date.now() - lastStart < 2000)) return;
      const controller = new AbortController();
      request = controller;
      lastStart = Date.now();
      const atRevision = revision.current;
      setStateLoading(true);
      try {
        const state = await getQuestionState(question.id, controller.signal);
        if (disposed || controller.signal.aborted || blocked.current) return;
        if (owner.current !== undefined && owner.current !== state.userId) { invalidate(); return; }
        owner.current = state.userId;
        if (atRevision === revision.current) {
          setProgress(state.progress);
          setBookmarked(state.bookmarked);
        }
        setHasAccount(state.userId !== null);
        setDataReady(true);
        setStateError(null);
        if (!attempt.current) {
          attempt.current ??= createPracticeAttempt(question.id, false, state.userId);
          const fresh = attempt.current;
          void fresh.prepare().catch((error: unknown) => {
            if (!disposed && attempt.current === fresh) setSaveError(error instanceof Error ? error.message : "Unable to start this attempt.");
          });
        }
      } catch (error) {
        if (disposed || controller.signal.aborted) return;
        if (error instanceof QuestionStateAccountError) { invalidate(); return; }
        setStateError(error instanceof Error ? error.message : "Unable to load question statistics. Please retry.");
      } finally {
        if (request === controller) {
          request = null;
          if (!disposed) setStateLoading(false);
        }
      }
    }
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      const next = session?.user.id ?? null;
      if (owner.current !== undefined && owner.current !== next) invalidate();
      else owner.current = next;
    });
    const refresh = () => { void loadQuestionState(); };
    retryState.current = () => { void loadQuestionState(true); };
    void loadQuestionState(true);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      disposed = true;
      active.current = false;
      request?.abort();
      bookmarkRequest.current?.abort();
      bookmarkRequest.current = null;
      attempt.current = null;
      subscription.unsubscribe();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [question.id]);

  const goToQuestion = (destinationId: number) => router.push(questionBankHref(destinationId, returnTo, navigation.sequence));

  const handleSave = async (answer: string | null) => {
    if (submitted || busy.current || !attempt.current || !dataReady || blocked.current) return;
    const currentAttempt = attempt.current;
    busy.current = true;
    revision.current++;
    pending.current ??= { answer, time: answer === null ? 0 : Math.floor((Date.now() - startTime.current) / 1000) };
    const original = pending.current;
    setSelectedAnswer(original.answer);
    setHasPending(true);
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = original.answer === null
        ? await saveQuestionGiveUp(question.id, currentAttempt, question)
        : await saveQuestionAttempt(question.id, original.answer, original.time, currentAttempt, question);
      if (!active.current || attempt.current !== currentAttempt || blocked.current) return;
      revision.current++;
      setProgress(result.progress);
      setTutorRevealToken(result.tutorRevealToken);
      setSubmitted(true);
    } catch (error) {
      if (!active.current || attempt.current !== currentAttempt || blocked.current) return;
      setSaveError(error instanceof Error ? error.message : "Unable to save this result. Please retry.");
    } finally {
      busy.current = false;
      if (active.current && !blocked.current) setIsSaving(false);
    }
  };

  const handleReattempt = () => {
    if (busy.current || blocked.current || !dataReady) return;
    pending.current = null;
    setHasPending(false);
    setSaveError(null);
    setSubmitted(false);
    setSelectedAnswer(null);
    setTutorRevealToken(null);
    startTime.current = Date.now();
    const fresh = createPracticeAttempt(question.id, false, owner.current);
    attempt.current = fresh;
    void fresh.prepare().catch((error: unknown) => {
      if (active.current && attempt.current === fresh) setSaveError(error instanceof Error ? error.message : "Unable to start this attempt.");
    });
    setAttemptNumber((current) => current + 1);
  };

  const handleBookmarkToggle = async () => {
    if (!dataReady || bookmarkRequest.current || blocked.current || owner.current === undefined) return;
    const controller = new AbortController();
    bookmarkRequest.current = controller;
    bookmarkIntent.current ??= !bookmarked;
    const desired = bookmarkIntent.current;
    revision.current++;
    setBookmarkPending(true);
    setIsBookmarkSaving(true);
    setBookmarkError(null);
    try {
      const updated = await setQuestionBookmark(question.id, desired, owner.current, controller.signal);
      if (!active.current || controller.signal.aborted || blocked.current) return;
      revision.current++;
      setBookmarked(updated);
      bookmarkIntent.current = null;
      setBookmarkPending(false);
    } catch (error) {
      if (!active.current || controller.signal.aborted || blocked.current) return;
      if (error instanceof QuestionStateAccountError) {
        blocked.current = true;
        attempt.current = null;
        setAccountChanged(true);
      } else setBookmarkError(error instanceof Error ? error.message : "Unable to confirm your bookmark. Please retry.");
    } finally {
      if (bookmarkRequest.current === controller) {
        bookmarkRequest.current = null;
        if (active.current && !blocked.current) setIsBookmarkSaving(false);
      }
    }
  };

  if (accountChanged) return <main className="mx-auto max-w-3xl px-5 py-12 text-slate-950">
    <h1 className="text-3xl font-bold">Reload this question</h1>
    <p role="alert" className="mt-4">Your account changed or could not be confirmed. Reload before continuing; this attempt will not be saved to a different account.</p>
    <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">Reload question</button>
  </main>;

  return (
    <main className={`${styles.page} ${{ Mu: styles.mu, Alpha: styles.alpha, Theta: styles.theta }[question.division]}`}>
      <div className={styles.content}>
      <QuestionHeader
        questionNumber={question.number}
        division={question.division}
        topic={question.topic}
        difficulty={"★".repeat(
          question.difficulty
        )}
        status="Question Bank"
        backHref={returnTo}
      />

      {stateError ? <div role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <p>{stateError} {dataReady ? "Showing the last confirmed statistics and bookmark." : "Statistics and bookmark status are unavailable, not reset."}</p>
        <button type="button" disabled={stateLoading || isSaving || bookmarkPending} onClick={() => retryState.current()} className="mt-2 font-bold underline disabled:opacity-50">{stateLoading ? "Loading saved state…" : "Retry saved state"}</button>
      </div> : stateLoading && !dataReady ? <p role="status" className="mt-4 text-sm text-slate-600">Loading saved statistics and bookmark… You can read the question while this loads.</p> : null}
      {bookmarkError ? <div role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <p>{bookmarkError} Keep this page open until confirmed.</p>
        <button type="button" disabled={isBookmarkSaving} onClick={() => { void handleBookmarkToggle(); }} className="mt-2 font-bold underline disabled:opacity-50">{isBookmarkSaving ? "Saving bookmark…" : "Retry bookmark"}</button>
      </div> : null}

      <div className={styles.tools}>
        <Timer
          key={`${question.id}-${attemptNumber}`}
          running={!submitted && !hasPending}
        />

        <div className={styles.toolButtons}>
          <QuestionReportButton questionId={question.id} division={question.division} compact />
          <BookmarkButton
            compact
            bookmarked={bookmarked}
            known={dataReady}
            saving={isBookmarkSaving}
            disabled={!dataReady || isBookmarkSaving || bookmarkPending}
            onToggle={() => {
              void handleBookmarkToggle();
            }}
          />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.questionColumn}>
          <div className={styles.question}>
            <h2 className={styles.questionHeading}>
              Question
            </h2>

            <div className={styles.problem}>
              <MathText>{question.question}</MathText>
              <QuestionImage illustration={question.illustration} />
            </div>

            <MultipleChoice
              appearance="division"
              choices={question.choices}
              selectedAnswer={selectedAnswer}
              submitted={submitted || isSaving || hasPending}
              onSelect={setSelectedAnswer}
            />

            <div className={styles.actions}>
              <button
                disabled={
                  (!selectedAnswer && !hasPending) ||
                  submitted ||
                  isSaving || !dataReady
                }
                onClick={() => {
                  void handleSave(selectedAnswer);
                }}
                className={styles.submit}
              >
                {submitted ? "Saved" : isSaving ? "Saving..." : hasPending ? "Retry save" : "Submit"}
              </button>

              <button
                disabled={submitted || isSaving || hasPending || !dataReady}
                onClick={() => {
                  void handleSave(null);
                }}
                className={styles.giveUp}
              >
                Give Up
              </button>
            </div>

            {saveError ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{saveError}</p> : null}

            <SolutionPanel
              submitted={submitted}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.answer}
              solution={question.solution}
              onReattempt={handleReattempt}
            />

          </div>
          <div className={styles.navigation}>
            <QuestionNavigation
              previousDisabled={!navigation.previousId || (hasPending && !submitted)}
              nextDisabled={!navigation.nextId || (hasPending && !submitted)}
              onPrevious={() => {
                if (navigation.previousId) {
                  goToQuestion(navigation.previousId);
                }
              }}
              onNext={() => {
                if (navigation.nextId) {
                  goToQuestion(navigation.nextId);
                }
              }}
            />
          </div>
        </div>

        {progress ? <QuestionStats
          attempts={progress.attempts}
          correct={progress.correct}
          times={progress.times}
          timing={progress.timing}
        /> : <aside className={styles.stats}>
          <h2>Statistics</h2>
          <p>{stateLoading ? "Loading your saved statistics…" : "Statistics are unavailable. Retry saved state to load them."}</p>
        </aside>}
      </div>
      {hasAccount ? <LlamaTutor questionId={question.id} revealToken={tutorRevealToken} /> : null}
      </div>
    </main>
  );
}
