"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getQuestionBankUserData, QuestionBankAccountChangedError, type QuestionBankUserData } from "@/lib/services/questionBankUserDataService";
import type { QuestionBankItem } from "@/lib/questionBankListing";

export function useQuestionBankUserData(items: QuestionBankItem[]) {
  const [snapshot, setSnapshot] = useState<{ items: QuestionBankItem[]; data: QuestionBankUserData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retry = useRef<() => void>(() => undefined);

  useEffect(() => {
    let disposed = false;
    let inFlight: AbortController | null = null;
    let lastStart = -Infinity;
    let owner: string | null | undefined;
    let authRefresh: ReturnType<typeof setTimeout> | undefined;
    const ids = items.map(item => item.id);

    const load = async (force = false) => {
      if (disposed || inFlight || document.visibilityState === "hidden" || (!force && Date.now() - lastStart < 2000)) return;
      const controller = new AbortController();
      inFlight = controller;
      lastStart = Date.now();
      setLoading(true);
      try {
        const next = await getQuestionBankUserData(ids, controller.signal);
        if (disposed || controller.signal.aborted) return;
        owner = next.userId;
        setSnapshot({ items, data: next });
        setError(null);
      } catch (error) {
        if (disposed || controller.signal.aborted) return;
        if (error instanceof QuestionBankAccountChangedError) setSnapshot(null);
        // Keep a same-account successful snapshot on a refresh failure. Never
        // turn a network failure into a fabricated all-new/no-bookmarks snapshot.
        setError(error instanceof Error ? error.message : "Unable to load saved progress. Please retry.");
      } finally {
        if (inFlight === controller) {
          inFlight = null;
          if (!disposed) setLoading(false);
        }
      }
    };
    const refresh = () => { void load(); };
    retry.current = () => { void load(true); };
    const { data: auth } = createClient().auth.onAuthStateChange((_event, session) => {
      const nextOwner = session?.user.id ?? null;
      if (owner === undefined) { owner = nextOwner; return; }
      if (owner === nextOwner) return;
      owner = nextOwner;
      inFlight?.abort();
      inFlight = null;
      setSnapshot(null);
      setError(null);
      setLoading(true);
      // Do not call another Supabase auth method within its auth callback/lock.
      clearTimeout(authRefresh);
      authRefresh = setTimeout(() => { void load(true); }, 0);
    });
    void load(true);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      disposed = true;
      inFlight?.abort();
      clearTimeout(authRefresh);
      auth.subscription.unsubscribe();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [items]);

  return { data: snapshot?.items === items ? snapshot.data : null, loading, error, retry: () => retry.current() };
}
