import { parseDashboardSnapshot } from "./dashboardSnapshot";
import { withRequestTimeout } from "./requestTimeout";
import type { DashboardData } from "@/types/dashboard";

export type { DashboardData, DashboardActivity } from "@/types/dashboard";

export async function getDashboardData(expectedUserId: string, signal?: AbortSignal): Promise<DashboardData> {
  return withRequestTimeout(async (requestSignal) => {
    const response = await fetch(`/api/dashboard?owner=${encodeURIComponent(expectedUserId)}`, {
      signal: requestSignal, cache: "no-store",
    });
    if (response.status === 401) throw new Error("Your sign-in expired. Sign in again to view your dashboard.");
    if (response.status === 409) throw new Error("Your account changed. Reload the dashboard.");
    if (!response.ok) throw new Error("Unable to load your dashboard right now. Please try again.");
    return parseDashboardSnapshot(await response.json(), expectedUserId);
  }, { signal, message: "Your dashboard took too long to load. Please try again." });
}
