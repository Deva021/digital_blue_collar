import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkerProfileForm } from "@/components/worker/worker-profile-form";
import { CustomerProfileForm } from "@/components/customer/customer-profile-form";
import { WorkerCategoryForm } from "@/components/worker/worker-category-form";
import { getActiveCategories, getWorkerCategoryIds } from "@/lib/services/categories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileTabSwitcher } from "@/components/profile/profile-tab-switcher";

export const metadata = {
  title: "Profile Management - Dashboard",
};

export default async function UnifiedProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Worker Profile
  const { data: workerProfile } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch Customer Profile
  const { data: customerProfile } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const categories = await getActiveCategories();
  const workerCategoryIds = await getWorkerCategoryIds(user.id);

  const workerSection = workerProfile ? (
    <div className="space-y-8">
      <WorkerProfileForm initialData={workerProfile} />
      <Card>
        <CardHeader>
          <CardTitle>Service Categories</CardTitle>
          <CardDescription>Select the categories that best describe your skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkerCategoryForm 
            categories={categories} 
            initialSelectedCategoryIds={workerCategoryIds} 
          />
        </CardContent>
      </Card>
    </div>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Become a Worker</CardTitle>
        <CardDescription>You don't have a worker profile yet.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500 mb-4">
          Register as a worker to start offering your services on the platform.
        </p>
        <a 
          href="/onboarding/worker" 
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Start Worker Onboarding
        </a>
      </CardContent>
    </Card>
  );

  const customerSection = (
    <CustomerProfileForm initialData={customerProfile || {}} />
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile Management</h1>
        <p className="text-slate-500">Manage your identity and contact information for the marketplace.</p>
      </div>

      <ProfileTabSwitcher 
        workerSection={workerSection} 
        customerSection={customerSection}
        defaultTab={workerProfile ? "worker" : "customer"}
      />
    </div>
  );
}
