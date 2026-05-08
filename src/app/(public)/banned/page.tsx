import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Account Suspended — Digital Blue Collar',
}

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-900">Account Suspended</h1>
          <p className="text-neutral-500">
            Your account has been temporarily or permanently suspended from the platform due to a violation of our terms of service.
          </p>
        </div>
        
        <div className="pt-4 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 mb-4">
            If you believe this is a mistake, please contact support for more information.
          </p>
          <div className="flex flex-col gap-3">
            <a 
              href="mailto:support@example.com" 
              className="inline-flex items-center justify-center h-10 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Contact Support
            </a>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center h-10 px-4 py-2 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
