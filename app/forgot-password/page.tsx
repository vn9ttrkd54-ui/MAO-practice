import Link from "next/link";
import { KeyRound } from "lucide-react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import styles from "@/components/auth/auth.module.css";

export default function ForgotPasswordPage() {
  return <main className={`${styles.page} px-6 py-12 sm:px-8 sm:py-16`}>
    <section className={`${styles.card} mx-auto max-w-lg rounded-3xl border p-6 sm:p-8`}>
      <div className={styles.icon}><KeyRound size={25} aria-hidden="true" /></div>
      <h1 className="mt-4 text-3xl font-bold">Forgot password?</h1>
      <p className="mt-3 text-slate-600">Enter the recovery email you previously added to your account. We’ll send a link so you can choose a new password.</p>
      <ForgotPasswordForm />
      <p className="mt-5 text-sm text-slate-600">Use Google to sign in? Return to login and choose Continue with Google. If you never added a recovery email, contact the site owner for help verifying your account.</p>
      <Link href="/login" className="mt-6 inline-block font-semibold text-blue-700 hover:underline">Back to login</Link>
    </section>
  </main>;
}
