import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-neutral-50 items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100 p-6 sm:p-8 md:p-10 space-y-6">
        <div className="mb-6">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Reset password</h2>
          <p className="text-sm text-muted-500 mt-2">
            No worries! Just enter your email and we'll send you a recovery link immediately.
          </p>
        </div>
        
        <ForgotPasswordForm />
        
        <div className="pt-4 flex justify-center text-sm font-medium">
          <Link href="/login" className="flex items-center text-muted-500 hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to log in
          </Link>
        </div>
      </div>
    </div>
  )
}
