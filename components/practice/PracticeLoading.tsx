export default function PracticeLoading() {
  return (
    <div role="status" aria-live="polite" className="min-h-[60vh] bg-slate-100 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-lg font-semibold">Loading practice…</p>
        <p className="mt-2 text-sm text-slate-600">Getting your questions ready.</p>
        <div aria-hidden="true" className="mt-6 space-y-3 motion-safe:animate-pulse">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
