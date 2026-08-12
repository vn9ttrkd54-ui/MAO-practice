import Image from "next/image";
import Link from "next/link";

import LogoutButton from "@/components/auth/LogoutButton";
import MobileNavbarMenu from "@/components/MobileNavbarMenu";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="relative z-50 flex w-full items-center justify-between border-b bg-white px-4 py-4 sm:px-6">
      <Link href="/" className="min-w-0 text-lg font-bold sm:text-xl">
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

      <MobileNavbarMenu signedIn={Boolean(user)} />
    </nav>
  );
}
