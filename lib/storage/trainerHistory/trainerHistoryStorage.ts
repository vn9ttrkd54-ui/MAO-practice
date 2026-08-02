import type { TrainerSessionRecord } from "@/types/trainer";

export interface TrainerHistoryStorage {
  getHistory(): Promise<TrainerSessionRecord[]>;
  saveSession(
    session: TrainerSessionRecord
  ): Promise<TrainerSessionRecord[]>;
  clearHistory(): Promise<void>;
}
