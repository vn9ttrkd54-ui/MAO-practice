import {
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

type BookmarkButtonProps = {
  bookmarked: boolean;
  onToggle: () => void;
};

export default function BookmarkButton({
  bookmarked,
  onToggle,
}: BookmarkButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={bookmarked}
      aria-label={
        bookmarked
          ? "Remove bookmark"
          : "Bookmark question"
      }
      className="
        inline-flex
        items-center
        gap-2
        border
        rounded-lg
        px-4
        py-2
        hover:bg-gray-100
        transition
      "
    >
      {bookmarked ? (
        <BookmarkCheck
          size={20}
          aria-hidden="true"
        />
      ) : (
        <Bookmark
          size={20}
          aria-hidden="true"
        />
      )}

      <span>
        {bookmarked
          ? "Bookmarked"
          : "Bookmark"}
      </span>
    </button>
  );
}