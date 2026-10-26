import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { getCurrentUser } from '@/app/(auth)/actions'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Shield, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')

  const role = user.user_metadata?.role || user.role
  if (role !== 'admin') {
    redirect('/')
  }

  // Fetch pending owners
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pendingOwners: any[] = []

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('owner_profiles')
        .select('id, owner_status, profiles(full_name)')
        .eq('owner_status', 'pending')
      if (data) pendingOwners = data
    } catch {
      // Offline fallback
    }
  }

  async function approveOwner(formData: FormData) {
    'use server'
    const ownerId = formData.get('ownerId') as string
    if (isSupabaseConfigured()) {
      try {
        const sb = await createClient()
        await sb.from('owner_profiles').update({ owner_status: 'approved' }).eq('id', ownerId)
      } catch {
        // Suppress
      }
    }
    revalidatePath('/admin')
  }

  async function rejectOwner(formData: FormData) {
    'use server'
    const ownerId = formData.get('ownerId') as string
    if (isSupabaseConfigured()) {
      try {
        const sb = await createClient()
        await sb.from('owner_profiles').update({ owner_status: 'rejected' }).eq('id', ownerId)
      } catch {
        // Suppress
      }
    }
    revalidatePath('/admin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8 text-[#0F5C5C]">
        <Shield className="w-8 h-8" />
        <h1 className="text-3xl font-bold font-sans">Admin Dashboard</h1>
      </div>

      <div className="grid gap-8">
        <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold font-sans mb-4">Pending Owner Approvals</h2>
          
          {pendingOwners.length === 0 ? (
            <p className="text-gray-500">No pending owner requests.</p>
          ) : (
            <div className="divide-y">
              {pendingOwners.map((owner) => (
                <div key={owner.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{owner.profiles?.full_name || 'Owner Applicant'}</p>
                    <p className="text-sm text-gray-500">ID: {owner.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveOwner}>
                      <input type="hidden" name="ownerId" value={owner.id} />
                      <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white gap-1">
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                    </form>
                    <form action={rejectOwner}>
                      <input type="hidden" name="ownerId" value={owner.id} />
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 gap-1 border-red-200">
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
