import { createClient } from "@/lib/supabase/client";
import { memoryTrainerHistoryStorage } from "@/lib/storage/trainerHistory/memoryTrainerHistoryStorage";
import { createSupabaseTrainerHistoryStorage } from "@/lib/storage/trainerHistory/supabaseTrainerHistoryStorage";
import type { TrainerSessionRecord } from "@/types/trainer";

async function getStorage() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
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
  session: TrainerSessionRecord
): Promise<TrainerSessionRecord[]> {
  const storage = await getStorage();
  return storage.saveSession(session);
}

export async function clearTrainerHistory():
  Promise<void> {
  const storage = await getStorage();
  return storage.clearHistory();
}
