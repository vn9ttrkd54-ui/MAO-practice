import { cookies } from "next/headers";

import RecoveryGate from "@/components/auth/RecoveryGate";
import { createClient } from "@/lib/supabase/server";
import { verifyRecoveryToken } from "@/lib/auth/recoveryToken";

const RECOVERY_COOKIE = "mathematics_daily_password_recovery";

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const recoveryVerified = Boolean(
    user && verifyRecoveryToken(cookieStore.get(RECOVERY_COOKIE)?.value, user.id)
  );

  return (
    <main className="mx-auto max-w-xl px-6 py-12 sm:px-8">
      <section className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Account recovery</p>
        <RecoveryGate serverVerified={recoveryVerified} />
      </section>
    </main>
  );
}
