import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Dashboard implies they are fully onboarded based on our middleware guard!
  // We fetch their profile to welcome them.
  const { data: profile } = await supabase
    .from('worker_profiles')
    .select('bio, availability_status')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Worker Dashboard</h1>
        <p className="text-lg text-slate-500">Manage your jobs, availability, and profile.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Profile Summary</h2>
          <p className="text-slate-700 whitespace-pre-wrap">{profile?.bio || "No bio set."}</p>
          <div className="mt-8 flex gap-3">
             <Link href="/worker/settings/profile">
               <Button variant="outline">Edit Profile</Button>
             </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md">
          <h2 className="text-lg font-semibold text-slate-200 mb-2">Status</h2>
          <div className="flex items-center gap-3 mt-4">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${profile?.availability_status === 'available' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${profile?.availability_status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-medium capitalize">{profile?.availability_status || "Offline"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
