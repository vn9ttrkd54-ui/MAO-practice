"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type RecoveryStatus = "checking" | "ready" | "invalid";

export default function RecoveryGate({ serverVerified }: { serverVerified: boolean }) {
  const [status, setStatus] = useState<RecoveryStatus>(serverVerified ? "ready" : "checking");
  const [browserRecovery, setBrowserRecovery] = useState(false);

  useEffect(() => {
    if (serverVerified) return;

    const supabase = createClient();
    let completed = false;
    const markReady = () => {
      if (completed) return;
      completed = true;
      window.clearTimeout(timeout);
      setBrowserRecovery(true);
      setStatus("ready");
      window.history.replaceState({}, document.title, "/reset-password");
    };
    const timeout = window.setTimeout(() => {
      if (!completed) setStatus("invalid");
    }, 8000);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        markReady();
      }
    });

    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const recoveryType = hash.get("type");

    if (recoveryType === "recovery" && accessToken && refreshToken) {
      void supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(async ({ error }) => {
          if (error) return;
          const { data: { user } } = await supabase.auth.getUser();
          if (user) markReady();
        });
    }

    return () => {
      completed = true;
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [serverVerified]);

  if (status === "checking") {
    return (
      <>
        <h1 className="mt-3 text-3xl font-bold">Verifying recovery link</h1>
        <p className="mt-3 text-gray-600">Please wait while Supabase verifies this one-time link.</p>
      </>
    );
  }

  if (status === "invalid") {
    return (
      <>
        <h1 className="mt-3 text-3xl font-bold">Invalid or expired link</h1>
        <p className="mt-3 text-gray-600">Ask the site administrator to send a new password-recovery email. Recovery links can only be used once.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-3 text-3xl font-bold">Set a new password</h1>
      <p className="mt-3 text-gray-600">Choose a new password with at least eight characters.</p>
      <ResetPasswordForm browserRecovery={browserRecovery} />
    </>
  );
}
