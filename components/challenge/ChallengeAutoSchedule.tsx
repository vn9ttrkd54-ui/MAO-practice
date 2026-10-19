"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prepareDailyChallenge } from "@/app/challenge/actions";
import type { Division } from "@/types/question";

export default function ChallengeAutoSchedule({ division }: { division: Division }) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    // Assignment creation is a POST action, never a side effect of page rendering/prefetch.
    prepareDailyChallenge(division).then(() => {
      if (active) router.refresh();
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [division, retry, router]);

  return (
    <div role="status" aria-live="polite">
      <p>{error ? "Unable to prepare today's question. Please retry." : `Preparing today's ${division} question…`}</p>
      {error && <button type="button" className="mt-4 font-semibold underline" onClick={() => {
        setError(false);
        setRetry(value => value + 1);
      }}>Retry question</button>}
    </div>
  );
}
