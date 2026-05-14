import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * Looks up which onboarding profiles exist for a given user.
 * Returns { hasClientProfile, hasWorkerProfile }.
 */
async function getUserRoles(provider: 'nextauth' | 'supabase', userId: string) {
  const col = provider === 'nextauth' ? 'nextauth_user_id' : 'supabase_user_id'

  const [clientRes, workerRes] = await Promise.all([
    supabaseAdmin
      .from('client_profiles')
      .select('id', { count: 'exact', head: true })
      .eq(col, userId),
    supabaseAdmin
      .from('worker_onboarding')
      .select('id', { count: 'exact', head: true })
      .eq(col, userId),
  ])

  return {
    hasClientProfile: (clientRes.count ?? 0) > 0,
    hasWorkerProfile: (workerRes.count ?? 0) > 0,
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    const userId = (session.user as any).id as string
    const roles = await getUserRoles('nextauth', userId)

    return NextResponse.json({
      provider: 'nextauth',
      user: {
        id: userId,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      },
      roles,
    })
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (accessToken) {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken)
    if (!error && data.user) {
      const roles = await getUserRoles('supabase', data.user.id)

      return NextResponse.json({
        provider: 'supabase',
        user: {
          id: data.user.id,
          email: data.user.email ?? null,
        },
        roles,
      })
    }
  }

  return NextResponse.json({ provider: null, user: null, roles: null }, { status: 401 })
}
