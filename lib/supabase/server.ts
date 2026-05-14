import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('Missing env var: SUPABASE_URL')
if (!supabaseAnonKey) throw new Error('Missing env var: SUPABASE_ANON_KEY')

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})
