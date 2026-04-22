'use client'

import { useActionState } from 'react'
import { forgotPasswordAction } from '@/app/(auth)/forgot-password/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState = {
  error: null as string | null,
  success: null as string | null,
}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState)

  return (
    <form action={formAction} className="space-y-4 w-full">
       {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md">
          {state.success}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required disabled={pending} />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Processing...' : 'Send Recovery Email'}
      </Button>
    </form>
  )
}
