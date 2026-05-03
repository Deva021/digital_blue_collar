import { Bell } from "lucide-react";

export default function NotificationsLoading() {
  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-slate-100 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-6 w-36 rounded bg-slate-200 animate-pulse" />
            <div className="h-3.5 w-48 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Card skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-5 py-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/5 rounded bg-slate-200 animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
              <div className="h-3 w-1/4 rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
