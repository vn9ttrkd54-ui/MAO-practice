type LevelUpBannerProps = {
  level: number;
  open: boolean;
  onClose: () => void;
};

export default function LevelUpBanner({
  level,
  open,
  onClose,
}: LevelUpBannerProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
    >
      <div
        className="
          w-full
          max-w-md
          rounded-xl
          bg-white
          p-8
          text-center
          shadow-xl
        "
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Achievement Unlocked
        </p>

        <h2
          id="level-up-title"
          className="mt-3 text-4xl font-bold"
        >
          Level Up!
        </h2>

        <p className="mt-4 text-xl">
          You reached Level {level}.
        </p>

        <p className="mt-3 text-gray-600">
          Your progress toward the next level has started.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="
            mt-8
            w-full
            rounded-lg
            bg-black
            px-6
            py-3
            font-semibold
            text-white
            hover:bg-gray-800
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}