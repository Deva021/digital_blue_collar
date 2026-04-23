import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/forgot-password'
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/worker') || request.nextUrl.pathname.startsWith('/customer') || request.nextUrl.pathname.startsWith('/onboarding')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = request.nextUrl.searchParams.get('next') ?? '/'
    return NextResponse.redirect(url)
  }

  if (user && isProtectedRoute) {
    // Only enforce worker profiles on worker-specific pages for now
    const isWorkerRoute = request.nextUrl.pathname.startsWith('/worker') || request.nextUrl.pathname.startsWith('/dashboard')
    const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding/worker')

    if (isWorkerRoute && !isOnboardingRoute) {
      const { data: profile } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding/worker'
        return NextResponse.redirect(url)
      }
    }
  }


  return supabaseResponse
}
