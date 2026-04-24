import { getActiveCategories } from "@/lib/services/categories";
import { getWorkerServiceById } from "@/lib/services/worker-services";
import { WorkerServiceForm } from "@/components/worker/worker-service-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Service - Dashboard",
};

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const resolvedParams = await params;
  const categories = await getActiveCategories();
  const service = await getWorkerServiceById(resolvedParams.id);

  if (!service) {
    notFound();
  }

  // Safely map the database row to the Form's expected input shape
  const initialData = {
    id: service.id,
    title: service.title,
    description: service.description,
    category_id: service.category_id,
    is_negotiable: service.is_negotiable,
    base_price: service.base_price !== null ? service.base_price : ("" as const),
    is_active: service.is_active,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/services" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Services
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Service</h1>
          <p className="text-slate-500 mt-1">Update your service details or change your pricing.</p>
        </div>
      </div>

      <WorkerServiceForm categories={categories} initialData={initialData} />
    </div>
  );
}
