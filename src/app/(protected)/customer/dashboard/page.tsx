import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CustomerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Gracefully fetch profile
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('location_text')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Customer Dashboard</h1>
        <p className="text-lg text-slate-500">Find workers, manage your job posts, and view bookings.</p>
      </header>

      {!profile ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-blue-900">Finish Your Account Setup</h2>
          <p className="text-blue-700">You haven't established your default customer location yet. Set up your customer profile to start hiring workers.</p>
          <div className="pt-4">
            <Link href="/customer/settings/profile">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Create Customer Profile</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Phase 9 Placeholder Box 1 */}
            <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="space-y-2 relative z-10">
                   <h2 className="text-xl font-bold">My Job Posts</h2>
                   <p className="text-slate-500">Currently active jobs and historical posts you've published.</p>
               </div>
               <div className="mt-8 flex items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400">
                   (Job Posting Interface Coming Soon)
               </div>
            </section>
            
            {/* Phase 9 Placeholder Box 2 */}
            <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="space-y-2 relative z-10">
                   <h2 className="text-xl font-bold">Active Bookings</h2>
                   <p className="text-slate-500">Manage direct reservations and schedules with individual workers.</p>
               </div>
               <div className="mt-8 flex items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400">
                   (Bookings Interface Coming Soon)
               </div>
            </section>

          </div>

          <div className="space-y-6">
            <aside className="p-6 rounded-2xl bg-slate-900 text-white shadow-md">
              <h2 className="text-lg font-semibold text-slate-200 mb-2">My Profile</h2>
              <p className="text-slate-400 text-sm mt-4 uppercase tracking-wider font-medium">Default Location</p>
              <p className="font-medium mt-1">{profile.location_text}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-800">
                 <Link href="/customer/settings/profile">
                   <Button variant="outline" className="w-full text-slate-900">Manage Profile</Button>
                 </Link>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
