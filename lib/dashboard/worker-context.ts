import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export type WorkerAuthProvider = 'nextauth' | 'supabase'

export type WorkerContext = {
  provider: WorkerAuthProvider
  workerOnboardingId: string
  nextauthUserId?: string
  supabaseUserId?: string
  sessionName?: string | null
  sessionEmail?: string | null
}

async function getWorkerOnboardingIdForNextAuthUser(nextauthUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('worker_onboarding')
    .select('id')
    .eq('nextauth_user_id', nextauthUserId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.id ?? null
}

async function getWorkerOnboardingIdForSupabaseUser(supabaseUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('worker_onboarding')
    .select('id')
    .eq('supabase_user_id', supabaseUserId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.id ?? null
}

export async function getWorkerContext(): Promise<WorkerContext | null> {
  // 1) NextAuth session
  const session = await getServerSession(authOptions)
  const nextauthUserId = session?.user ? (session.user as any).id : null
  if (nextauthUserId) {
    const workerOnboardingId = await getWorkerOnboardingIdForNextAuthUser(nextauthUserId)
    if (!workerOnboardingId) return null

    return {
      provider: 'nextauth',
      workerOnboardingId,
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

  const workerOnboardingId = await getWorkerOnboardingIdForSupabaseUser(userData.user.id)
  if (!workerOnboardingId) return null

  return {
    provider: 'supabase',
    workerOnboardingId,
    supabaseUserId: userData.user.id,
    sessionName: userData.user.user_metadata?.full_name ?? null,
    sessionEmail: userData.user.email ?? null,
  }
}


