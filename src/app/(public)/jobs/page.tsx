import { searchJobs } from "@/lib/services/search";
import { getActiveCategories } from "@/lib/services/categories";
import { JobList } from "@/components/search/JobList";
import { SearchFilters } from "@/components/search/SearchFilters";

export default async function JobsPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = (await props.searchParams) || {};
  
  const filters = {
    q: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
    category: typeof searchParams?.category === 'string' ? searchParams.category : undefined,
    location: typeof searchParams?.location === 'string' ? searchParams.location : undefined,
    available: typeof searchParams?.available === 'string' ? searchParams.available : undefined,
    sort: typeof searchParams?.sort === 'string' ? searchParams.sort : undefined,
    page: typeof searchParams?.page === 'string' ? searchParams.page : '1',
  };

  const [categories, { data: jobs, count }] = await Promise.all([
    getActiveCategories(),
    searchJobs(filters)
  ]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Available Jobs</h1>
          <p className="text-lg text-muted-foreground mt-2">Find your next project and apply immediately.</p>
        </div>
      </div>

      <SearchFilters categories={categories} />

      <JobList jobs={jobs || []} totalCount={count} clearLink="/jobs" />
    </div>
  );
}
