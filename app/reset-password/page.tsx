import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

import RecoveryGate from "@/components/auth/RecoveryGate";
import styles from "@/components/auth/auth.module.css";
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
    <main className={`${styles.page} px-6 py-12 sm:px-8 sm:py-16`}>
      <section className={`${styles.card} mx-auto max-w-lg rounded-3xl border p-6 sm:p-8`}>
        <div className={styles.icon}><KeyRound size={25} aria-hidden="true" /></div>
        <p className="text-sm font-semibold uppercase text-blue-600">Account recovery</p>
        <RecoveryGate serverVerified={recoveryVerified} />
        <div className="mt-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
            <ArrowLeft size={16} aria-hidden="true" />Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}
