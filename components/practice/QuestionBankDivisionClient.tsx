"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bookmark, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { encodeQuestionSequence, filterQuestionBankItems, questionBankHref, QUESTION_BANK_BATCH_SIZE, type QuestionBankItem } from "@/lib/questionBankListing";
import { useQuestionBankUserData } from "@/components/practice/useQuestionBankUserData";
import type { Division } from "@/types/question";
import type { QuestionStatus } from "@/types/progress";
import logo from "@/app/apple-icon.png";
import styles from "./question-bank-division.module.css";

type BookmarkFilter = "All Bookmarks" | "Bookmarked" | "Not Bookmarked";

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
  const divisionTheme = { Mu: styles.mu, Alpha: styles.alpha, Theta: styles.theta }[division];

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
    <main className={`${styles.page} ${divisionTheme}`}>
      <div className={styles.content}>
        <Link href="/practice/question-bank" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />All divisions</Link>

        <header
          className={styles.header}
        >
          <Image src={logo} alt="" width={210} height={210} className={styles.watermark} unoptimized />
          <div className={styles.headerInner}>
            <div className={styles.title}>
              <p>{division.toUpperCase()} DIVISION</p>
              <h1>Question Bank</h1>
              <span className={styles.goldRule} aria-hidden="true" />
            </div>
            <div className={styles.available}><strong>{divisionQuestions.length}</strong><span>available questions</span></div>
          </div>
        </header>

        <section className={styles.filters} aria-label="Question filters">
          <div className={styles.filterHeading}><div className={styles.filterTitle}><SlidersHorizontal size={18} aria-hidden="true" /><h2>Find your questions</h2>{activeFilterCount ? <span className={styles.active}>{activeFilterCount} active</span> : null}</div><button type="button" onClick={resetFilters} className={styles.reset}><RotateCcw size={15} aria-hidden="true" /> Reset filters</button></div>

          <div className={styles.fields}>
            <FilterSelect label="Topic" value={topic} onChange={(value) => setFilter("topic", value, "All Topics")} options={["All Topics", ...topics]} />
            <FilterSelect label="Method" value={method} onChange={(value) => setFilter("method", value, "All Methods")} options={["All Methods", ...methods]} />
            <FilterSelect label="Difficulty" value={difficulty} onChange={(value) => setFilter("difficulty", value, "All Difficulties")} options={["All Difficulties", ...difficulties.map(String)]} render={(value) => value === "All Difficulties" ? value : "★".repeat(Number(value))} />
            <FilterSelect label="Progress" value={status} onChange={(value) => setFilter("status", value, "All Status")} options={["All Status", "solved", "attempted", "new"]} render={(value) => ({ solved: "Solved", attempted: "Attempted", new: "Not Attempted" }[value] ?? value)} />
            <FilterSelect label="Bookmarks" value={bookmarkFilter} onChange={(value) => setFilter("bookmarks", value, "All Bookmarks")} options={["All Bookmarks", "Bookmarked", "Not Bookmarked"]} />
          </div>
        </section>

        <section className={styles.browse}>
          <div className={styles.browseHeading}><div><p>Browse</p><h2 aria-live="polite">{waitingForData ? "Saved progress needed" : `${filteredQuestions.length} ${filteredQuestions.length === 1 ? "question" : "questions"}`}</h2></div><div className={styles.legend} aria-label="Progress legend"><span><b className={styles.solvedDot} />Solved</span><span><b className={styles.attemptedDot} />Attempted</span><span><b className={styles.newDot} />Not attempted</span></div></div>
          {loading ? <p role="status" className="mt-3 text-sm text-slate-600">{data ? "Refreshing saved progress…" : "Loading saved progress…"}</p> : null}
          {error ? <div role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">{error} {data ? "Showing your last loaded progress." : "Progress and bookmarks are unavailable; your saved data has not been reset."}<button type="button" onClick={retry} disabled={loading} className="ml-2 font-bold underline disabled:opacity-50">Retry progress</button></div> : null}

          {filteredQuestions.length ? <div className={styles.grid}>
            {filteredQuestions.slice(0, visibleCount).map((question) => {
              const questionStatus = questionStatuses[question.id] ?? "new";
              const bookmarked = bookmarkedQuestionIds.has(question.id);
              return <QuestionTile key={question.id} question={question} status={questionStatus} bookmarked={bookmarked} href={questionBankHref(question.id, returnTo, questionSequence)} />;
            })}
          </div> : waitingForData ? null : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><SlidersHorizontal className="mx-auto text-slate-300" size={34} /><h3 className="mt-4 font-bold">No matching questions</h3><p className="mt-1 text-sm text-slate-500">Try changing or clearing one of your filters.</p><button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Clear all filters</button></div>}
          {filteredQuestions.length > visibleCount ? <div className={styles.more}><p>Showing {visibleCount} of {filteredQuestions.length}</p><button type="button" onClick={showMore}>Show more questions<ChevronDown size={16} aria-hidden="true" /></button></div> : null}
        </section>
      </div>
    </main>
  );
}

function QuestionTile({ question, status, bookmarked, href }: { question: QuestionBankItem; status: QuestionStatus; bookmarked: boolean; href: string }) {
  const [intent, setIntent] = useState(false);
  const [preview, setPreview] = useState<{ left: number; top: number } | null>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const tooltipId = `question-preview-${question.id}`;
  const previewOpen = preview !== null;

  const showPreview = () => {
    setIntent(true);
    if (!link.current || !tooltip.current) return;
    const tile = link.current.getBoundingClientRect();
    const details = tooltip.current.getBoundingClientRect();
    const edge = 12;
    const gap = 10;
    const above = tile.top - details.height - gap;
    setPreview({
      left: Math.max(edge, Math.min(tile.left + (tile.width - details.width) / 2, window.innerWidth - details.width - edge)),
      top: Math.max(edge, above >= edge ? above : Math.min(tile.bottom + gap, window.innerHeight - details.height - edge)),
    });
  };

  useEffect(() => {
    if (!previewOpen) return;
    const dismiss = () => setPreview(null);
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, [previewOpen]);

  return <div className={styles.tileWrap}>
    <Link ref={link} href={href} prefetch={intent ? null : false}
      onMouseEnter={showPreview} onMouseLeave={() => setPreview(null)}
      onFocus={event => { setIntent(true); if (event.currentTarget.matches(":focus-visible")) showPreview(); }}
      onBlur={event => { if (!event.currentTarget.matches(":hover")) setPreview(null); }} onClick={() => setPreview(null)}
      aria-label={`Question ${question.number}, ${question.topic}`} aria-describedby={tooltipId} className={styles.tile} data-status={status}>
      <span className={styles.dot} />{question.number}{bookmarked ? <Bookmark size={10} fill="currentColor" className={styles.bookmark} aria-hidden="true" /> : null}
    </Link>
    <div ref={tooltip} id={tooltipId} role="tooltip" className={styles.tileTooltip} data-open={previewOpen} style={preview ?? undefined}>
      <p>Question {question.number}</p>
      <dl>
        <div><dt>Difficulty</dt><dd className={styles.previewDifficulty}><span aria-hidden="true">{"★".repeat(question.difficulty)}<span className={styles.emptyStars}>{"☆".repeat(5 - question.difficulty)}</span></span><span>{question.difficulty}/5</span></dd></div>
        <div><dt>Topic</dt><dd>{question.topic}</dd></div>
        <div><dt>{question.methods.length > 1 ? "Methods" : "Method"}</dt><dd>{question.methods.length ? question.methods.join(", ") : "Not specified"}</dd></div>
      </dl>
    </div>
  </div>;
}

function FilterSelect({ label, value, options, onChange, render = (item) => item }: { label: string; value: string; options: string[]; onChange: (value: string) => void; render?: (value: string) => string }) {
  return <label className={styles.field}><span>{label}</span><span className={styles.selectWrap}><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{render(option)}</option>)}</select><span className={styles.chevron}><ChevronDown size={16} aria-hidden="true" /></span></span></label>;
}
