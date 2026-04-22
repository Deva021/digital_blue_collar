'use client'

import { useActionState } from 'react'
import { signupAction } from '@/app/(auth)/signup/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState = {
  error: null as string | null
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initialState)

  return (
    <form action={formAction} className="space-y-4 w-full">
       {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {state.error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required disabled={pending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required disabled={pending} />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  )
}
