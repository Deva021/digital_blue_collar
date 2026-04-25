import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchPagination } from './SearchPagination';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

function getStatusBadge(status: string) {
  switch (status) {
    case 'open':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Open</Badge>;
    case 'filled':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Filled</Badge>;
    case 'cancelled':
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

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
          <Link key={job.id} href={`/jobs/${job.id}`}>
            <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-slate-300">
              <CardHeader className="pb-3 border-b border-gray-50 grow-0">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">{job.title}</CardTitle>
                  {getStatusBadge(job.status)}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {job.location_text || 'Remote'}
                </div>
                {job.service_categories?.name && (
                  <Badge variant="outline" className="w-fit mt-2">{job.service_categories.name}</Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <p className="line-clamp-3 text-sm text-gray-700">{job.description}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-4 text-sm text-muted-foreground flex justify-between items-center">
                <span className="font-medium text-slate-800">
                  {job.budget_range && job.budget_range !== 'null' && job.budget_range.trim() !== '' 
                    ? `Budget: ${job.budget_range}` 
                    : 'Open to receive quotes'}
                </span>
                <span className="text-slate-400 text-xs">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <SearchPagination totalItems={totalCount} />
    </div>
  );
}
