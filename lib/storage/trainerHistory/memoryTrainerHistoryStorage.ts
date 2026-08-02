import type { TrainerHistoryStorage } from "@/lib/storage/trainerHistory/trainerHistoryStorage";
import type { TrainerSessionRecord } from "@/types/trainer";

let sessions: TrainerSessionRecord[] = [];

export const memoryTrainerHistoryStorage: TrainerHistoryStorage = {
  async getHistory() {
    return [...sessions].sort(
      (first, second) =>
        second.endedAt - first.endedAt
    );
  },

  async saveSession(session) {
    sessions = [
      session,
      ...sessions.filter(
        (existing) => existing.id !== session.id
      ),
    ];

    return this.getHistory();
  },

  async clearHistory() {
    sessions = [];
  },
};
