import { getJobPostById } from "@/lib/services/jobs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MapPin, Briefcase, Calendar, Users, FileText } from "lucide-react";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobPostById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/dashboard/jobs" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to jobs
      </Link>
      
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{job.title}</h1>
            <Badge className="capitalize text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 border-none">{job.status}</Badge>
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
                  {job.budget_range ? job.budget_range : 'Not specified'}
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
      
      {/* Applications Management Section */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Applications</h2>
            <p className="text-sm text-slate-500 mt-1">Manage workers who have applied for this job</p>
          </div>
          <Link href={`/dashboard/jobs/${job.id}/applications`} className={buttonVariants({ variant: "primary" })}>
            View Applications
          </Link>
        </div>
      </div>
    </div>
  );
}
