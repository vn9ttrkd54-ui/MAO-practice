"use client";

import Link from "next/link";
import { Bookmark, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { encodeQuestionSequence, filterQuestionBankItems, questionBankHref, QUESTION_BANK_BATCH_SIZE, type QuestionBankItem } from "@/lib/questionBankListing";
import { useQuestionBankUserData } from "@/components/practice/useQuestionBankUserData";
import type { Division } from "@/types/question";
import type { QuestionStatus } from "@/types/progress";

type BookmarkFilter = "All Bookmarks" | "Bookmarked" | "Not Bookmarked";
const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function QuestionBankDivisionClient({ division, items: divisionQuestions }: { division: Division; items: QuestionBankItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") ?? "All Topics";
  const difficulty = searchParams.get("difficulty") ?? "All Difficulties";
  const method = searchParams.get("method") ?? "All Methods";
  const status = searchParams.get("status") ?? "All Status";
  const bookmarkFilter = (searchParams.get("bookmarks") ?? "All Bookmarks") as BookmarkFilter;
  const { data, loading, error, retry } = useQuestionBankUserData(divisionQuestions);
  const questionStatuses = data?.statuses ?? {};
  const bookmarkedQuestionIds = useMemo(() => new Set(data?.bookmarkedQuestionIds ?? []), [data]);
  const topics = useMemo(() => [...new Set(divisionQuestions.map(question => question.topic))].sort(), [divisionQuestions]);
  const difficulties = useMemo(() => [...new Set(divisionQuestions.map(question => question.difficulty))].sort((a, b) => a - b), [divisionQuestions]);
  const methods = useMemo(() => [...new Set(divisionQuestions.flatMap(question => question.methods))].sort(), [divisionQuestions]);
  const divisionTheme = {
    Mu: {
      gradient: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 52%, #4338ca 100%)",
      border: "#3b82f6",
    },
    Alpha: {
      gradient: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 52%, #9333ea 100%)",
      border: "#8b5cf6",
    },
    Theta: {
      gradient: "linear-gradient(135deg, #047857 0%, #059669 52%, #0f766e 100%)",
      border: "#10b981",
    },
  }[division];

  const replaceFilters = (next: URLSearchParams) => window.history.replaceState(null, "", next.size ? `${pathname}?${next}` : pathname);
  const resetFilters = () => replaceFilters(new URLSearchParams());
  const setFilter = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("shown");
    if (value === defaultValue || value.trim() === "") next.delete(key);
    else next.set(key, value);
    replaceFilters(next);
  };

  const waitingForData = !data && (status !== "All Status" || bookmarkFilter !== "All Bookmarks");
  const filteredQuestions = (waitingForData ? [] : filterQuestionBankItems(divisionQuestions, { topic, difficulty, method }))
    .filter((question) => {
      const questionStatus = questionStatuses[question.id] ?? "new";
      const statusMatches = status === "All Status" || questionStatus === status;
      const bookmarked = bookmarkedQuestionIds.has(question.id);
      const bookmarkMatches = bookmarkFilter === "All Bookmarks" || (bookmarkFilter === "Bookmarked" && bookmarked) || (bookmarkFilter === "Not Bookmarked" && !bookmarked);
      return statusMatches && bookmarkMatches;
    });

  const activeFilterCount = [topic !== "All Topics", difficulty !== "All Difficulties", method !== "All Methods", status !== "All Status", bookmarkFilter !== "All Bookmarks"].filter(Boolean).length;
  const returnTo = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
  const questionSequence = activeFilterCount ? encodeQuestionSequence(filteredQuestions.map(question => question.id)) : null;
  const requestedShown = Number(searchParams.get("shown"));
  const visibleCount = Math.min(divisionQuestions.length, Number.isSafeInteger(requestedShown) && requestedShown > 0 ? Math.max(QUESTION_BANK_BATCH_SIZE, requestedShown) : QUESTION_BANK_BATCH_SIZE);
  const showMore = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("shown", String(Math.min(filteredQuestions.length, visibleCount + QUESTION_BANK_BATCH_SIZE)));
    replaceFilters(next);
  };

  return (
    <main className="min-h-full bg-[#e5e7eb]">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <Link href="/practice/question-bank" className="inline-flex items-center font-semibold text-blue-600 transition hover:-translate-x-0.5 hover:text-blue-800">← All divisions</Link>

        <header
          className="mt-6 overflow-hidden rounded-3xl border px-6 py-8 text-white shadow-xl shadow-slate-900/15 sm:px-9"
          style={{ background: divisionTheme.gradient, borderColor: divisionTheme.border }}
        >
          <div className="flex min-h-28 flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/80">{division} division</p>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Question Bank</h1>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/15 px-5 py-3 text-center backdrop-blur"><p className="text-3xl font-bold">{divisionQuestions.length}</p><p className="text-xs font-semibold uppercase tracking-wider text-white/80">Available</p></div>
          </div>
        </header>

        <section className="mt-6 rounded-2xl border-2 border-slate-900 bg-[#f8fafc] p-5 shadow-lg shadow-slate-900/10 sm:p-6">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3"><div className="flex min-w-0 flex-wrap items-center gap-2"><SlidersHorizontal size={19} className="shrink-0 text-blue-600" /><h2 className="font-bold">Find your questions</h2>{activeFilterCount ? <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">{activeFilterCount} active</span> : null}</div><button type="button" onClick={resetFilters} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"><RotateCcw size={15} /> Reset filters</button></div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect label="Topic" value={topic} onChange={(value) => setFilter("topic", value, "All Topics")} options={["All Topics", ...topics]} />
            <FilterSelect label="Method" value={method} onChange={(value) => setFilter("method", value, "All Methods")} options={["All Methods", ...methods]} />
            <FilterSelect label="Difficulty" value={difficulty} onChange={(value) => setFilter("difficulty", value, "All Difficulties")} options={["All Difficulties", ...difficulties.map(String)]} render={(value) => value === "All Difficulties" ? value : "★".repeat(Number(value))} />
            <FilterSelect label="Progress" value={status} onChange={(value) => setFilter("status", value, "All Status")} options={["All Status", "solved", "attempted", "new"]} render={(value) => ({ solved: "Solved", attempted: "Attempted", new: "Not Attempted" }[value] ?? value)} />
            <FilterSelect label="Bookmarks" value={bookmarkFilter} onChange={(value) => setFilter("bookmarks", value, "All Bookmarks")} options={["All Bookmarks", "Bookmarked", "Not Bookmarked"]} />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border-2 border-slate-900 bg-[#f8fafc] p-5 shadow-lg shadow-slate-900/10 sm:p-6">
          <div><p className="text-sm font-bold uppercase tracking-wider text-blue-600">Browse</p><h2 className="mt-1 text-2xl font-bold">{waitingForData ? "Saved progress needed" : `${filteredQuestions.length} ${filteredQuestions.length === 1 ? "question" : "questions"}`}</h2></div>
          {loading ? <p role="status" className="mt-3 text-sm text-slate-600">{data ? "Refreshing saved progress…" : "Loading saved progress…"}</p> : null}
          {error ? <div role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">{error} {data ? "Showing your last loaded progress." : "Progress and bookmarks are unavailable; your saved data has not been reset."}<button type="button" onClick={retry} disabled={loading} className="ml-2 font-bold underline disabled:opacity-50">Retry progress</button></div> : null}

          {filteredQuestions.length ? <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(52px,58px))] gap-3">
            {filteredQuestions.slice(0, visibleCount).map((question) => {
              const questionStatus = questionStatuses[question.id] ?? "new";
              const bookmarked = bookmarkedQuestionIds.has(question.id);
              return <QuestionTile key={question.id} question={question} status={questionStatus} bookmarked={bookmarked} href={questionBankHref(question.id, returnTo, questionSequence)} />;
            })}
          </div> : waitingForData ? null : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><SlidersHorizontal className="mx-auto text-slate-300" size={34} /><h3 className="mt-4 font-bold">No matching questions</h3><p className="mt-1 text-sm text-slate-500">Try changing or clearing one of your filters.</p><button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Clear all filters</button></div>}
          {filteredQuestions.length > visibleCount ? <div className="mt-6 flex flex-wrap items-center gap-4"><p className="text-sm text-slate-600">Showing {visibleCount} of {filteredQuestions.length}</p><button type="button" onClick={showMore} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Show more questions</button></div> : null}
        </section>
      </div>
    </main>
  );
}

function QuestionTile({ question, status, bookmarked, href }: { question: QuestionBankItem; status: QuestionStatus; bookmarked: boolean; href: string }) {
  const [intent, setIntent] = useState(false);
  const tile = status === "solved" ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-400" : status === "attempted" ? "border-rose-200 bg-rose-50 text-rose-900 hover:border-rose-400" : "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50";
  const dot = status === "solved" ? "bg-emerald-500" : status === "attempted" ? "bg-rose-500" : "bg-slate-300";
  return <Link href={href} prefetch={intent ? null : false} onMouseEnter={() => setIntent(true)} onFocus={() => setIntent(true)} aria-label={`Question ${question.number}, ${question.topic}`} className={`${tile} group relative flex items-center justify-center rounded-xl border text-lg font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`} style={{ width: 58, height: 58 }}><span className={`${dot} absolute h-2 w-2 rounded-full`} style={{ left: 6, top: 6 }} />{question.number}{bookmarked ? <Bookmark size={11} fill="currentColor" className="absolute text-amber-500" style={{ right: 5, top: 5 }} /> : null}</Link>;
}

function FilterSelect({ label, value, options, onChange, render = (item) => item }: { label: string; value: string; options: string[]; onChange: (value: string) => void; render?: (value: string) => string }) {
  return <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>{options.map((option) => <option key={option} value={option}>{render(option)}</option>)}</select></label>;
}
