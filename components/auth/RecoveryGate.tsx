import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/passwordPolicy";

// The reset endpoint independently verifies the signed cookie on every request.
export default function RecoveryGate({ serverVerified }: { serverVerified: boolean }) {
  if (!serverVerified) {
    return (
      <>
        <h1 className="mt-3 text-3xl font-bold">Invalid or expired link</h1>
        <p className="mt-3 text-gray-600">Ask the site owner for a new password-recovery link. Older recovery email links are no longer supported.</p>
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
