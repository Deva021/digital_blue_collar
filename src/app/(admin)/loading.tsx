export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
        <div className="h-10 bg-neutral-200 rounded w-32"></div>
      </div>
      
      {/* Stats/Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-white border border-neutral-200 rounded-xl">
            <div className="h-5 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      
      {/* Table/Content Skeleton */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50">
          <div className="h-6 bg-neutral-200 rounded w-1/6"></div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
