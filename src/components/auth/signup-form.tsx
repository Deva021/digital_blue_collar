'use client'

import { useActionState } from 'react'
import { signupAction } from '@/app/(auth)/signup/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState = {
  error: null as string | null,
  success: null as string | null
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initialState)

  if (state?.success) {
    return (
      <div className="p-4 text-center text-green-800 bg-green-50 rounded-lg border border-green-200">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-lg mb-2">Check your inbox</h3>
        <p className="text-sm">{state.success}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4 w-full">
       {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
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
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={pending} />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Building your profile...' : 'Sign Up Free'}
      </Button>
    </form>
  )
}
