import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkerProfileForm } from "@/components/worker/worker-profile-form";
import { WorkerCategoryForm } from "@/components/worker/worker-category-form";
import { getActiveCategories, getWorkerCategoryIds } from "@/lib/services/categories";
import Link from "next/link";

export const metadata = {
  title: "Profile Settings - Worker Dashboard",
};

export default async function WorkerProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // If they bypass middleware somehow, forcefully send them to onboarding
    redirect('/onboarding/worker');
  }

  const categories = await getActiveCategories();
  const workerCategoryIds = await getWorkerCategoryIds(user.id);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-12">
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <Link 
            href="/worker/dashboard" 
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to Dashboard
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Worker Profile Settings</h1>
            <p className="text-sm text-slate-500">Update your public worker identity, availability, and logistics.</p>
          </div>
        </div>
        
        <WorkerProfileForm initialData={profile} />
      </div>

      <hr className="border-slate-200" />

      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Service Categories</h2>
          <p className="text-sm text-slate-500">Select the categories that best describe the services you offer.</p>
        </div>
        <WorkerCategoryForm categories={categories} initialSelectedCategoryIds={workerCategoryIds} />
      </div>
    </div>
  );
}
