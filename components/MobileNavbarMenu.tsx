"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import LogoutButton from "@/components/auth/LogoutButton";

export default function MobileNavbarMenu({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const closeMenu = () => setOpen(false);

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
          <div className="flex flex-col text-sm font-semibold text-slate-800" onClick={closeMenu}>
            <Link href="/practice" className="rounded-lg px-4 py-3 hover:bg-slate-100">Practice</Link>
            <Link href="/challenge" className="rounded-lg px-4 py-3 hover:bg-slate-100">Challenge</Link>
            <Link href="/multiplayer" className="rounded-lg px-4 py-3 hover:bg-slate-100">Multiplayer</Link>
            {signedIn ? (
              <>
                <Link href="/dashboard" className="rounded-lg px-4 py-3 hover:bg-slate-100">Dashboard</Link>
                <div className="border-t border-slate-200 px-4 py-3">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-4 py-3 hover:bg-slate-100">Login</Link>
                <Link href="/signup" className="rounded-lg bg-slate-950 px-4 py-3 text-white hover:bg-slate-800">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
