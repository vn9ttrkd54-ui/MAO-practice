"use server";

import { submitChallenge } from "@/lib/challenge";
import { ensureTodayChallenge } from "@/lib/services/challengeFallbackService";
import type { Division } from "@/types/question";
import type {
  ChallengeSubmissionResult,
  SubmitChallengeInput,
} from "@/types/challenge";

export async function submitDailyChallenge(
  input: SubmitChallengeInput
): Promise<ChallengeSubmissionResult> {
  return submitChallenge(input);
}

export async function prepareDailyChallenge(division: Division): Promise<{ ready: boolean }> {
  await ensureTodayChallenge(division);
  return { ready: true };
}
