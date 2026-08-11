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
    <>
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

      {pending ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/25 px-5 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-7 py-8 text-center shadow-2xl">
            <span className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <div>
              <p className="font-bold text-slate-950">{pendingText}</p>
              <p className="mt-1 text-sm text-slate-500">Please keep this page open.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
