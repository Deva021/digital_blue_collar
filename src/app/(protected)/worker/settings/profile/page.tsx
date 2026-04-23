import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkerProfileForm } from "@/components/worker/worker-profile-form";

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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Worker Profile Settings</h1>
        <p className="text-sm text-slate-500">Update your public worker identity, availability, and logistics.</p>
      </div>
      
      <WorkerProfileForm initialData={profile} />
    </div>
  );
}
