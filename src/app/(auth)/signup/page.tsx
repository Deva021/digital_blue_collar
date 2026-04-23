import { SignupForm } from '@/components/auth/signup-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 sm:p-8 relative lg:h-screen lg:overflow-hidden">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-500 hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
      </div>

      <div className="w-full max-w-4xl min-h-[600px] lg:h-[calc(100vh-4rem)] lg:max-h-[700px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-neutral-100">
        
        {/* Left side: branding/gradient */}
        <div className="lg:w-5/12 bg-neutral-900 overflow-hidden relative p-12 flex flex-col lg:justify-center order-first lg:order-last">
          <div className="absolute inset-0 bg-linear-to-br from-primary-900/40 via-primary-600/20 to-neutral-900 z-0" />
          <div className="z-10 flex flex-col justify-center h-full">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Join Blue Collar Market today.</h1>
            <p className="text-neutral-400 text-lg">
              Whether you are picking up local jobs or hiring tradespeople, starting is completely free.
            </p>
          </div>
        </div>
        
        {/* Right side: Form */}
        <div className="lg:w-7/12 flex flex-col justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h2>
              <p className="text-sm text-muted-foreground">
                Enter your details below to build your profile and access the marketplace.
              </p>
            </div>
            
            <SignupForm />

            <div className="mt-8 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-muted-foreground font-medium">Or</span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-500">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold hover:underline transition-all">
                  Log in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
