import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-4 w-24" />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
