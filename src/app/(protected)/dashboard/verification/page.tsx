import { createClient } from "@/lib/supabase/server";
import { VerificationForm } from "@/components/verification/VerificationForm";
import { VerificationStatusAlert } from "@/components/verification/VerificationStatusAlert";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure they are a worker
  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!workerProfile) {
    // Should not normally happen if accessed from dashboard navigation
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only workers can access the verification system.</p>
        <Link href="/dashboard" className="text-primary hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Fetch their latest verification request
  const { data: request } = await supabase
    .from("verification_requests")
    .select("status, admin_notes")
    .eq("worker_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const status = request?.status || "unverified";
  const adminNotes = request?.admin_notes;

  // We only show the form if they are unverified or rejected
  const showForm = status === "unverified" || status === "rejected";

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-md text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
            <p className="text-sm text-muted-foreground">Build trust with customers</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <VerificationStatusAlert 
          status={status as "unverified" | "pending" | "verified" | "rejected"} 
          adminNotes={adminNotes}
        />

        {showForm && (
          <div className="mt-6">
            <VerificationForm />
          </div>
        )}
      </div>
    </div>
  );
}
