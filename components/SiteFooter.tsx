import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-6 text-sm text-slate-600 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Mathematics Daily</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="hover:text-slate-950 hover:underline" href="/privacy">Privacy</Link>
          <Link className="hover:text-slate-950 hover:underline" href="/terms">Terms</Link>
          <Link className="hover:text-slate-950 hover:underline" href="/acceptable-use">Acceptable Use</Link>
          <Link className="hover:text-slate-950 hover:underline" href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
