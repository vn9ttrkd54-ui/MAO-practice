"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth/authService";

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    const result = await signOut();

    if (!result.success) {
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="font-semibold text-slate-700 transition-colors hover:text-blue-700 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? "Logging out..." : "Logout"}
    </button>
  );
}
