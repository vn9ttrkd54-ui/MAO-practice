type EndSessionDialogProps = {
  open: boolean;
  questionsAnswered: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  onContinue: () => void;
  onConfirmEnd: () => void;
};

export default function EndSessionDialog({
  open,
  questionsAnswered,
  correct,
  incorrect,
  giveUps,
  onContinue,
  onConfirmEnd,
}: EndSessionDialogProps) {
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
      aria-labelledby="end-session-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2
          id="end-session-title"
          className="text-2xl font-bold"
        >
          End MAO Trainer?
        </h2>

        <p className="mt-3 text-gray-600">
          Your session summary will be shown after
          you end the session.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Questions
            </p>

            <p className="mt-1 text-2xl font-bold">
              {questionsAnswered}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Correct
            </p>

            <p className="mt-1 text-2xl font-bold">
              {correct}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Incorrect
            </p>

            <p className="mt-1 text-2xl font-bold">
              {incorrect}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Gave Up
            </p>

            <p className="mt-1 text-2xl font-bold">
              {giveUps}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onContinue}
            className="
              rounded-lg
              border
              px-5
              py-3
              hover:bg-gray-100
            "
          >
            Continue Session
          </button>

          <button
            type="button"
            onClick={onConfirmEnd}
            className="
              rounded-lg
              bg-black
              px-5
              py-3
              text-white
              hover:bg-gray-800
            "
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}