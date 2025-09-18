import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg text-center space-y-3">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-white/70">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="inline-block rounded bg-white/90 text-black px-4 py-2">
        Go home
      </Link>
    </div>
  );
}
