import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchPagination } from './SearchPagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';

export function WorkerList({ 
  workers, 
  totalCount, 
  clearLink = "/workers",
  isDashboard = false
}: { 
  workers: any[], 
  totalCount: number, 
  clearLink?: string,
  isDashboard?: boolean
}) {
  if (!workers || workers.length === 0) {
    return (
      <EmptyState
        title="No workers found"
        description="Try adjusting your filters to find what you're looking for."
        action={<Link href={clearLink} className={buttonVariants({ variant: 'outline' })}>Clear Filters</Link>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground border-b pb-2">
        <span>Showing {workers.length} of {totalCount} workers</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map(worker => {
          const firstService = worker.worker_services?.[0];
          const bookingUrl = `/dashboard/bookings/new?worker_id=${worker.id}${firstService ? `&service_id=${firstService.id}` : ''}`;

          return (
            <Card key={worker.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{worker.full_name || 'Professional Worker'}</CardTitle>
                  {worker.availability_status === 'available' && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Available</Badge>
                  )}
                </div>
                
                <div className="text-sm font-medium text-slate-700 mt-1">
                  {worker.worker_categories?.[0]?.categories?.name || firstService?.title || 'Multi-Service Provider'}
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {worker.location_text || 'No location specified'}
                </div>
                
                <div className="flex items-center gap-1 mt-1 text-xs font-medium text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {worker.rating_summary && worker.rating_summary.review_count > 0 
                    ? `${worker.rating_summary.average_rating} (${worker.rating_summary.review_count} review${worker.rating_summary.review_count !== 1 ? 's' : ''})` 
                    : worker.rating || 'New (No reviews yet)'}
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <p className="line-clamp-3 text-sm text-slate-700">{worker.bio || 'No bio provided for this worker.'}</p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto flex flex-col gap-2">
                {isDashboard && (
                  <Link href={bookingUrl} className={buttonVariants({ variant: 'primary', className: 'w-full' })}>
                    Book Now
                  </Link>
                )}
                <Link href={`/workers/${worker.id}`} className={buttonVariants({ variant: 'outline', className: 'w-full' })}>
                  View Profile
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
      <SearchPagination totalItems={totalCount} />
    </div>
  );
}
