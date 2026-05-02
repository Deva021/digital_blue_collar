import { Skeleton } from "@/components/ui/skeleton";

export default function VerificationLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
