export default function MultiplayerLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6" role="status" aria-live="polite">
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 motion-reduce:animate-none" />
          <div>
            <p className="font-bold text-slate-900">Loading Multiplayer</p>
            <p className="mt-1 text-sm text-slate-500">Fetching rooms and rankings…</p>
          </div>
        </div>
      </div>
    </div>
  );
}
