import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BookingDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="w-32 h-4">
        <Skeleton className="w-full h-full" />
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-64 h-4" />
          </div>
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="w-8 h-8 rounded-md" />
              <div className="space-y-1 flex-1">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-full h-5" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
