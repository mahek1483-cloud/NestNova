import { createBrowserClient } from '@supabase/ssr'

/**
 * Checks if Supabase credentials have been properly configured
 * (i.e. not empty and not the placeholder 'YOUR_PUBLISHABLE_KEY')
 */
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

/**
 * Retrieves the active demo user session from document cookies if present
 */
export function getClientDemoUser() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )nestnova_demo_user=([^;]*)/)
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return null
  }
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'
  return createBrowserClient(url, key)
}
