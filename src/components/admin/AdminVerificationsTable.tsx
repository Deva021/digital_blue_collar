'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import AdminConfirmDialog from './AdminConfirmDialog'
import { reviewVerification, type AdminVerification } from '@/lib/services/admin'

interface AdminVerificationsTableProps {
  verifications: AdminVerification[]
}

export default function AdminVerificationsTable({ verifications }: AdminVerificationsTableProps) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [selectedVerification, setSelectedVerification] = React.useState<AdminVerification | null>(null)
  const [decision, setDecision] = React.useState<'verified' | 'rejected' | null>(null)
  const [adminNotes, setAdminNotes] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const handleReviewClick = (verification: AdminVerification, type: 'verified' | 'rejected') => {
    setSelectedVerification(verification)
    setDecision(type)
    setAdminNotes('')
    setError(null)
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!selectedVerification || !decision) return
    if (!adminNotes.trim()) {
      setError('Admin notes are required.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await reviewVerification(
        selectedVerification.id,
        decision,
        adminNotes
      )

      if (result.success) {
        setIsConfirmOpen(false)
        router.refresh()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (e) {
      setError('A network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      verified: 'default',
      rejected: 'destructive',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Worker ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Document</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Admin Notes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {verifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                  No verification requests found.
                </td>
              </tr>
            ) : (
              verifications.map((v) => (
                <tr 
                  key={v.id} 
                  className={`hover:bg-neutral-50 transition-colors ${v.status === 'pending' ? 'border-l-4 border-amber-400' : ''}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 truncate max-w-[120px]">{v.worker_id}</td>
                  <td className="px-4 py-3 text-sm">
                    {getStatusBadge(v.status)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <a
                      href={v.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500 max-w-xs truncate" title={v.admin_notes || undefined}>
                    {v.admin_notes || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {new Date(v.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {v.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReviewClick(v, 'verified')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReviewClick(v, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 font-medium uppercase italic">Decision Final</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
        <p className="text-xs text-neutral-400">
          Showing {verifications.length} request{verifications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {selectedVerification && (
        <AdminConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          isLoading={isLoading}
          title={decision === 'verified' ? 'Approve Verification?' : 'Reject Verification?'}
          description={
            decision === 'verified'
              ? `Are you sure you want to approve verification for worker ${selectedVerification.worker_id}?`
              : `Are you sure you want to reject verification for worker ${selectedVerification.worker_id}?`
          }
          confirmLabel={decision === 'verified' ? 'Approve' : 'Reject'}
          confirmVariant={decision === 'verified' ? 'primary' : 'destructive'}
        >
          <div className="space-y-2">
            <Label htmlFor="adminNotes" className="text-sm font-semibold">
              Admin Notes <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="adminNotes"
              placeholder={decision === 'verified' ? "e.g., Documents verified successfully." : "e.g., Documents are blurry and unreadable."}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          {error && (
            <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
              {error}
            </div>
          )}
        </AdminConfirmDialog>
      )}
    </div>
  )
}
