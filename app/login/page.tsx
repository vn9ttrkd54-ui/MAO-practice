import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold">
        Login
      </h1>

      <p className="mt-4 text-gray-600">
        Login is coming in the next authentication pack.
      </p>

      <p className="mt-6 text-sm text-gray-600">
        Need an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-gray-950 hover:underline"
        >
          Create one now
        </Link>
      </p>
    </main>
  );
}
