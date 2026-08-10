import { cookies } from "next/headers";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
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
        {recoveryVerified && user ? (
          <>
            <h1 className="mt-3 text-3xl font-bold">Set a new password</h1>
            <p className="mt-3 text-gray-600">This secure recovery session expires after ten minutes.</p>
            <ResetPasswordForm />
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-bold">Invalid or expired link</h1>
            <p className="mt-3 text-gray-600">Ask the site administrator to send a new password-recovery email. Recovery links can only be used once.</p>
          </>
        )}
      </section>
    </main>
  );
}
