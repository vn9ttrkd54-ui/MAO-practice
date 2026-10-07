"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// UX only. Enforcement is in the server Auth guard, database pre-request hook,
// and restrictive RLS; removing this component cannot grant account access.
export default function AccountAccessGate() {
  const pathname = usePathname();
  useEffect(() => {
    if (["/auth/resolve", "/contact", "/privacy", "/terms", "/acceptable-use"].includes(pathname)) return;
    let disposed = false;
    let pending = false;
    const controller = new AbortController();
    const check = async () => {
      if (pending || document.visibilityState === "hidden") return;
      pending = true;
      try {
        const response = await fetch("/api/account/moderation", { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(9000)]) });
        const body = response.ok ? await response.json() : null;
        if (!disposed && (body?.restriction === "rename" || body?.restriction === "suspended")) window.location.replace("/auth/resolve");
      } catch { /* Existing page remains usable during transient failures; writes still fail closed. */ }
      finally { pending = false; }
    };
    void check();
    const timer = window.setInterval(check, 30000);
    window.addEventListener("focus", check);
    return () => { disposed = true; controller.abort(); window.clearInterval(timer); window.removeEventListener("focus", check); };
  }, [pathname]);
  return null;
}
