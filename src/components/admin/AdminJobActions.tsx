'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AdminConfirmDialog from './AdminConfirmDialog'
import { suspendJob, unsuspendJob, type AdminJob } from '@/lib/services/admin'

interface AdminJobActionsProps {
  job: AdminJob
}

export default function AdminJobActions({ job }: AdminJobActionsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [reason, setReason] = React.useState('')
  
  const router = useRouter()

  const handleToggleClick = () => {
    setError(null)
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let result
      if (job.is_suspended) {
        result = await unsuspendJob(job.id)
      } else {
        result = await suspendJob(job.id, reason)
      }

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

  return (
    <>
      <Button
        variant={job.is_suspended ? 'outline' : 'secondary'}
        size="sm"
        onClick={handleToggleClick}
      >
        {job.is_suspended ? 'Unsuspend' : 'Suspend'}
      </Button>

      <AdminConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        title={job.is_suspended ? 'Unsuspend Job?' : 'Suspend Job?'}
        description={
          job.is_suspended
            ? `Are you sure you want to unsuspend "${job.title}"? It will become visible again.`
            : `Are you sure you want to suspend "${job.title}"? It will be hidden from the platform.`
        }
        confirmLabel={job.is_suspended ? 'Unsuspend' : 'Suspend'}
        confirmVariant={job.is_suspended ? 'primary' : 'destructive'}
      >
        {!job.is_suspended && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Reason</label>
              <textarea 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                placeholder="Violation of terms..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm min-h-[80px]"
                required
              />
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
            {error}
          </div>
        )}
      </AdminConfirmDialog>
    </>
  )
}
