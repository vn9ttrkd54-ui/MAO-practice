export default function MultiplayerLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6" role="status" aria-live="polite">
      <div className="flex min-h-[55vh] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <div>
            <p className="font-bold text-slate-900">Loading Multiplayer</p>
            <p className="mt-1 text-sm text-slate-500">Getting rooms, rankings, and live games ready…</p>
          </div>
        </div>
      </div>
    </div>
  );
}
