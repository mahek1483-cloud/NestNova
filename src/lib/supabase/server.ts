import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return Boolean(
    url &&
    key &&
    key !== 'YOUR_PUBLISHABLE_KEY' &&
    key.trim().length > 0 &&
    (url.startsWith('http://') || url.startsWith('https://'))
  )
}

export async function getServerDemoUser() {
  const cookieStore = await cookies()
  const demoCookie = cookieStore.get('nestnova_demo_user')?.value
  if (!demoCookie) return null
  try {
    return JSON.parse(decodeURIComponent(demoCookie))
  } catch {
    return null
  }
}

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}
