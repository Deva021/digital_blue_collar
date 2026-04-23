import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CustomerProfileForm } from "@/components/customer/customer-profile-form";

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
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">Configure your customer location to enhance matching logistics.</p>
      </div>
      
      {/* Fallback pattern maps null accurately triggering creation mode if not present */}
      <CustomerProfileForm initialData={profile || undefined} />
    </div>
  );
}
