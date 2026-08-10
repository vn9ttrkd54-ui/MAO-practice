import type { Division } from "@/types/question";

type TrainerSetupProps = {
  division: Division;
  error: string | null;
  onDivisionChange: (division: Division) => void;
  onStart: () => void;
};

export default function TrainerSetup({
  division,
  error,
  onDivisionChange,
  onStart,
}: TrainerSetupProps) {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold">
          Daily Trainer
        </h1>

        <p className="mt-3 text-gray-600">
          Select your division and begin a continuous
          training session.
        </p>

        <section className="mt-8 border rounded-xl p-6">
          <label
            htmlFor="trainer-division"
            className="block font-semibold mb-2"
          >
            Division
          </label>

          <select
            id="trainer-division"
            value={division}
            onChange={(event) =>
              onDivisionChange(
                event.target.value as Division
              )
            }
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          >
            <option value="Mu">Mu</option>
            <option value="Alpha">Alpha</option>
            <option value="Theta">Theta</option>
          </select>


          {error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={onStart}
            className="
              w-full
              mt-6
              bg-black
              text-white
              font-semibold
              rounded-lg
              px-6
              py-3
              hover:bg-gray-800
            "
          >
            Start Trainer
          </button>
        </section>
      </div>
    </main>
  );
}
