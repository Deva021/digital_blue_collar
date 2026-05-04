import { getAdminVerifications, type AdminVerification } from '@/lib/services/admin'
import AdminDataTable from '@/components/admin/AdminDataTable'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Verification Queue — Admin Dashboard',
}

export default async function AdminVerificationsPage() {
  const verifications = await getAdminVerifications()

  const columns = [
    { key: 'worker_id', header: 'Worker ID' },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdminVerification) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          pending: 'secondary',
          verified: 'default',
          rejected: 'destructive',
        }
        return <Badge variant={variants[row.status] || 'outline'}>{row.status}</Badge>
      },
    },
    {
      key: 'document_url',
      header: 'Document',
      render: (row: AdminVerification) => (
        <a
          href={row.document_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Document
        </a>
      ),
    },
    {
      key: 'created_at',
      header: 'Submitted',
      render: (row: AdminVerification) => new Date(row.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Verification Queue</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review and manage worker identity verification requests.
        </p>
      </div>

      <AdminDataTable
        data={verifications}
        columns={columns}
        emptyMessage="Queue is empty"
        emptyDescription="There are no pending verification requests to review."
      />
    </div>
  )
}
