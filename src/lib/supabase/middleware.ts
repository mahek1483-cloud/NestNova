import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from './server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  let user: { id: string; role?: string; user_metadata?: { role?: string; full_name?: string } } | null = null
  let role: string | undefined = undefined

  // 1. Try real Supabase auth if properly configured
  if (isSupabaseConfigured()) {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'

      const supabase = createServerClient(
        url,
        key,
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

      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        user = data.user
        try {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          role = profile?.role || data.user.user_metadata?.role || 'student'
        } catch {
          role = data.user.user_metadata?.role || 'student'
        }
      }
    } catch {
      // Supabase server connection refused or unreachable; continue to demo session check
    }
  }

  // 2. If not logged in via Supabase, check for demo session cookie
  if (!user) {
    const demoCookie = request.cookies.get('nestnova_demo_user')?.value
    if (demoCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(demoCookie))
        if (parsed?.id) {
          user = parsed
          role = parsed.role || parsed.user_metadata?.role || 'student'
        }
      } catch {
        // Invalid demo cookie
      }
    }
  }

  const path = request.nextUrl.pathname
  const redirectUrl = request.nextUrl.clone()

  if (user) {
    // Logged in user visiting auth pages -> redirect to appropriate dashboard
    if (path === '/login' || path === '/signup') {
      redirectUrl.pathname = role === 'owner' ? '/owner' : '/student'
      return NextResponse.redirect(redirectUrl)
    }

    // Role-aware route protection
    if (role === 'student' && (path.startsWith('/owner') || path.startsWith('/admin'))) {
      redirectUrl.pathname = '/student'
      return NextResponse.redirect(redirectUrl)
    }

    if (role === 'owner' && path.startsWith('/admin')) {
      redirectUrl.pathname = '/owner'
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // Unauthenticated user trying to access protected routes
    if (path.startsWith('/owner') || path.startsWith('/admin') || path.startsWith('/my-requests')) {
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}
