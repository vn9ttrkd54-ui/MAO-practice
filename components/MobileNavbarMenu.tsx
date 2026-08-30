"use client";

import Link from "next/link";
import { useState } from "react";

import LogoutButton from "@/components/auth/LogoutButton";

export default function MobileNavbarMenu({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);

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
            <Link href="/practice" onClick={() => setOpen(false)} className={linkClass}>Practice</Link>
            <Link href="/challenge" onClick={() => setOpen(false)} className={linkClass}>Challenge</Link>
            <Link href="/multiplayer" onClick={() => setOpen(false)} className={linkClass}>Multiplayer</Link>
            {signedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className={linkClass}>Dashboard</Link>
                <div className="border-t border-slate-200 px-4 py-3">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className={linkClass}>Login</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-lg bg-slate-950 px-4 py-3 text-white hover:bg-slate-800">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
