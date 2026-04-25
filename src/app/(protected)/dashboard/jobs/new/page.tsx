import { getActiveCategories } from "@/lib/services/categories";
import { JobPostForm } from "@/components/jobs/JobPostForm";
import Link from "next/link";

export default async function NewJobPage() {
  const categories = await getActiveCategories();

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/jobs" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to My Job Posts
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-muted-foreground mt-2">Provide details about the work you need done so professionals can apply.</p>
        </div>
      </div>
      
      <JobPostForm categories={categories} />
    </div>
  );
}
