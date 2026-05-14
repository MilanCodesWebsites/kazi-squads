import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export type ClientAuthProvider = 'nextauth' | 'supabase'

export type ClientContext = {
  provider: ClientAuthProvider
  clientProfileId: string
  nextauthUserId?: string
  supabaseUserId?: string
  sessionName?: string | null
  sessionEmail?: string | null
}

async function getClientProfileIdForNextAuthUser(nextauthUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('client_profiles')
    .select('id')
    .eq('nextauth_user_id', nextauthUserId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.id ?? null
}

async function getClientProfileIdForSupabaseUser(supabaseUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('client_profiles')
    .select('id')
    .eq('supabase_user_id', supabaseUserId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.id ?? null
}

export async function getClientContext(): Promise<ClientContext | null> {
  // 1) NextAuth session
  const session = await getServerSession(authOptions)
  const nextauthUserId = session?.user ? (session.user as any).id : null
  if (nextauthUserId) {
    const clientProfileId = await getClientProfileIdForNextAuthUser(nextauthUserId)
    if (!clientProfileId) return null

    return {
      provider: 'nextauth',
      clientProfileId,
      nextauthUserId,
      sessionName: session.user?.name ?? null,
      sessionEmail: session.user?.email ?? null,
    }
  }

  // 2) Supabase auth cookies (fallback)
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  if (!accessToken) return null

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken)
  if (userErr || !userData.user) return null

  const clientProfileId = await getClientProfileIdForSupabaseUser(userData.user.id)
  if (!clientProfileId) return null

  return {
    provider: 'supabase',
    clientProfileId,
    supabaseUserId: userData.user.id,
    sessionName: userData.user.user_metadata?.full_name ?? null,
    sessionEmail: userData.user.email ?? null,
  }
}

export function formatNaira(value: number | null | undefined) {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : null
  if (amount === null) return '₦0'

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `₦${amount.toLocaleString()}`
  }
}

export function formatRelativeTime(date: string | Date | null | undefined) {
  if (!date) return ''
  const dt = typeof date === 'string' ? new Date(date) : date
  const diffMs = Date.now() - dt.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))

  if (!Number.isFinite(diffMin)) return ''
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`

  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`

  const diffWk = Math.floor(diffDay / 7)
  return `${diffWk}w ago`
}
