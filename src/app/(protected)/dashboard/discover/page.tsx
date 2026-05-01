import { getPublicWorkers, searchJobs } from "@/lib/services/search";
import { getActiveCategories } from "@/lib/services/categories";
import { WorkerList } from "@/components/search/WorkerList";
import { JobList } from "@/components/search/JobList";
import { SearchFilters } from "@/components/search/SearchFilters";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardDiscoverPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = (await props.searchParams) || {};
  const type = typeof searchParams?.type === 'string' ? searchParams.type : 'workers';
  
  const filters = {
    q: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
    category: typeof searchParams?.category === 'string' ? searchParams.category : undefined,
    location: typeof searchParams?.location === 'string' ? searchParams.location : undefined,
    available: typeof searchParams?.available === 'string' ? searchParams.available : undefined,
    sort: typeof searchParams?.sort === 'string' ? searchParams.sort : undefined,
    page: typeof searchParams?.page === 'string' ? searchParams.page : '1',
  };

  const categories = await getActiveCategories();
  
  let workers: any[] = [];
  let workersCount = 0;
  let jobs: any[] = [];
  let jobsCount = 0;

  if (type === 'jobs') {
    const res = await searchJobs(filters);
    jobs = res.data || [];
    jobsCount = res.count;
  } else {
    const res = await getPublicWorkers(filters);
    workers = res.data || [];
    workersCount = res.count;

    // Attach ratings dynamically
    const { getWorkerRatingSummary } = await import("@/lib/services/reviews");
    workers = await Promise.all(
      workers.map(async (worker) => {
        const rating = await getWorkerRatingSummary(worker.id);
        return {
          ...worker,
          rating_summary: rating,
        };
      })
    );
  }

  const getTabHref = (targetType: string) => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined) p.set(k, v);
    });
    p.set('type', targetType);
    p.delete('page');
    return `/dashboard/discover?${p.toString()}`;
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b mb-6 border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Network</h1>
          <p className="text-muted-foreground mt-2">Find professionals or job opportunities within the marketplace.</p>
        </div>
      </div>

      <div className="flex space-x-2 mb-8 relative">
        <Link href={getTabHref('workers')} className={buttonVariants({ variant: type === 'workers' ? 'primary' : 'outline' })}>
          Find Workers
        </Link>
        <Link href={getTabHref('jobs')} className={buttonVariants({ variant: type === 'jobs' ? 'primary' : 'outline' })}>
          Find Jobs
        </Link>
      </div>

      <SearchFilters categories={categories} />

      {type === 'jobs' ? (
        <JobList jobs={jobs} totalCount={jobsCount} clearLink={`/dashboard/discover?type=jobs`} />
      ) : (
        <WorkerList workers={workers || []} totalCount={workersCount} clearLink={`/dashboard/discover?type=workers`} isDashboard={true} />
      )}
    </div>
  );
}
