"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function WorkersError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center space-y-4">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-sm">{error.message || "An unexpected error occurred while loading workers."}</p>
      <div className="flex gap-3">
        <button onClick={reset} className={buttonVariants({ variant: "outline" })}>Try again</button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>Go home</Link>
      </div>
    </div>
  );
}
