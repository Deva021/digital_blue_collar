import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchPagination } from './SearchPagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';

export function WorkerList({ workers, totalCount, clearLink = "/workers" }: { workers: any[], totalCount: number, clearLink?: string }) {
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
        {workers.map(worker => (
          <Card key={worker.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Professional Worker</CardTitle>
                {worker.availability_status === 'available' && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Available</Badge>
                )}
              </div>
              <div className="text-sm text-gray-500">{worker.location_text || 'No location specified'}</div>
              {worker.worker_services && worker.worker_services.length > 0 && (
                <div className="text-xs text-primary mt-1">
                  Offers {worker.worker_services.length} service(s)
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <p className="line-clamp-3 text-sm text-gray-700">{worker.bio || 'No bio provided for this worker.'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <SearchPagination totalItems={totalCount} />
    </div>
  );
}
