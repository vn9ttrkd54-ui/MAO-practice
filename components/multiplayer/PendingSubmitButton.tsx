"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface PendingSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  pendingText: string;
}

export default function PendingSubmitButton({
  children,
  pendingText,
  className = "",
  disabled,
  ...props
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={`${className} disabled:cursor-wait disabled:opacity-75`}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {pendingText}
        </span>
      ) : children}
    </button>
  );
}
