"use client";

import { Send, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import MathText from "@/components/math/MathText";
import LlamaPet from "@/components/practice/LlamaPet";
import { createClient } from "@/lib/supabase/client";
import { tutorPetState } from "@/lib/tutorPet";
import { readTutorAllowance, sendTutorRequest, TutorRequestError, type TutorChatMessage } from "@/lib/tutorTransport";

type TutorProps = { questionId: number; revealToken: string | null };

const MAX_MESSAGE_LENGTH = 600;
const DAILY_LIMIT_MESSAGE = "Today's tutor requests are used or still processing. Check again later, or come back tomorrow.";

export default function LlamaTutor(props: TutorProps) {
  return <TutorChat key={props.questionId} {...props} />;
}

function TutorChat({ questionId, revealToken }: TutorProps) {
  const [open, setOpen] = useState(false);
  const [hop, setHop] = useState(0);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<TutorChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const [checkingAllowance, setCheckingAllowance] = useState(true);
  const [allowanceError, setAllowanceError] = useState<string | null>(null);
  const [allowanceAttempt, setAllowanceAttempt] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const allowanceAbortRef = useRef<AbortController | null>(null);
  const requestEpochRef = useRef(0);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const draftRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const tutorState = tutorPetState({ loading, remaining: messagesRemaining, errorCode, hasError: !!error, hasAnswer: messages.at(-1)?.role === "assistant" });
  const resting = tutorState === "sleeping";
  const inputDisabled = loading || resting || checkingAllowance || !!allowanceError;
  const onEscape = useEffectEvent(() => closeTutor());
  const tutorStatus = resting
    ? "Resting for now"
    : error
      ? "Needs a moment"
    : loading
      ? waiting ? "Busy — waiting to try again" : "Thinking it through"
      : messages.length > 0
        ? "Ready for your next step"
        : "Ask about this question";

  useEffect(() => {
    function clearTemporaryChat() {
      requestEpochRef.current += 1;
      abortRef.current?.abort();
      abortRef.current = null;
      allowanceAbortRef.current?.abort();
      allowanceAbortRef.current = null;
      setOpen(false);
      setMessages([]);
      setDraft("");
      setError(null);
      setErrorCode(null);
      setMessagesRemaining(null);
      setLoading(false);
      setWaiting(false);
      setCheckingAllowance(true);
      setAllowanceError(null);
    }

    window.addEventListener("pagehide", clearTemporaryChat);
    // A different account must not inherit the current chat or a pending retry.
    // Token refreshes for the same account do not interrupt the tutor.
    let owner: string | null | undefined;
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      const nextOwner = session?.user.id ?? null;
      if (owner !== undefined && nextOwner !== owner) clearTemporaryChat();
      owner = nextOwner;
    });

    return () => {
      requestEpochRef.current += 1;
      abortRef.current?.abort();
      allowanceAbortRef.current?.abort();
      subscription.unsubscribe();
      window.removeEventListener("pagehide", clearTemporaryChat);
    };
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;

    draftRef.current?.focus();
    const controller = new AbortController();
    allowanceAbortRef.current = controller;
    const requestEpoch = requestEpochRef.current;
    void readTutorAllowance(controller.signal)
      .then((remaining) => {
        if (controller.signal.aborted || requestEpoch !== requestEpochRef.current) return;
        setMessagesRemaining(remaining);
        if (remaining === 0) {
          setError(DAILY_LIMIT_MESSAGE);
          setErrorCode("daily_limit");
        } else {
          setErrorCode((current) => current === "daily_limit" ? null : current);
          setError((current) => current === DAILY_LIMIT_MESSAGE ? null : current);
        }
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted || requestEpoch !== requestEpochRef.current) return;
        setMessagesRemaining(null);
        setAllowanceError(caught instanceof Error ? caught.message : "Couldn't check your daily limit. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted && requestEpoch === requestEpochRef.current) setCheckingAllowance(false);
        if (allowanceAbortRef.current === controller) allowanceAbortRef.current = null;
      });
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onEscape();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      controller.abort();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, allowanceAttempt]);

  async function handleSend() {
    const message = draft.trim();
    if (!message || inputDisabled || abortRef.current) return;
    requestEpochRef.current += 1;

    const history = messages;
    const userMessage: TutorChatMessage = { role: "user", content: message };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError(null);
    setErrorCode(null);
    setLoading(true);
    setWaiting(false);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await sendTutorRequest({ questionId, message, history, revealToken }, {
        signal: controller.signal,
        onWaiting: (value) => {
          if (!controller.signal.aborted && abortRef.current === controller) setWaiting(value);
        },
      });
      if (controller.signal.aborted || abortRef.current !== controller) return;
      setMessages((current) => [...current, { role: "assistant", content: data.message }]);
      setMessagesRemaining(data.messagesRemaining);
    } catch (caught) {
      if (controller.signal.aborted || abortRef.current !== controller) return;
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      const requestError = caught instanceof TutorRequestError ? caught : null;
      setError(requestError?.message ?? "I couldn't connect right now. Please wait a moment and try again.");
      setErrorCode(requestError?.code ?? "unavailable");
      // Restore the unsatisfied message instead of duplicating it in history on retry.
      setMessages(history);
      setDraft(message);
      if (typeof requestError?.messagesRemaining === "number") setMessagesRemaining(requestError.messagesRemaining);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
        setWaiting(false);
      }
    }
  }

  function closeTutor() {
    requestEpochRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    allowanceAbortRef.current?.abort();
    allowanceAbortRef.current = null;
    setOpen(false);
    setMessages([]);
    setDraft("");
    if (!resting) setError(null);
    setErrorCode((current) => current === "daily_limit" || current === "pool_exhausted" ? current : null);
    setLoading(false);
    setWaiting(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  return (
    <aside className="fixed bottom-6 right-6 z-[60] hidden lg:block">
      {open ? (
        <section id="llama-tutor-panel" className="mb-3 flex h-[min(620px,calc(100vh-10rem))] w-[420px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl" aria-label="Llama Tutor">
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <LlamaPet state={tutorState} small />
              <div>
                <h2 className="font-bold">Llama Tutor</h2>
                <p className="text-xs text-slate-300">{tutorStatus}</p>
              </div>
            </div>
            <button type="button" onClick={closeTutor} className="rounded-md p-2 hover:bg-white/10" aria-label="Close tutor">
              <X size={20} />
            </button>
          </header>

          <p id="llama-tutor-notice" className="shrink-0 border-b border-slate-200 bg-white px-4 py-2 text-xs leading-5 text-slate-600">
            Mathematics Daily is for studying and practicing mathematics. Its AI tutor is designed for math learning, may make mistakes, and is not a medical, counseling, or emergency service.
          </p>

          <div ref={transcriptRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite" aria-busy={loading}>
            {messages.length === 0 ? (
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-slate-700">
                Tell me where you’re stuck. I’ll help with the next step without giving away the answer.
              </div>
            ) : null}
            {messages.map((message, index) => (
              <div key={index} className={`min-w-0 rounded-lg px-3 py-2 text-sm leading-6 ${message.role === "user" ? "ml-auto max-w-[88%] bg-slate-950 text-white" : "w-full max-w-full overflow-hidden border border-slate-200 bg-white text-slate-800 [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto"}`}>
                {message.role === "assistant" ? <MathText>{message.content}</MathText> : message.content}
              </div>
            ))}
            {loading ? (
              <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-3" aria-label={waiting ? "Waiting for tutor" : "Loading"}>
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
                <span className="ml-2 text-xs text-slate-600">{waiting ? "Busy — trying again shortly…" : "Thinking…"}</span>
              </div>
            ) : null}
            {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          </div>

          <footer className="border-t border-slate-200 bg-white p-3">
            {allowanceError ? (
              <div className="mb-2 text-sm text-red-700" role="alert">
                <p>{allowanceError}</p>
                <button type="button" onClick={() => { setCheckingAllowance(true); setAllowanceError(null); setAllowanceAttempt((value) => value + 1); }} className="mt-1 font-semibold underline">Check limit again</button>
              </div>
            ) : null}
            <div className="flex items-end gap-2">
              <textarea
                ref={draftRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                disabled={inputDisabled}
                rows={2}
                maxLength={MAX_MESSAGE_LENGTH}
                aria-label="Message Llama Tutor"
                aria-describedby="llama-tutor-notice"
                placeholder="Ask for a hint..."
                className="min-h-12 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
              <button type="button" onClick={() => void handleSend()} disabled={!draft.trim() || inputDisabled} className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
                <Send size={19} />
              </button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{draft.length}/{MAX_MESSAGE_LENGTH}</span>
              <span>{checkingAllowance ? "Checking daily limit..." : messagesRemaining === null ? "Daily limit unavailable" : `${messagesRemaining} request${messagesRemaining === 1 ? "" : "s"} left today`}</span>
            </div>
          </footer>
        </section>
      ) : null}

      <button ref={launcherRef} type="button" onClick={() => { setHop((value) => value + 1); if (!open) { setCheckingAllowance(true); setAllowanceError(null); setOpen(true); } else draftRef.current?.focus(); }} className="ml-auto block cursor-pointer rounded-lg bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600" aria-label={open ? "Focus Llama Tutor" : "Open Llama Tutor"} aria-expanded={open} aria-controls="llama-tutor-panel" title={resting ? "Llama Tutor is resting — view usage details" : "Llama Tutor"}>
        <LlamaPet state={tutorState} hop={hop} />
      </button>
    </aside>
  );
}
