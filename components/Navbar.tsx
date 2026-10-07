import Image from "next/image";
import Link from "next/link";

import LogoutButton from "@/components/auth/LogoutButton";
import MobileNavbarMenu from "@/components/MobileNavbarMenu";
import AccountAccessGate from "@/components/auth/AccountAccessGate";
import { createClient } from "@/lib/supabase/server";

export function NavbarFallback() {
  return (
    <nav aria-label="Primary navigation" className="sticky top-0 z-50 flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-slate-300 bg-white px-4 py-3.5 text-slate-950 sm:px-7">
      <Link href="/" className="text-lg font-bold sm:text-xl">Mathematics Daily</Link>
      <div className="flex gap-4 text-sm font-semibold">
        <Link href="/practice">Practice</Link>
        <Link href="/multiplayer">Multiplayer</Link>
        <span role="status" className="font-normal text-slate-600">Loading account…</span>
      </div>
    </nav>
  );
}

export default async function Navbar() {
  const supabase = await createClient(undefined, { allowRestricted: true });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const desktopLinkClass =
    "font-semibold text-slate-700 transition-colors hover:text-blue-700 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";

  return (
    <nav
      aria-label="Primary navigation"
      className="sticky top-0 z-50 flex min-h-[72px] w-full items-center justify-between border-b border-slate-300 bg-white/95 px-4 py-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.10)] backdrop-blur sm:px-7"
    >
      {user ? <AccountAccessGate /> : null}
      <Link href="/" className="min-w-0 text-lg font-bold text-slate-950 sm:text-xl">
        <span className="flex items-center gap-2.5">
          <Image
            src="/icon.svg"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
          <span>Mathematics Daily</span>
        </span>
      </Link>

      <div className="hidden items-center gap-7 text-[15px] md:flex">
        <Link href="/practice" className={desktopLinkClass}>Practice</Link>
        <Link href="/challenge" className={desktopLinkClass}>Challenge</Link>
        <Link href="/multiplayer" className={desktopLinkClass}>Multiplayer</Link>

        {user ? (
          <>
            <Link href="/dashboard" className={desktopLinkClass}>Dashboard</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className={desktopLinkClass}>Login</Link>
            <Link
              href="/signup"
              className="rounded-md bg-slate-950 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue-600"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      <MobileNavbarMenu signedIn={Boolean(user)} />
    </nav>
  );
}
