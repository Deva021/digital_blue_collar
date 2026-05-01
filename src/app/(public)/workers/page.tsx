import { getPublicWorkers } from "@/lib/services/search";
import { getActiveCategories } from "@/lib/services/categories";
import { WorkerList } from "@/components/search/WorkerList";
import { SearchFilters } from "@/components/search/SearchFilters";

export default async function WorkersPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = (await props.searchParams) || {};
  
  const filters = {
    q: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
    category: typeof searchParams?.category === 'string' ? searchParams.category : undefined,
    location: typeof searchParams?.location === 'string' ? searchParams.location : undefined,
    available: typeof searchParams?.available === 'string' ? searchParams.available : undefined,
    sort: typeof searchParams?.sort === 'string' ? searchParams.sort : undefined,
    page: typeof searchParams?.page === 'string' ? searchParams.page : '1',
  };

  const [categories, { data: rawWorkers, count }] = await Promise.all([
    getActiveCategories(),
    getPublicWorkers(filters)
  ]);

  // Attach ratings dynamically
  let workers = rawWorkers || [];
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

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Verified Workers</h1>
          <p className="text-lg text-muted-foreground mt-2">Discover trusted professionals ready to work.</p>
        </div>
      </div>

      <SearchFilters categories={categories} />

      <WorkerList workers={workers || []} totalCount={count} clearLink="/workers" />
    </div>
  );
}
