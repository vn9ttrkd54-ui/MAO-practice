"use client";

import { Send, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import MathText from "@/components/math/MathText";
import LlamaPet from "@/components/practice/LlamaPet";
import { tutorPetState } from "@/lib/tutorPet";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGE_LENGTH = 600;
const DAILY_LIMIT_MESSAGE = "Today's tutor requests are used or still processing. Check again later, or come back tomorrow.";

export default function LlamaTutor({
  questionId,
  revealToken,
}: {
  questionId: number;
  revealToken: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [hop, setHop] = useState(0);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestEpochRef = useRef(0);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const draftRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const tutorState = tutorPetState({ loading, remaining: messagesRemaining, errorCode, hasError: !!error, hasAnswer: messages.at(-1)?.role === "assistant" });
  const resting = tutorState === "sleeping";
  const onEscape = useEffectEvent(() => closeTutor());
  const tutorStatus = resting
    ? "Resting for now"
    : error
      ? "Needs a moment"
    : loading
      ? "Thinking it through"
      : messages.length > 0
        ? "Ready for your next step"
        : "Ask about this question";

  useEffect(() => {
    function clearTemporaryChat() {
      abortRef.current?.abort();
      abortRef.current = null;
      setOpen(false);
      setMessages([]);
      setDraft("");
      setError(null);
      setErrorCode(null);
      setMessagesRemaining(null);
      setLoading(false);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") clearTemporaryChat();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", clearTemporaryChat);

    return () => {
      abortRef.current?.abort();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    const requestEpoch = requestEpochRef.current;
    void fetch("/api/tutor", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => ({ response, data: await response.json() as { messagesRemaining?: number } }))
      .then(({ response, data }) => {
        if (controller.signal.aborted || requestEpoch !== requestEpochRef.current) return;
        if (!response.ok || typeof data.messagesRemaining !== "number") return;
        setMessagesRemaining(data.messagesRemaining);
        if (data.messagesRemaining === 0) {
          setError(DAILY_LIMIT_MESSAGE);
          setErrorCode("daily_limit");
        } else {
          setErrorCode((current) => current === "daily_limit" ? null : current);
          setError((current) => current === DAILY_LIMIT_MESSAGE ? null : current);
        }
      })
      .catch(() => undefined);
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onEscape();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      controller.abort();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function sendTutorRequest(message: string, history: ChatMessage[], signal: AbortSignal) {
    while (!signal.aborted) {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, message, history: history.slice(-6), revealToken }),
        signal,
      });
      const data = await response.json() as {
        message?: string;
        error?: string;
        code?: string;
        retryAfterMs?: number;
        messagesRemaining?: number;
      };

      if (response.status === 429 && data.code === "busy") {
        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(resolve, data.retryAfterMs ?? 1_200);
          signal.addEventListener("abort", () => {
            window.clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
          }, { once: true });
        });
        continue;
      }

      if (!response.ok || !data.message) {
        throw new TutorRequestError(
          data.error ?? "I couldn't connect right now. Please wait a moment and try again.",
          data.code ?? null,
          data.messagesRemaining,
        );
      }
      return data;
    }
    throw new DOMException("Aborted", "AbortError");
  }

  async function handleSend() {
    const message = draft.trim();
    if (!message || loading || resting) return;
    requestEpochRef.current += 1;

    const history = messages;
    const userMessage: ChatMessage = { role: "user", content: message };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError(null);
    setErrorCode(null);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await sendTutorRequest(message, history, controller.signal);
      if (controller.signal.aborted || abortRef.current !== controller) return;
      setMessages((current) => [...current, { role: "assistant", content: data.message! }]);
      if (typeof data.messagesRemaining === "number") setMessagesRemaining(data.messagesRemaining);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      const requestError = caught instanceof TutorRequestError ? caught : null;
      setError(requestError?.message ?? "I couldn't connect right now. Please wait a moment and try again.");
      setErrorCode(requestError?.code ?? "unavailable");
      if (typeof requestError?.messagesRemaining === "number") setMessagesRemaining(requestError.messagesRemaining);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  }

  function closeTutor() {
    abortRef.current?.abort();
    abortRef.current = null;
    setOpen(false);
    setMessages([]);
    setDraft("");
    if (!resting) setError(null);
    setErrorCode((current) => current === "daily_limit" || current === "pool_exhausted" ? current : null);
    setLoading(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  return (
    <aside className="fixed bottom-6 right-6 z-40 hidden lg:block">
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
              <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-3" aria-label="Loading">
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
              </div>
            ) : null}
            {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          </div>

          <footer className="border-t border-slate-200 bg-white p-3">
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
                disabled={loading || resting}
                rows={2}
                maxLength={MAX_MESSAGE_LENGTH}
                aria-label="Message Llama Tutor"
                placeholder="Ask for a hint..."
                className="min-h-12 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
              <button type="button" onClick={() => void handleSend()} disabled={!draft.trim() || loading || resting} className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
                <Send size={19} />
              </button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{draft.length}/{MAX_MESSAGE_LENGTH}</span>
              <span>{messagesRemaining === null ? "Checking daily limit..." : `${messagesRemaining} request${messagesRemaining === 1 ? "" : "s"} left today`}</span>
            </div>
          </footer>
        </section>
      ) : null}

      <button ref={launcherRef} type="button" onClick={() => { setHop((value) => value + 1); setOpen(true); if (open) draftRef.current?.focus(); }} className="ml-auto block cursor-pointer rounded-lg bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600" aria-label={open ? "Focus Llama Tutor" : "Open Llama Tutor"} aria-expanded={open} aria-controls="llama-tutor-panel" title={resting ? "Llama Tutor is resting — view usage details" : "Llama Tutor"}>
        <LlamaPet state={tutorState} hop={hop} />
      </button>
    </aside>
  );
}

class TutorRequestError extends Error {
  constructor(message: string, readonly code: string | null, readonly messagesRemaining?: number) {
    super(message);
  }
}
