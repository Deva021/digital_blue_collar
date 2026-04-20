"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-red-200 bg-red-50 mt-8 mx-auto max-w-xl">
      <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-red-600 text-sm mb-6">
        We encountered a problem loading this section of the app.
      </p>
      <button
        onClick={() => reset()}
        className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
