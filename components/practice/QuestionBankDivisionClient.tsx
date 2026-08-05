"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { questions } from "@/data/questions";
import { filterQuestions, getDifficulties, getMethods, getTopics } from "@/lib/filters";
import { getQuestionBankUserData } from "@/lib/services/questionBankUserDataService";
import type { Division } from "@/types/question";
import type { QuestionStatus } from "@/types/progress";

type BookmarkFilter = "All Bookmarks" | "Bookmarked" | "Not Bookmarked";

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
    if (value === defaultValue) next.delete(key);
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

  const returnTo = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
  const statusColor = (value: QuestionStatus) => value === "solved" ? "bg-green-500" : value === "attempted" ? "bg-red-500" : "bg-gray-300";

  return (
    <main className="mx-auto max-w-7xl p-8">
      <Link href="/practice/question-bank" className="font-semibold text-blue-600 hover:underline">← All divisions</Link>
      <h1 className="mt-5 text-4xl font-bold">{division} Question Bank</h1>
      <p className="mt-2 text-gray-600">Browse and filter topics unique to the {division} division.</p>

      <div className="mt-8 flex flex-wrap gap-4">
        <select aria-label="Topic" value={topic} onChange={(event) => setFilter("topic", event.target.value, "All Topics")} className="rounded-lg border p-2">
          <option>All Topics</option>{topics.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Difficulty" value={difficulty} onChange={(event) => setFilter("difficulty", event.target.value, "All Difficulties")} className="rounded-lg border p-2">
          <option>All Difficulties</option>{difficulties.map((item) => <option key={item} value={item}>{"★".repeat(item)}</option>)}
        </select>
        <select aria-label="Method" value={method} onChange={(event) => setFilter("method", event.target.value, "All Methods")} className="rounded-lg border p-2">
          <option>All Methods</option>{methods.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Status" value={status} onChange={(event) => setFilter("status", event.target.value, "All Status")} className="rounded-lg border p-2">
          <option>All Status</option><option value="solved">Solved</option><option value="attempted">Attempted</option><option value="new">Not Attempted</option>
        </select>
        <select aria-label="Bookmarks" value={bookmarkFilter} onChange={(event) => setFilter("bookmarks", event.target.value, "All Bookmarks")} className="rounded-lg border p-2">
          <option>All Bookmarks</option><option>Bookmarked</option><option>Not Bookmarked</option>
        </select>
      </div>

      <p className="mt-6 text-sm font-medium text-gray-500">Showing {filteredQuestions.length} of {divisionQuestions.length} questions</p>
      <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
        {filteredQuestions.map((question) => {
          const bookmarked = bookmarkedQuestionIds.has(question.id);
          return (
            <Link key={question.id} href={`/practice/question-bank/${question.id}?returnTo=${encodeURIComponent(returnTo)}`} className={`${statusColor(questionStatuses[question.id] ?? "new")} relative flex h-12 items-center justify-center rounded-lg font-semibold text-white transition hover:scale-105`}>
              {question.number}{bookmarked ? <Bookmark size={14} fill="currentColor" className="absolute right-1 top-1" /> : null}
            </Link>
          );
        })}
      </div>
      {filteredQuestions.length === 0 ? <p className="mt-8 text-gray-500">No questions match your filters.</p> : null}
      <div className="mt-10 flex flex-wrap gap-6 text-sm"><div>🟢 Solved</div><div>🔴 Attempted</div><div>⚪ Not Attempted</div><div className="flex items-center gap-1"><Bookmark size={15} fill="currentColor" /> Bookmarked</div></div>
    </main>
  );
}
