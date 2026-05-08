import { getAdminJobs, type AdminJob } from '@/lib/services/admin'
import AdminDataTable from '@/components/admin/AdminDataTable'
import AdminJobActions from '@/components/admin/AdminJobActions'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Jobs Management — Admin Dashboard',
}

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs()

  const columns = [
    { key: 'title', header: 'Job Title' },
    { key: 'category_name', header: 'Category' },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdminJob) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          open: 'default',
          in_progress: 'secondary',
          closed: 'outline',
          cancelled: 'destructive',
        }
        return (
          <div className="flex gap-2 items-center">
            <Badge variant={variants[row.status] || 'outline'}>{row.status}</Badge>
            {row.is_suspended && <Badge variant="destructive">Suspended</Badge>}
          </div>
        )
      },
    },
    { key: 'budget_range', header: 'Budget' },
    {
      key: 'created_at',
      header: 'Posted',
      render: (row: AdminJob) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: AdminJob) => <AdminJobActions job={row} />
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Jobs</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Global view of all job posts across the platform.
        </p>
      </div>

      <AdminDataTable
        data={jobs}
        columns={columns}
        emptyMessage="No jobs found"
        emptyDescription="There are currently no job posts in the system."
      />
    </div>
  )
}
