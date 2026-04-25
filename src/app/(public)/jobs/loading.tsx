import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 lg:w-72 shrink-0">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </aside>
      <main className="flex-1 min-w-0">
        <div className="border-b pb-4 mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border p-6 space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-4">
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
