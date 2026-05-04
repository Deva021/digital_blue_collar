'use client'

import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  userEmail: string
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex-shrink-0 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex justify-between">
          <div className="flex-1 flex items-center md:hidden">
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              DBC Admin
            </span>
          </div>
          <div className="hidden md:flex md:items-center md:flex-1">
            <div className="w-full">
              {/* Optional search or breadcrumbs could go here */}
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6 space-x-4">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline-block">{userEmail}</span>
            </div>
            
            <div className="h-6 w-px bg-neutral-200" aria-hidden="true" />
            
            <Link 
              href="/dashboard"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:inline-block"
            >
              Back to User Dashboard
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline-block">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
