import Link from "next/link";

import LogoutButton from "@/components/auth/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="flex w-full items-center justify-between border-b p-6">
      <Link href="/" className="text-xl font-bold">
        Mathematic Daily
      </Link>

      <div className="flex items-center gap-6">
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
    </nav>
  );
}
