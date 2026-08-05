"use client";

import Link from "next/link";
import { AlertCircle, Bookmark, CheckCircle2, Circle, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { questions } from "@/data/questions";
import { filterQuestions, getDifficulties, getMethods, getTopics } from "@/lib/filters";
import { getQuestionBankUserData } from "@/lib/services/questionBankUserDataService";
import type { Division } from "@/types/question";
import type { QuestionStatus } from "@/types/progress";

type BookmarkFilter = "All Bookmarks" | "Bookmarked" | "Not Bookmarked";
const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function QuestionBankDivisionClient({ division }: { division: Division }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") ?? "All Topics";
  const difficulty = searchParams.get("difficulty") ?? "All Difficulties";
  const method = searchParams.get("method") ?? "All Methods";
  const status = searchParams.get("status") ?? "All Status";
  const bookmarkFilter = (searchParams.get("bookmarks") ?? "All Bookmarks") as BookmarkFilter;
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionStatus>>({});
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<Set<number>>(new Set());

  const divisionQuestions = useMemo(() => questions.filter((question) => question.division === division), [division]);
  const topics = getTopics(division);
  const difficulties = getDifficulties(division);
  const methods = getMethods(division);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuestionBankUserData(divisionQuestions.map((question) => question.id));
        setQuestionStatuses(data.statuses);
        setBookmarkedQuestionIds(new Set(data.bookmarkedQuestionIds));
      } catch {
        setQuestionStatuses(Object.fromEntries(divisionQuestions.map((question) => [question.id, "new" as QuestionStatus])));
        setBookmarkedQuestionIds(new Set());
      }
    };
    void load();
    window.addEventListener("focus", load);
    window.addEventListener("pageshow", load);
    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("pageshow", load);
    };
  }, [divisionQuestions]);

  const setFilter = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === defaultValue || value.trim() === "") next.delete(key);
    else next.set(key, value);
    router.replace(next.size ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
  };

  const filteredQuestions = filterQuestions({ division, topic, difficulty, method })
    .filter((question) => {
      const questionStatus = questionStatuses[question.id] ?? "new";
      const statusMatches = status === "All Status" || questionStatus === status;
      const bookmarked = bookmarkedQuestionIds.has(question.id);
      const bookmarkMatches = bookmarkFilter === "All Bookmarks" || (bookmarkFilter === "Bookmarked" && bookmarked) || (bookmarkFilter === "Not Bookmarked" && !bookmarked);
      return statusMatches && bookmarkMatches;
    })
    .sort((a, b) => a.number - b.number);

  const activeFilterCount = [topic !== "All Topics", difficulty !== "All Difficulties", method !== "All Methods", status !== "All Status", bookmarkFilter !== "All Bookmarks"].filter(Boolean).length;
  const returnTo = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
  const questionSequence = filteredQuestions.map((question) => question.id).join(",");
  const tileStyle = (value: QuestionStatus) => value === "solved" ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-400" : value === "attempted" ? "border-rose-200 bg-rose-50 text-rose-900 hover:border-rose-400" : "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50";
  const dotStyle = (value: QuestionStatus) => value === "solved" ? "bg-emerald-500" : value === "attempted" ? "bg-rose-500" : "bg-slate-300";

  return (
    <main className="min-h-full bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/practice/question-bank" className="inline-flex items-center font-semibold text-blue-600 transition hover:-translate-x-0.5 hover:text-blue-800">← All divisions</Link>

        <header
          className="mt-6 overflow-hidden rounded-3xl border border-blue-500 px-6 py-7 text-white shadow-xl shadow-blue-900/10 sm:px-9"
          style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 52%, #4338ca 100%)" }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-100">{division} division</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
            <div><h1 className="text-4xl font-bold sm:text-5xl">Question Bank</h1><p className="mt-3 max-w-2xl text-blue-100">Find questions by topic, method, progress, or bookmark without leaving the {division} collection.</p></div>
            <div className="rounded-2xl border border-white/25 bg-white/15 px-5 py-3 text-center backdrop-blur"><p className="text-3xl font-bold">{divisionQuestions.length}</p><p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Available</p></div>
          </div>
        </header>

        <section className="relative z-10 -mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><SlidersHorizontal size={19} className="text-blue-600" /><h2 className="font-bold">Find your questions</h2>{activeFilterCount ? <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">{activeFilterCount} active</span> : null}</div>{activeFilterCount ? <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-700"><RotateCcw size={15} /> Clear filters</button> : null}</div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect label="Topic" value={topic} onChange={(value) => setFilter("topic", value, "All Topics")} options={["All Topics", ...topics]} />
            <FilterSelect label="Method" value={method} onChange={(value) => setFilter("method", value, "All Methods")} options={["All Methods", ...methods]} />
            <FilterSelect label="Difficulty" value={difficulty} onChange={(value) => setFilter("difficulty", value, "All Difficulties")} options={["All Difficulties", ...difficulties.map(String)]} render={(value) => value === "All Difficulties" ? value : "★".repeat(Number(value))} />
            <FilterSelect label="Progress" value={status} onChange={(value) => setFilter("status", value, "All Status")} options={["All Status", "solved", "attempted", "new"]} render={(value) => ({ solved: "Solved", attempted: "Attempted", new: "Not Attempted" }[value] ?? value)} />
            <FilterSelect label="Bookmarks" value={bookmarkFilter} onChange={(value) => setFilter("bookmarks", value, "All Bookmarks")} options={["All Bookmarks", "Bookmarked", "Not Bookmarked"]} />
          </div>
        </section>

        <section className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-600">Browse</p><h2 className="mt-1 text-2xl font-bold">{filteredQuestions.length} {filteredQuestions.length === 1 ? "question" : "questions"}</h2></div><div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600"><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={17} className="text-emerald-600" />Solved</span><span className="inline-flex items-center gap-1.5"><AlertCircle size={17} className="text-rose-600" />Attempted</span><span className="inline-flex items-center gap-1.5"><Circle size={17} className="text-slate-400" />Not attempted</span></div></div>

          {filteredQuestions.length ? <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {filteredQuestions.map((question) => {
              const questionStatus = questionStatuses[question.id] ?? "new";
              const bookmarked = bookmarkedQuestionIds.has(question.id);
              return <Link key={question.id} href={`/practice/question-bank/${question.id}?returnTo=${encodeURIComponent(returnTo)}&sequence=${encodeURIComponent(questionSequence)}`} aria-label={`Question ${question.number}, ${question.topic}`} className={`${tileStyle(questionStatus)} group relative flex h-16 items-center justify-center rounded-xl border text-xl font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}><span className={`${dotStyle(questionStatus)} absolute h-2.5 w-2.5 rounded-full`} style={{ left: 8, top: 8 }} />{question.number}{bookmarked ? <Bookmark size={13} fill="currentColor" className="absolute text-amber-500" style={{ right: 7, top: 7 }} /> : null}</Link>;
            })}
          </div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><SlidersHorizontal className="mx-auto text-slate-300" size={34} /><h3 className="mt-4 font-bold">No matching questions</h3><p className="mt-1 text-sm text-slate-500">Try changing or clearing one of your filters.</p><button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Clear all filters</button></div>}
        </section>
      </div>
    </main>
  );
}

function FilterSelect({ label, value, options, onChange, render = (item) => item }: { label: string; value: string; options: string[]; onChange: (value: string) => void; render?: (value: string) => string }) {
  return <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>{options.map((option) => <option key={option} value={option}>{render(option)}</option>)}</select></label>;
}
