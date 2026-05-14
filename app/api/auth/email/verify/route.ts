import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { token_hash?: string; type?: string }
    | null

  const token_hash = body?.token_hash
  const type = (body?.type ?? 'magiclink') as
    | 'magiclink'
    | 'signup'
    | 'invite'
    | 'recovery'
    | 'email_change'

  if (!token_hash) {
    return NextResponse.json({ error: 'token_hash is required' }, { status: 400 })
  }

  const { data, error } = await supabaseServer.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const session = data.session
  if (!session) {
    return NextResponse.json({ error: 'No session returned' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const secure = process.env.NODE_ENV === 'production'

  cookieStore.set('sb-access-token', session.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: session.expires_in,
  })

  cookieStore.set('sb-refresh-token', session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    // Supabase refresh tokens are long-lived; keep 30 days as a sane default.
    maxAge: 60 * 60 * 24 * 30,
  })

  return NextResponse.json({ ok: true, user: data.user })
}
