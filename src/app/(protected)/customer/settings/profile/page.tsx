import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CustomerProfileForm } from "@/components/customer/customer-profile-form";
import Link from "next/link";

export const metadata = {
  title: "Customer Settings - Digital Blue Collar",
};

export default async function CustomerSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Gracefully attempt profile fetch
  // If no profile occurs, CustomerProfileForm treats it as Onboarding seamlessly!
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('location_text')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col gap-4">
        <Link 
          href="/customer/dashboard" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Dashboard
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
          <p className="text-sm text-slate-500">Configure your customer location to enhance matching logistics.</p>
        </div>
      </div>
      
      {/* Fallback pattern maps null accurately triggering creation mode if not present */}
      <CustomerProfileForm initialData={profile || undefined} />
    </div>
  );
}
