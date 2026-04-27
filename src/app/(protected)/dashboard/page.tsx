import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, UserCircle, ArrowRight, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Dashboard - Digital Blue Collar",
};

export default async function UnifiedDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Gracefully probe for existence of both profile types
  const [customerRes, workerRes] = await Promise.all([
    supabase.from('customer_profiles').select('id').eq('id', user.id).maybeSingle(),
    supabase.from('worker_profiles').select('id').eq('id', user.id).maybeSingle()
  ]);

  const hasCustomer = !!customerRes.data;
  const hasWorker = !!workerRes.data;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-10">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
      </Link>

      <header className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-lg text-slate-500">How would you like to use the marketplace today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* Customer Portal Card */}
        <Link href="/customer/dashboard" className="block group">
          <div className="h-full p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserCircle size={100} />
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <UserCircle size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Customer Area</h2>
            </div>
            
            <p className="text-slate-600 text-lg mb-8 relative z-10 flex-grow">
              Hire professionals, manage your active job postings, and review your bookings.
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6 relative z-10">
              <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`h-2.5 w-2.5 rounded-full ${hasCustomer ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="text-slate-500">{hasCustomer ? "Profile Active" : "Requires Setup"}</span>
              </div>
              <span className="flex items-center text-slate-600 font-semibold group-hover:translate-x-1 transition-transform">
                Enter Portal <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>


        {/* Worker Portal Card */}
        <Link href="/worker/dashboard" className="block group">
          <div className="h-full p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:indigo-blue-300 transition-all cursor-pointer relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Briefcase size={100} />
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Briefcase size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Worker Portal</h2>
            </div>
            
            <p className="text-slate-600 text-lg mb-8 relative z-10 flex-grow">
              Discover local jobs, manage your service offerings, and update your availability.
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6 relative z-10">
              <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`h-2.5 w-2.5 rounded-full ${hasWorker ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="text-slate-500">{hasWorker ? "Profile Active" : "Requires Setup"}</span>
              </div>
              <span className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                Enter Portal <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
        
      </div>

      <div className="pt-8 border-t border-slate-100">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">Quick Links</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/discover" className="flex-1">
            <Button variant="primary" className="w-full h-12 shadow-sm text-base">
              <ArrowRight className="mr-2 h-4 w-4" />
              Discover Marketplace
            </Button>
          </Link>
          <Link href="/dashboard/jobs" className="flex-1">
            <Button variant="outline" className="w-full h-12 border-slate-200 shadow-sm text-slate-700 bg-white hover:bg-slate-50 text-base">
              <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
              My Job Posts
            </Button>
          </Link>
          <Link href="/dashboard/services" className="flex-1">
            <Button variant="outline" className="w-full h-12 border-slate-200 shadow-sm text-slate-700 bg-white hover:bg-slate-50 text-base">
              <Briefcase className="mr-2 h-4 w-4 text-indigo-500" />
              My Services
            </Button>
          </Link>
          <Link href="/dashboard/applications" className="flex-1">
            <Button variant="outline" className="w-full h-12 border-slate-200 shadow-sm text-slate-700 bg-white hover:bg-slate-50 text-base">
              <Briefcase className="mr-2 h-4 w-4 text-emerald-500" />
              My Applications
            </Button>
          </Link>
        </div>
      </div>
      
    </div>
  );
}
