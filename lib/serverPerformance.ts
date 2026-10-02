import "server-only";
import { createApiObserver } from "@/lib/apiMetrics";

// Opt in only on the server. No collector endpoint, extra fetches or DB writes.
export const observeApi = createApiObserver({
  enabled: () => process.env.MAO_API_METRICS === "1",
  emit: line => console.info(line),
});
