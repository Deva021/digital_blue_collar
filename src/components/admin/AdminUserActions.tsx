'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AdminConfirmDialog from './AdminConfirmDialog'
import { banUser, unbanUser, type AdminUser } from '@/lib/services/admin'

interface AdminUserActionsProps {
  user: AdminUser
}

export default function AdminUserActions({ user }: AdminUserActionsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [duration, setDuration] = React.useState<string>('permanent')
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
      if (user.is_banned) {
        result = await unbanUser(user.id)
      } else {
        const days = duration === 'permanent' ? null : parseInt(duration, 10)
        result = await banUser(user.id, days, reason)
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
        variant={user.is_banned ? 'outline' : 'secondary'}
        size="sm"
        onClick={handleToggleClick}
      >
        {user.is_banned ? 'Unban' : 'Ban'}
      </Button>

      <AdminConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        title={user.is_banned ? 'Unban User?' : 'Ban User?'}
        description={
          user.is_banned
            ? `Are you sure you want to unban ${user.email}? They will regain access to the platform.`
            : `Are you sure you want to ban ${user.email}? They will be blocked from accessing the platform.`
        }
        confirmLabel={user.is_banned ? 'Unban' : 'Ban'}
        confirmVariant={user.is_banned ? 'primary' : 'destructive'}
      >
        {!user.is_banned && (
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">Ban Duration</label>
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-neutral-300 rounded-md text-sm"
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
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
