import { getPublicJobById } from "@/lib/services/jobs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MapPin, Briefcase, Calendar, Users, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { ApplyToJobForm } from "@/components/features/applications/ApplyToJobForm";

export default async function PublicJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getPublicJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to jobs
      </Link>
      
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{job.title}</h1>
            {job.status === 'open' && !job.hasAcceptedWorker ? (
              <Badge className="capitalize text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 border-none">Open</Badge>
            ) : (
              <Badge className="capitalize text-sm font-medium px-3 py-1 bg-slate-200 text-slate-700 border-none">
                {job.hasAcceptedWorker ? 'Filled' : job.status}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {job.location_text || 'Remote'}
            </div>
            {job.service_categories?.name && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {job.service_categories.name}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Posted on {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Description
              </h2>
              <div className="prose prose-sm prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </section>
          </div>
          
          <div className="space-y-6 bg-slate-50 p-6 rounded-lg border border-slate-100 h-fit">
            <h3 className="font-semibold text-slate-900">Job Details</h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Estimated Budget</span>
                <div className="text-slate-900">
                  {job.budget_range && job.budget_range !== 'null' && job.budget_range.trim() !== '' ? job.budget_range : 'Not specified'}
                  {job.is_negotiable && <Badge variant="outline" className="ml-2 text-xs">Negotiable</Badge>}
                </div>
              </div>
              
              <div>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Workers Needed</span>
                <div className="flex items-center gap-2 text-slate-900">
                  <Users className="w-4 h-4 text-slate-400" />
                  {job.workers_needed}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Application Form Section */}
      <div className="pt-4">
        {job.isOwner ? (
          <div className="p-8 border rounded-xl bg-orange-50 border-orange-100 flex flex-col items-center text-center">
            <h3 className="text-orange-800 font-semibold mb-2">This is your job posting</h3>
            <p className="text-orange-700 text-sm mb-4">You cannot apply to your own job.</p>
            <Link href={`/dashboard/jobs/${job.id}`} className={buttonVariants({ variant: "outline" })}>
              Manage this job
            </Link>
          </div>
        ) : job.hasAcceptedWorker || job.status !== 'open' ? (
          <div className="p-8 border rounded-xl bg-slate-50 border-slate-200 flex flex-col items-center text-center">
            <AlertCircle className="w-10 h-10 text-slate-400 mb-3" />
            <h3 className="text-slate-800 font-semibold mb-2">No longer accepting applications</h3>
            <p className="text-slate-600 text-sm mb-4">This job has been filled or is no longer open.</p>
            <Link href="/jobs" className={buttonVariants({ variant: "outline" })}>
              Find other jobs
            </Link>
          </div>
        ) : job.hasApplied ? (
          <div className="p-8 border rounded-xl bg-blue-50 border-blue-100 flex flex-col items-center text-center">
            <CheckCircle2 className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="text-blue-800 font-semibold mb-2">You have applied for this job</h3>
            <p className="text-blue-700 text-sm mb-4">
              Your application status: <strong className="capitalize">{job.applicationStatus}</strong>
            </p>
            <Link href="/dashboard/applications" className={buttonVariants({ variant: "outline" })}>
              View your applications
            </Link>
          </div>
        ) : !job.isAuthenticated ? (
          <div className="p-8 border rounded-xl bg-slate-50 border-slate-200 flex flex-col items-center text-center">
            <h3 className="text-slate-800 font-semibold mb-2">Apply for this job</h3>
            <p className="text-slate-600 text-sm mb-4">Please log in or create an account to submit an application.</p>
            <div className="flex gap-4">
              <Link href={`/login?redirect=/jobs/${job.id}`} className={buttonVariants({ variant: "primary" })}>
                Log In
              </Link>
              <Link href={`/signup?redirect=/jobs/${job.id}`} className={buttonVariants({ variant: "outline" })}>
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <ApplyToJobForm jobId={job.id} />
        )}
      </div>
    </div>
  );
}
