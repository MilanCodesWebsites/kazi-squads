import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const origin = req.headers.get('origin')
  if (!origin) {
    return NextResponse.json({ error: 'Missing Origin header' }, { status: 400 })
  }

  const body = (await req.json().catch(() => null)) as
    | { email?: string; role?: string }
    | null

  const email = body?.email?.trim()
  const role = body?.role?.trim()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const redirectTo = new URL('/auth/callback', origin)
  if (role) redirectTo.searchParams.set('role', role)

  const { error } = await supabaseServer.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo.toString(),
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
