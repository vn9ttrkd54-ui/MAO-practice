"use client";

import Image from "next/image";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import MathText from "@/components/math/MathText";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGE_LENGTH = 600;

export default function LlamaTutor({
  questionId,
  revealToken,
}: {
  questionId: number;
  revealToken: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const draftRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function clearTemporaryChat() {
      abortRef.current?.abort();
      setOpen(false);
      setMessages([]);
      setDraft("");
      setError(null);
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
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeTutor();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
        throw new TutorRequestError(data.error ?? "I couldn't connect right now. Please wait a moment and try again.");
      }
      return data;
    }
    throw new DOMException("Aborted", "AbortError");
  }

  async function handleSend() {
    const message = draft.trim();
    if (!message || loading) return;

    const history = messages;
    const userMessage: ChatMessage = { role: "user", content: message };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await sendTutorRequest(message, history, controller.signal);
      setMessages((current) => [...current, { role: "assistant", content: data.message! }]);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      const requestError = caught instanceof TutorRequestError ? caught : null;
      setError(requestError?.message ?? "I couldn't connect right now. Please wait a moment and try again.");
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }

  function closeTutor() {
    abortRef.current?.abort();
    setOpen(false);
    setMessages([]);
    setDraft("");
    setError(null);
    setLoading(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }

  return (
    <aside className="fixed bottom-6 right-6 z-40 hidden lg:block">
      {open ? (
        <section className="mb-3 flex h-[min(620px,calc(100vh-7rem))] w-[420px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl" aria-label="Llama Tutor">
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <Image src="/llama-tutor.png" alt="" width={42} height={42} className="h-10 w-10 rounded-full bg-white object-cover object-top" />
              <div>
                <h2 className="font-bold">Llama Tutor</h2>
                <p className="text-xs text-slate-300">Ask about this question</p>
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
                disabled={loading}
                rows={2}
                maxLength={MAX_MESSAGE_LENGTH}
                aria-label="Message Llama Tutor"
                placeholder="Ask for a hint..."
                className="min-h-12 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
              <button type="button" onClick={() => void handleSend()} disabled={!draft.trim() || loading} className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
                <Send size={19} />
              </button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{draft.length}/{MAX_MESSAGE_LENGTH}</span>
            </div>
          </footer>
        </section>
      ) : null}

      <button ref={launcherRef} type="button" onClick={() => setOpen(true)} className={`ml-auto grid h-16 w-16 place-items-center overflow-hidden rounded-full border-2 border-slate-950 bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl ${open ? "invisible" : ""}`} aria-label="Open Llama Tutor" title="Llama Tutor">
        <Image src="/llama-tutor.png" alt="Llama Tutor" width={64} height={64} className="h-full w-full object-cover object-top" priority />
      </button>
    </aside>
  );
}

class TutorRequestError extends Error {}
