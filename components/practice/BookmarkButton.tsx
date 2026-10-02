import {
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

type BookmarkButtonProps = {
  bookmarked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  saving?: boolean;
  known?: boolean;
};

export default function BookmarkButton({
  bookmarked,
  onToggle,
  disabled = false,
  saving = false,
  known = true,
}: BookmarkButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-busy={saving}
      aria-pressed={bookmarked}
      aria-label={
        !known ? "Bookmark status unavailable" : bookmarked
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
        disabled:opacity-50
        disabled:cursor-not-allowed
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
        {saving ? "Saving bookmark…" : !known ? "Bookmark unavailable" : bookmarked
          ? "Bookmarked"
          : "Bookmark"}
      </span>
    </button>
  );
}
