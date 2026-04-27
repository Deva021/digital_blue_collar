import { getWorkerApplications } from "@/lib/services/applications";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardTitle, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ChevronLeft, FileText, Calendar, MapPin } from "lucide-react";
import { ApplicationStatusBadge } from "@/components/features/applications/ApplicationStatusBadge";

export default async function WorkerApplicationsPage() {
  const applications = await getWorkerApplications() || [];

  return (
    <div className="flex flex-col space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground mt-1">Track the status of jobs you have applied to.</p>
        </div>
        <Link href="/jobs" className={buttonVariants({ variant: "outline" })}>
          Find more jobs
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No applications yet"
          description="You haven't applied to any jobs. Browse available jobs and submit your first application."
          action={<Link href="/jobs" className={buttonVariants({ variant: "primary" })}>Browse Jobs</Link>}
        />
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <Card key={app.id} className="w-full flex shrink-0 hover:shadow-sm border-slate-200">
              <div className="p-6 flex flex-col md:flex-row gap-6 w-full justify-between items-start md:items-center">
                
                <div className="space-y-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start mb-1">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <h3 className="text-lg font-semibold text-slate-900">{(app.job_posts as any)?.title || "Unknown Job"}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(app.job_posts as any)?.location_text || "Remote"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Application</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md line-clamp-2 md:line-clamp-none border border-slate-100">
                      {app.message}
                    </p>
                  </div>
                </div>
                
                <div className="w-full md:w-64 bg-slate-50/80 p-5 rounded-lg border border-slate-100 flex flex-col gap-4 self-stretch justify-center items-start md:items-end text-left md:text-right">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Status</span>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Proposed Price</span>
                    <span className="font-semibold text-slate-900">{app.proposed_price} ETB</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
