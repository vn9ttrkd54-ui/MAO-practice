"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Bookmark } from "lucide-react";

import { questions } from "@/data/questions";

import {
  getQuestionStatus,
  type QuestionStatus,
} from "@/lib/progress";

import {
  getBookmarkedQuestionIds,
} from "@/lib/bookmarks";

import {
  filterQuestions,
  getTopics,
  getDifficulties,
  getMethods,
} from "@/lib/filters";

import type {
  Division,
} from "@/types/question";

type BookmarkFilter =
  | "All Bookmarks"
  | "Bookmarked"
  | "Not Bookmarked";

export default function QuestionBankPage() {
  const [division, setDivision] =
    useState<Division>("Mu");

  const [topic, setTopic] =
    useState("All Topics");

  const [difficulty, setDifficulty] =
    useState("All Difficulties");

  const [method, setMethod] =
    useState("All Methods");

  const [status, setStatus] =
    useState("All Status");

  const [bookmarkFilter, setBookmarkFilter] =
    useState<BookmarkFilter>(
      "All Bookmarks"
    );

  const [
    questionStatuses,
    setQuestionStatuses,
  ] = useState<
    Record<number, QuestionStatus>
  >({});

  const [
    bookmarkedQuestionIds,
    setBookmarkedQuestionIds,
  ] = useState<Set<number>>(
    new Set()
  );

  const topics = getTopics(division);

  const difficulties =
    getDifficulties(division);

  const methods = getMethods(division);

  const loadUserQuestionData = () => {
    const updatedStatuses:
      Record<number, QuestionStatus> = {};

    questions.forEach((question) => {
      updatedStatuses[question.id] =
        getQuestionStatus(question.id);
    });

    setQuestionStatuses(
      updatedStatuses
    );

    setBookmarkedQuestionIds(
      new Set(
        getBookmarkedQuestionIds()
      )
    );
  };

  useEffect(() => {
    loadUserQuestionData();

    const handlePageVisible = () => {
      loadUserQuestionData();
    };

    window.addEventListener(
      "focus",
      handlePageVisible
    );

    window.addEventListener(
      "pageshow",
      handlePageVisible
    );

    return () => {
      window.removeEventListener(
        "focus",
        handlePageVisible
      );

      window.removeEventListener(
        "pageshow",
        handlePageVisible
      );
    };
  }, []);

  useEffect(() => {
    setTopic("All Topics");
    setDifficulty(
      "All Difficulties"
    );
    setMethod("All Methods");
  }, [division]);

  const filteredQuestions =
    useMemo(() => {
      return filterQuestions({
        division,
        topic,
        difficulty,
        method,
      })
        .filter((question) => {
          const questionStatus =
            questionStatuses[
              question.id
            ] ?? "new";

          const statusMatches =
            status === "All Status" ||
            questionStatus === status;

          const isBookmarked =
            bookmarkedQuestionIds.has(
              question.id
            );

          const bookmarkMatches =
            bookmarkFilter ===
              "All Bookmarks" ||
            (bookmarkFilter ===
              "Bookmarked" &&
              isBookmarked) ||
            (bookmarkFilter ===
              "Not Bookmarked" &&
              !isBookmarked);

          return (
            statusMatches &&
            bookmarkMatches
          );
        })
        .sort(
          (a, b) =>
            a.number - b.number
        );
    }, [
      division,
      topic,
      difficulty,
      method,
      status,
      bookmarkFilter,
      questionStatuses,
      bookmarkedQuestionIds,
    ]);

  const statusColor = (
    questionStatus: QuestionStatus
  ) => {
    switch (questionStatus) {
      case "solved":
        return "bg-green-500";

      case "attempted":
        return "bg-red-500";

      default:
        return "bg-gray-300";
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">
        Question Bank
      </h1>

      <p className="text-gray-600 mb-8">
        Browse every Mu Alpha Theta
        problem.
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={division}
          onChange={(event) =>
            setDivision(
              event.target
                .value as Division
            )
          }
          className="border rounded-lg p-2"
        >
          <option value="Mu">
            Mu
          </option>

          <option value="Alpha">
            Alpha
          </option>

          <option value="Theta">
            Theta
          </option>
        </select>

        <select
          value={topic}
          onChange={(event) =>
            setTopic(
              event.target.value
            )
          }
          className="border rounded-lg p-2"
        >
          <option value="All Topics">
            All Topics
          </option>

          {topics.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(event) =>
            setDifficulty(
              event.target.value
            )
          }
          className="border rounded-lg p-2"
        >
          <option value="All Difficulties">
            All Difficulties
          </option>

          {difficulties.map(
            (item) => (
              <option
                key={item}
                value={item.toString()}
              >
                {"★".repeat(item)}
              </option>
            )
          )}
        </select>

        <select
          value={method}
          onChange={(event) =>
            setMethod(
              event.target.value
            )
          }
          className="border rounded-lg p-2"
        >
          <option value="All Methods">
            All Methods
          </option>

          {methods.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value
            )
          }
          className="border rounded-lg p-2"
        >
          <option value="All Status">
            All Status
          </option>

          <option value="solved">
            Solved
          </option>

          <option value="attempted">
            Attempted
          </option>

          <option value="new">
            Not Attempted
          </option>
        </select>

        <select
          value={bookmarkFilter}
          onChange={(event) =>
            setBookmarkFilter(
              event.target
                .value as BookmarkFilter
            )
          }
          className="border rounded-lg p-2"
        >
          <option value="All Bookmarks">
            All Bookmarks
          </option>

          <option value="Bookmarked">
            Bookmarked
          </option>

          <option value="Not Bookmarked">
            Not Bookmarked
          </option>
        </select>
      </div>

      <div
        className="
          grid
          grid-cols-5
          sm:grid-cols-8
          md:grid-cols-10
          lg:grid-cols-12
          gap-3
        "
      >
        {filteredQuestions.map(
          (question) => {
            const questionStatus =
              questionStatuses[
                question.id
              ] ?? "new";

            const isBookmarked =
              bookmarkedQuestionIds.has(
                question.id
              );

            return (
              <Link
                key={question.id}
                href={`/practice/question-bank/${question.id}`}
                aria-label={
                  isBookmarked
                    ? `Question ${question.number}, bookmarked`
                    : `Question ${question.number}`
                }
                className={`
                  ${statusColor(
                    questionStatus
                  )}
                  relative
                  text-white
                  rounded-lg
                  h-12
                  font-semibold
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                `}
              >
                {question.number}

                {isBookmarked && (
                  <Bookmark
                    size={14}
                    fill="currentColor"
                    aria-hidden="true"
                    className="
                      absolute
                      right-1
                      top-1
                    "
                  />
                )}
              </Link>
            );
          }
        )}
      </div>

      {filteredQuestions.length ===
        0 && (
        <p className="text-gray-500 mt-8">
          No questions match your
          filters.
        </p>
      )}

      <div className="flex flex-wrap gap-6 mt-10 text-sm">
        <div>🟢 Solved</div>
        <div>🔴 Attempted</div>
        <div>⚪ Not Attempted</div>

        <div className="flex items-center gap-1">
          <Bookmark
            size={15}
            fill="currentColor"
            aria-hidden="true"
          />

          Bookmarked
        </div>
      </div>
    </main>
  );
}