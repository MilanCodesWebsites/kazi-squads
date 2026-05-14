import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

type Payload = {
  firstName?: string | null
  lastName?: string | null
  jobTitle: string
  skills: string[]
  experience: string
  state: string
  city: string
  workPreference: string
  availability: string
  minimumRateNaira: number
  bio: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountName?: string | null
  role?: string | null
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(req: Request) {
  const payload = (await req.json().catch(() => null)) as Payload | null
  if (!payload) return badRequest('Invalid JSON')

  if (!payload.jobTitle?.trim()) return badRequest('jobTitle is required')
  if (!payload.skills || payload.skills.length < 1) return badRequest('skills is required')
  if (!payload.experience) return badRequest('experience is required')
  if (!payload.state) return badRequest('state is required')
  if (!payload.city?.trim()) return badRequest('city is required')
  if (!payload.workPreference) return badRequest('workPreference is required')
  if (!payload.availability) return badRequest('availability is required')
  if (!Number.isFinite(payload.minimumRateNaira)) return badRequest('minimumRateNaira is required')
  if (!payload.bio?.trim()) return badRequest('bio is required')
  if (!payload.bankName) return badRequest('bankName is required')
  if (!payload.bankCode) return badRequest('bankCode is required')
  if (!payload.accountNumber) return badRequest('accountNumber is required')

  const session = await getServerSession(authOptions)
  if (session?.user) {
    const nextauthUserId = session.user.id
    const { error } = await supabaseAdmin.from('worker_onboarding').insert({
      auth_provider: 'nextauth',
      nextauth_user_id: nextauthUserId,
      first_name: payload.firstName ?? null,
      last_name: payload.lastName ?? null,
      job_title: payload.jobTitle,
      skills: payload.skills,
      experience: payload.experience,
      state: payload.state,
      city: payload.city,
      work_preference: payload.workPreference,
      availability: payload.availability,
      minimum_rate_naira: payload.minimumRateNaira,
      bio: payload.bio,
      bank_name: payload.bankName,
      bank_code: payload.bankCode,
      account_number: payload.accountNumber,
      account_name: payload.accountName ?? null,
      role: payload.role ?? null,
    })

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

  const { error } = await supabaseAdmin.from('worker_onboarding').insert({
    auth_provider: 'supabase',
    supabase_user_id: userData.user.id,
    first_name: payload.firstName ?? null,
    last_name: payload.lastName ?? null,
    job_title: payload.jobTitle,
    skills: payload.skills,
    experience: payload.experience,
    state: payload.state,
    city: payload.city,
    work_preference: payload.workPreference,
    availability: payload.availability,
    minimum_rate_naira: payload.minimumRateNaira,
    bio: payload.bio,
    bank_name: payload.bankName,
    bank_code: payload.bankCode,
    account_number: payload.accountNumber,
    account_name: payload.accountName ?? null,
    role: payload.role ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
