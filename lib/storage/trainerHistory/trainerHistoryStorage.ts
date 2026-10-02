import type { TrainerSessionRecord, TrainerSessionReceipt } from "@/types/trainer";

export interface TrainerHistoryStorage {
  getHistory(): Promise<TrainerSessionRecord[]>;
  saveSession(
    session: TrainerSessionRecord,
    signal?: AbortSignal,
  ): Promise<TrainerSessionReceipt>;
  clearHistory(): Promise<void>;
}
