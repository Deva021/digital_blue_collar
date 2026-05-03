"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-8 flex flex-col items-center text-center gap-4">
        <div className="p-3 rounded-full bg-red-100 text-red-500">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-red-800">Failed to load notifications</h2>
          <p className="text-sm text-red-600 mt-1">
            Something went wrong. Please try refreshing the page.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="mt-2">
          Try again
        </Button>
      </div>
    </div>
  );
}
