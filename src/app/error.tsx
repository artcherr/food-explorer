
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg text-center space-y-3">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-white/70">{error.message}</p>
      <button onClick={reset} className="rounded bg-white/90 text-black px-4 py-2">
        Try again
      </button>
    </div>
  );
}
