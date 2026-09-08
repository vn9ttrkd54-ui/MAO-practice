import type { ReactNode } from "react";

export function LegalPage({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-slate-50 px-5 py-12 text-slate-800 sm:px-8 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-slate-300 pb-8">
          <p className="text-sm font-semibold text-blue-700">Mathematics Daily</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950 sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{summary}</p>
        </header>
        <div className="legal-copy py-4">{children}</div>
      </article>
    </main>
  );
}

