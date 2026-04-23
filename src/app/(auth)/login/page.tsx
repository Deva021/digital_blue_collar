import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams
  const next = typeof searchParams.next === 'string' ? searchParams.next : '/'

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 sm:p-8 relative lg:h-screen lg:overflow-hidden">
      {/* Optional Home link above the container */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-500 hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
      </div>

      <div className="w-full max-w-4xl min-h-[600px] lg:h-[calc(100vh-4rem)] lg:max-h-[650px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-neutral-100">
        {/* Left side: branding/gradient */}
        <div className="lg:w-5/12 bg-neutral-900 overflow-hidden relative p-12 flex flex-col lg:justify-center">
          <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 via-primary-600/20 to-transparent z-0" />
          <div className="z-10 flex flex-col justify-center h-full">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Welcome back to Blue Collar Market.</h1>
            <p className="text-neutral-400 text-lg">
              Connect directly with verified local tradespeople and secure jobs seamlessly.
            </p>
          </div>
        </div>
        
        {/* Right side: Form */}
        <div className="lg:w-7/12 flex flex-col justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Log in to your account</h2>
              <p className="text-sm text-muted-foreground">
                Enter your email and password below to access your dashboard
              </p>
            </div>
            
            <LoginForm next={next} />

            <div className="space-y-6 pt-4">
              <div className="text-center text-sm">
                <Link href="/forgot-password" className="text-muted-500 hover:text-primary-600 font-medium transition-colors">
                  Forgot your password?
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-muted-foreground font-medium">Or</span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-500">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-bold hover:underline transition-all">
                  Sign up instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
