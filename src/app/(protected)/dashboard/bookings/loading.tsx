import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BookingsLoading() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="w-32 h-4">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-64 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6 rounded-md" />
                  <Skeleton className="w-32 h-5" />
                </div>
                <div className="flex gap-3 ml-8">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-32 h-4" />
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-16 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
