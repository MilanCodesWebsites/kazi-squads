import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

type Payload = {
  companyName: string
  website?: string | null
  orgSize?: string | null
  fullName?: string | null
  email?: string | null
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(req: Request) {
  const payload = (await req.json().catch(() => null)) as Payload | null
  if (!payload) return badRequest('Invalid JSON')

  if (!payload.companyName?.trim()) return badRequest('companyName is required')

  const session = await getServerSession(authOptions)
  if (session?.user) {
    const nextauthUserId = session.user.id
    const { error } = await supabaseAdmin
      .from('client_profiles')
      .upsert(
        {
          auth_provider: 'nextauth',
          nextauth_user_id: nextauthUserId,
          full_name: payload.fullName ?? session.user.name ?? null,
          email: payload.email ?? session.user.email ?? null,
          company_name: payload.companyName.trim(),
          website: payload.website ?? null,
          org_size: payload.orgSize ?? null,
        },
        { onConflict: 'nextauth_user_id' },
      )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken)
  if (userErr || !userData.user) {
    return NextResponse.json({ error: userErr?.message ?? 'Not authenticated' }, { status: 401 })
  }

  const { error } = await supabaseAdmin
    .from('client_profiles')
    .upsert(
      {
        auth_provider: 'supabase',
        supabase_user_id: userData.user.id,
        full_name: payload.fullName ?? userData.user.user_metadata?.full_name ?? null,
        email: payload.email ?? userData.user.email ?? null,
        company_name: payload.companyName.trim(),
        website: payload.website ?? null,
        org_size: payload.orgSize ?? null,
      },
      { onConflict: 'supabase_user_id' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
