import type { TrainerHistoryStorage } from "@/lib/storage/trainerHistory/trainerHistoryStorage";
import type { TrainerSessionRecord } from "@/types/trainer";
import { localTrainerHistoryPoints } from "@/lib/trainerSessionSave";

let sessions: TrainerSessionRecord[] = [];

export const memoryTrainerHistoryStorage: TrainerHistoryStorage = {
  async getHistory() {
    return [...sessions].sort(
      (first, second) =>
        second.endedAt - first.endedAt
    );
  },

  async saveSession(session, signal) {
    signal?.throwIfAborted();
    sessions = [
      session,
      ...sessions.filter(
        (existing) => existing.id !== session.id
      ),
    ];

    return { status: "saved", userId: null, sessionId: session.id, recentSessions: localTrainerHistoryPoints(sessions, session) };
  },

  async clearHistory() {
    sessions = [];
  },
};
