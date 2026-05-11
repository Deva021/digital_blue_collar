'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { updatePasswordAction } from '@/app/(auth)/update-password/actions'

export function UpdatePasswordForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(null)
    
    startTransition(async () => {
      const result = await updatePasswordAction(null, formData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setSuccess(result.success)
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      }
    })
  }

  return (
    <div className="grid gap-6">
      <form action={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isPending || !!success}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isPending || !!success}
              required
            />
          </div>
          
          {error && (
            <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}

          <Button disabled={isPending || !!success}>
            {isPending && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}
