'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient, isSupabaseConfigured, getServerDemoUser } from '@/lib/supabase/server'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'owner']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
})

export interface AuthResponse {
  ok: boolean
  error?: string
  message?: string
  role?: string
  isDemo?: boolean
}

export async function login(formData: FormData): Promise<AuthResponse> {
  try {
    const rawEmail = formData.get('email') as string
    const email = rawEmail?.trim().toLowerCase()
    const password = formData.get('password') as string

    if (!email) {
      return { ok: false, error: 'Please enter your email address' }
    }

    if (!password) {
      return { ok: false, error: 'Please enter your password' }
    }

    // Determine default role for demo accounts
    let demoRole = 'student'
    if (email.includes('owner') || email.includes('hostel') || email.includes('mess')) {
      demoRole = 'owner'
    } else if (email.includes('admin')) {
      demoRole = 'admin'
    }

    // 1. If Supabase is properly configured, attempt real authentication
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (!error && data?.user) {
          // Clear any legacy demo cookie
          const cookieStore = await cookies()
          cookieStore.delete('nestnova_demo_user')

          let role = data.user.user_metadata?.role || 'student'
          try {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
            if (profile?.role) role = profile.role
          } catch {
            // Profile read fallback
          }

          revalidatePath('/', 'layout')
          return { ok: true, role, isDemo: false }
        }

        // Handle specific Supabase Auth errors
        if (error) {
          const msg = error.message.toLowerCase()
          if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
            return { ok: false, error: 'Invalid email or password. Please verify your credentials.' }
          }
          if (msg.includes('email not confirmed')) {
            return { ok: false, error: 'Your email address is not confirmed yet. Please check your inbox for the verification email.' }
          }
          if (!msg.includes('fetch failed')) {
            return { ok: false, error: error.message }
          }
          // If fetch failed, fall through to demo handling below
        }
      } catch (sbErr: unknown) {
        const msg = sbErr instanceof Error ? sbErr.message : ''
        if (!msg.includes('fetch failed') && !msg.includes('ECONNREFUSED')) {
          return { ok: false, error: msg || 'Authentication error' }
        }
      }
    }

    // 2. Safe Fallback / Demo Authentication Mode
    // Allows previewing and testing when Supabase backend is pending configuration or offline
    const cookieStore = await cookies()
    const namePart = email.split('@')[0]
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)

    const demoUser = {
      id: email === 'owner@demo.com' ? '22222222-2222-2222-2222-222222222222' : '11111111-1111-1111-1111-111111111111',
      email: email,
      role: demoRole,
      user_metadata: {
        full_name: `${formattedName} (Demo)`,
        role: demoRole,
      },
      is_demo: true,
    }

    cookieStore.set('nestnova_demo_user', JSON.stringify(demoUser), {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    revalidatePath('/', 'layout')
    return {
      ok: true,
      role: demoRole,
      isDemo: true,
      message: 'Signed in with demo session (Supabase connection pending configuration)',
    }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'An unexpected error occurred during login' }
  }
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  try {
    const data = Object.fromEntries(formData.entries())
    const validated = signupSchema.safeParse(data)

    if (!validated.success) {
      return { ok: false, error: validated.error.issues[0]?.message || 'Invalid input data' }
    }

    const { email, password, role, fullName } = validated.data

    // 1. If Supabase is configured, register with Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient()
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        })

        if (!error) {
          return {
            ok: true,
            isDemo: false,
            message: 'Account registered successfully! Please check your email to verify your address.',
          }
        }

        if (!error.message.includes('fetch failed')) {
          return { ok: false, error: error.message }
        }
      } catch (sbErr: unknown) {
        const msg = sbErr instanceof Error ? sbErr.message : ''
        if (!msg.includes('fetch failed') && !msg.includes('ECONNREFUSED')) {
          return { ok: false, error: msg }
        }
      }
    }

    // 2. Safe Fallback / Demo Signup
    const cookieStore = await cookies()
    const demoUser = {
      id: 'demo-' + Math.random().toString(36).substring(2, 9),
      email: email,
      role: role,
      user_metadata: {
        full_name: fullName,
        role: role,
      },
      is_demo: true,
    }

    cookieStore.set('nestnova_demo_user', JSON.stringify(demoUser), {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    revalidatePath('/', 'layout')
    return {
      ok: true,
      role: role,
      isDemo: true,
      message: 'Account created in demo mode! You are now signed in.',
    }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'An unexpected error occurred during signup' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('nestnova_demo_user')

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut()
    } catch {
      // Ignore network errors on logout
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getCurrentUser() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      if (data?.user) return data.user
    } catch {
      // Fallback
    }
  }
  return await getServerDemoUser()
}
