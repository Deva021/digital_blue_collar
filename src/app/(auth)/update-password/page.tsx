import { Metadata } from 'next'
import { UpdatePasswordForm } from '@/components/auth/update-password-form'

export const metadata: Metadata = {
  title: 'Update Password',
  description: 'Update your account password',
}

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen bg-neutral-50 items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100 p-6 sm:p-8 md:p-10 space-y-6">
        <div className="mb-6">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Update your password
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Enter your new password below.
          </p>
        </div>
        
        <UpdatePasswordForm />
      </div>
    </div>
  )
}
