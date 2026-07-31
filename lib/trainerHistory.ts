import type {
  TrainerSessionRecord,
} from "@/types/trainer";

const TRAINER_HISTORY_STORAGE_KEY =
  "mao-trainer-history";

function isTrainerSessionRecord(
  value: unknown
): value is TrainerSessionRecord {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const record =
    value as Partial<TrainerSessionRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.division === "string" &&
    typeof record.startedAt === "number" &&
    typeof record.endedAt === "number" &&
    typeof record.startingLevel === "object" &&
    record.startingLevel !== null &&
    typeof record.endingLevel === "object" &&
    record.endingLevel !== null &&
    Array.isArray(record.results)
  );
}

export function getTrainerHistory():
  TrainerSessionRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedData = localStorage.getItem(
    TRAINER_HISTORY_STORAGE_KEY
  );

  if (!storedData) {
    return [];
  }

  try {
    const parsedData = JSON.parse(
      storedData
    ) as unknown;

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData
      .filter(isTrainerSessionRecord)
      .sort(
        (firstSession, secondSession) =>
          secondSession.endedAt -
          firstSession.endedAt
      );
  } catch {
    return [];
  }
}

export function saveTrainerSession(
  session: TrainerSessionRecord
): TrainerSessionRecord[] {
  const currentHistory =
    getTrainerHistory();

  const updatedHistory = [
    session,
    ...currentHistory.filter(
      (existingSession) =>
        existingSession.id !== session.id
    ),
  ];

  localStorage.setItem(
    TRAINER_HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory)
  );

  return updatedHistory;
}

export function clearTrainerHistory(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    TRAINER_HISTORY_STORAGE_KEY
  );
}