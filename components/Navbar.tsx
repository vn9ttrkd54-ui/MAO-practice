import Link from "next/link";

import LogoutButton from "@/components/auth/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="relative z-50 flex w-full items-center justify-between border-b bg-white px-4 py-4 sm:px-6">
      <Link href="/" className="min-w-0 text-lg font-bold sm:text-xl">
        Mathematics Daily
      </Link>

      <div className="hidden items-center gap-6 md:flex">
        <Link href="/practice">Practice</Link>
        <Link href="/challenge">Challenge</Link>
        <Link href="/multiplayer">Multiplayer</Link>

        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>

      <details className="group relative md:hidden">
        <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
          <span className="sr-only">Open navigation menu</span>
          <span aria-hidden="true" className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </summary>

        <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="flex flex-col text-sm font-semibold text-slate-800">
            <Link href="/practice" className="rounded-lg px-4 py-3 hover:bg-slate-100">Practice</Link>
            <Link href="/challenge" className="rounded-lg px-4 py-3 hover:bg-slate-100">Challenge</Link>
            <Link href="/multiplayer" className="rounded-lg px-4 py-3 hover:bg-slate-100">Multiplayer</Link>
            {user ? (
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
      </details>
    </nav>
  );
}
