import { getReceivedApplications } from "@/lib/services/applications";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ApplicantCard } from "@/components/features/applications/ApplicantCard";
import { ChevronLeft, Users } from "lucide-react";

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getReceivedApplications(id);

  if (!result || !result.job) {
    // If not found or not owner, we show not found to not leak existence.
    notFound();
  }

  const { job, applications } = result;

  // Determine if there is already an accepted application
  const hasAcceptedApplication = applications.some((app: any) => app.status === 'accepted');

  return (
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto w-full">
      <Link
        href={`/dashboard/jobs/${job.id}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Job Details
      </Link>

      <div className="flex flex-col gap-1 pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Received Applications</h1>
        <p className="text-muted-foreground">Review applicants for: <span className="font-semibold text-slate-700">{job.title}</span></p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No applications yet"
          description="Your job posting hasn't received any applications yet. We'll notify you when workers apply."
          action={<Link href="/dashboard/jobs" className={buttonVariants({ variant: "outline" })}>Back to Jobs</Link>}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-slate-500">{applications.length} Applicant{applications.length !== 1 && 's'}</span>
            {hasAcceptedApplication && (
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Worker Selected
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            {applications.map((app: any) => (
              <ApplicantCard
                key={app.id}
                applicationId={app.id}
                workerName={'Professional Worker'}
                message={app.message}
                price={app.proposed_price}
                status={app.status}
                createdAt={app.created_at}
                jobHasAccepted={hasAcceptedApplication}
                verificationStatus={app.worker_profiles?.verification_status}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
