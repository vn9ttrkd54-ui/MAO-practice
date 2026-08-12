"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import LogoutButton from "@/components/auth/LogoutButton";

export default function MobileNavbarMenu({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pendingPage, setPendingPage] = useState<string | null>(null);



  function beginNavigation(href: string, label: string) {
    setOpen(false);
    if (pathname !== href) setPendingPage(label);
  }

  const linkClass = "rounded-lg px-4 py-3 hover:bg-slate-100";

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50"
      >
        <span aria-hidden="true" className="flex flex-col gap-1.5">
          <span className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="flex flex-col text-sm font-semibold text-slate-800">
            <Link href="/practice" onClick={() => beginNavigation("/practice", "Practice")} className={linkClass}>Practice</Link>
            <Link href="/challenge" onClick={() => beginNavigation("/challenge", "Challenge")} className={linkClass}>Challenge</Link>
            <Link href="/multiplayer" onClick={() => beginNavigation("/multiplayer", "Multiplayer")} className={linkClass}>Multiplayer</Link>
            {signedIn ? (
              <>
                <Link href="/dashboard" onClick={() => beginNavigation("/dashboard", "Dashboard")} className={linkClass}>Dashboard</Link>
                <div className="border-t border-slate-200 px-4 py-3">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => beginNavigation("/login", "Login")} className={linkClass}>Login</Link>
                <Link href="/signup" onClick={() => beginNavigation("/signup", "Sign Up")} className="rounded-lg bg-slate-950 px-4 py-3 text-white hover:bg-slate-800">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      ) : null}

      {pendingPage ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-8 py-7 shadow-xl">
            <span className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-sm font-semibold text-slate-700">Loading {pendingPage}…</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
