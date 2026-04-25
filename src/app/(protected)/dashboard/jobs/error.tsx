"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function JobsDashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-12 border-2 border-dashed border-red-100 bg-red-50/50 rounded-xl text-center space-y-4">
      <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-semibold text-red-900">We couldn't load your jobs</h2>
      <p className="text-red-600 max-w-sm mx-auto text-sm">{error.message || "An expected error occurred while fetching your job details."}</p>
      <div className="pt-4 flex justify-center gap-3">
        <button onClick={reset} className={buttonVariants({ variant: "outline" })}>Try again</button>
        <Link href="/dashboard" className={buttonVariants({ variant: "secondary" })}>Back to Dashboard</Link>
      </div>
    </div>
  );
}
