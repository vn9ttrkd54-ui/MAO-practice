"use server";

import { submitChallenge } from "@/lib/challenge";
import type {
  ChallengeSubmissionResult,
  SubmitChallengeInput,
} from "@/types/challenge";

export async function submitDailyChallenge(
  input: SubmitChallengeInput
): Promise<ChallengeSubmissionResult> {
  return submitChallenge(input);
}
