import { getActiveCategories } from "@/lib/services/categories";
import { JobPostForm } from "@/components/jobs/JobPostForm";

export default async function NewJobPage() {
  const categories = await getActiveCategories();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
        <p className="text-muted-foreground mt-2">Provide details about the work you need done so professionals can apply.</p>
      </div>
      
      <JobPostForm categories={categories} />
    </div>
  );
}
