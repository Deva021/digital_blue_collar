import { getActiveCategories } from "@/lib/services/categories";
import { WorkerServiceForm } from "@/components/worker/worker-service-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add New Service - Dashboard",
};

export default async function NewServicePage() {
  const categories = await getActiveCategories();

  // Temporary fix: In real usage, onSuccess hook or server actions should handle redirect 
  // We use standard server action revalidation, and next/navigation router client-side in the form 
  // or a server redirect hook. For simplicity, we built the form to work autonomously.

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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Service</h1>
          <p className="text-slate-500 mt-1">Provide clear details to help customers book you correctly.</p>
        </div>
      </div>

      <WorkerServiceForm categories={categories} />
    </div>
  );
}
