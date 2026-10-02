import { createClient } from "@/lib/supabase/client";
import { memoryTrainerHistoryStorage } from "@/lib/storage/trainerHistory/memoryTrainerHistoryStorage";
import { createSupabaseTrainerHistoryStorage } from "@/lib/storage/trainerHistory/supabaseTrainerHistoryStorage";
import type { TrainerSessionRecord } from "@/types/trainer";

async function getStorage(expectedUserId?: string | null) {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (expectedUserId !== undefined && (session?.user.id ?? null) !== expectedUserId) {
    throw new Error("Your account changed. Reload Trainer to start a new session.");
  }

  if (!session?.user) {
    return memoryTrainerHistoryStorage;
  }

  return createSupabaseTrainerHistoryStorage(
    supabase,
    session.user.id
  );
}

export async function getTrainerHistory():
  Promise<TrainerSessionRecord[]> {
  const storage = await getStorage();
  return storage.getHistory();
}

export async function hasTrainerAccount(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(session?.user);
}

export async function saveTrainerSession(
  session: TrainerSessionRecord,
  expectedUserId?: string | null,
): Promise<TrainerSessionRecord[]> {
  const storage = await getStorage(expectedUserId);
  return storage.saveSession(session);
}

export async function clearTrainerHistory():
  Promise<void> {
  const storage = await getStorage();
  return storage.clearHistory();
}
