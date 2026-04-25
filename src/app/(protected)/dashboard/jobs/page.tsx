import { getCustomerJobs } from "@/lib/services/jobs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardTitle, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase } from "lucide-react";

function getStatusBadge(status: string) {
  switch (status) {
    case 'open':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Open</Badge>;
    case 'filled':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Filled</Badge>;
    case 'cancelled':
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function DashboardJobsPage() {
  const jobs = await getCustomerJobs() || [];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Job Postings</h1>
          <p className="text-muted-foreground mt-1">Manage jobs you have posted and track applications.</p>
        </div>
        <Link href="/dashboard/jobs/new" className={buttonVariants({ variant: "primary" })}>
          <Plus className="w-4 h-4 mr-2" /> Post a new job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6" />}
          title="No jobs posted yet"
          description="Create your first job posting to start receiving applications from qualified professionals."
          action={<Link href="/dashboard/jobs/new" className={buttonVariants({ variant: "outline" })}>Post a new job</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-blue-300">
                <CardHeader className="pb-3 border-b border-gray-50 flex-grow-0">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2">{job.title}</CardTitle>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">{job.location_text || 'Remote'}</div>
                  {job.service_categories?.name && (
                    <Badge variant="outline" className="w-fit mt-2">{job.service_categories.name}</Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                  <p className="line-clamp-3 text-sm text-gray-700">{job.description}</p>
                </CardContent>
                <CardFooter className="pt-0 pb-4 text-sm text-muted-foreground flex justify-between">
                  <span>{job.budget_range ? `Budget: ${job.budget_range}` : 'No exact budget'}</span>
                  <span className="text-slate-400 text-xs">{new Date(job.created_at).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
