import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Link from "next/link";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/passwordPolicy";

// The reset endpoint independently verifies the signed cookie on every request.
export default function RecoveryGate({ serverVerified }: { serverVerified: boolean }) {
  if (!serverVerified) {
    return (
      <>
        <h1 className="mt-3 text-3xl font-bold">Invalid or expired link</h1>
        <p className="mt-3 text-gray-600">Request a new link using your recovery email. If you never added one, ask the site owner for help verifying your account.</p>
        <Link href="/forgot-password" className="mt-5 inline-block font-semibold text-blue-700 hover:underline">Request a new reset link</Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-3 text-3xl font-bold">Set a new password</h1>
      <p className="mt-3 text-gray-600">Choose a new password with at least {MIN_PASSWORD_LENGTH} characters.</p>
      <ResetPasswordForm />
    </>
  );
}
