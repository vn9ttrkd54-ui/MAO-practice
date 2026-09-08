"use client";

import { Analytics } from "@vercel/analytics/next";
import { analyticsUrl } from "@/lib/analyticsPrivacy";

export default function SiteAnalytics() {
  return <Analytics beforeSend={event => {
    const url = analyticsUrl(event.url);
    return url ? { ...event, url } : null;
  }} />;
}
