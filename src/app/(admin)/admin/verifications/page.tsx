import { getAdminVerifications } from '@/lib/services/admin'
import AdminVerificationsTable from '@/components/admin/AdminVerificationsTable'

export const metadata = {
  title: 'Verification Queue — Admin Dashboard',
}

export default async function AdminVerificationsPage() {
  const verifications = await getAdminVerifications()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Verification Queue</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review and manage worker identity verification requests.
        </p>
      </div>

      <AdminVerificationsTable verifications={verifications} />
    </div>
  )
}
