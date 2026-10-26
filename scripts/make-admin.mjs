import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need this for admin overrides

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function makeAdmin(email) {
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()
  
  if (userError) {
    console.error('Error fetching users:', userError)
    return
  }
  
  const user = users.users.find(u => u.email === email)
  
  if (!user) {
    console.error(`User with email ${email} not found.`)
    return
  }

  // Update public.profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id)

  if (profileError) {
    console.error('Error updating profile role:', profileError)
    return
  }

  // Also update user metadata for good measure
  await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: { role: 'admin' }
  })

  console.log(`Successfully made ${email} an admin.`)
}

const targetEmail = process.argv[2]
if (!targetEmail) {
  console.error('Please provide an email: node scripts/make-admin.mjs admin@example.com')
  process.exit(1)
}

makeAdmin(targetEmail)
