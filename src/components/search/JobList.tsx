import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchPagination } from './SearchPagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';

export function JobList({ jobs, totalCount, clearLink = "/jobs" }: { jobs: any[], totalCount: number, clearLink?: string }) {
  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        description="Try adjusting your filters to find what you're looking for."
        action={<Link href={clearLink} className={buttonVariants({ variant: 'outline' })}>Clear Filters</Link>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground border-b pb-2">
        <span>Showing {jobs.length} of {totalCount} jobs</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <Card key={job.id} className="flex flex-col hover:shadow-md transition-shadow cursor-default">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
              </div>
              <div className="text-sm text-gray-500 mt-1">{job.location_text || 'Remote / Unspecified'}</div>
              {job.service_categories?.name && (
                <Badge variant="outline" className="w-fit mt-2">{job.service_categories.name}</Badge>
              )}
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <p className="line-clamp-3 text-sm text-gray-700">{job.description}</p>
            </CardContent>
            <CardFooter className="pt-0 pb-4 text-sm text-muted-foreground">
              {job.budget_range ? (
                <span className="font-medium text-foreground">Budget: {job.budget_range}</span>
              ) : (
                <span>No budget specified</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <SearchPagination totalItems={totalCount} />
    </div>
  );
}
