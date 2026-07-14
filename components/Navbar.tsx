import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-6 border-b">
      <Link href="/" className="text-xl font-bold">
        MAO Practice
      </Link>

      <div className="flex gap-6">
        <Link href="/practice">Practice</Link>
        <Link href="/challenge">Challenge</Link>
        <Link href="/multiplayer">Multiplayer</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}