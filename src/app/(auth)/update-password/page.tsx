import { Metadata } from 'next'
import { UpdatePasswordForm } from '@/components/auth/update-password-form'

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Update your account password',
}

export default function UpdatePasswordPage() {
  return (
    <div className="flex flex-col space-y-6 w-full max-w-md">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Update your password
        </h1>
        <p className="text-sm text-neutral-500">
          Enter your new password below.
        </p>
      </div>
      <UpdatePasswordForm />
    </div>
  )
}
