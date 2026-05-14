import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

type Payload = {
  title: string
  category: string
  description: string

  budgetMode: 'fixed' | 'range'
  budgetFixedNaira?: number | null
  budgetMinNaira?: number | null
  budgetMaxNaira?: number | null
  openToNegotiation?: boolean

  locationPreference: 'remote' | 'onsite' | 'both'
  city?: string | null

  dueDate?: string | null
  asap?: boolean

  createdWithAi?: boolean
  aiPrompt?: string | null
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
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

export async function POST(req: Request) {
  const payload = (await req.json().catch(() => null)) as Payload | null
  if (!payload) return badRequest('Invalid JSON')

  if (!payload.title?.trim()) return badRequest('title is required')
  if (!payload.category?.trim()) return badRequest('category is required')
  if (!payload.description?.trim()) return badRequest('description is required')

  if (payload.budgetMode !== 'fixed' && payload.budgetMode !== 'range') {
    return badRequest('budgetMode must be fixed or range')
  }

  if (payload.locationPreference !== 'remote' && payload.locationPreference !== 'onsite' && payload.locationPreference !== 'both') {
    return badRequest('locationPreference is invalid')
  }

  const session = await getServerSession(authOptions)
  if (session?.user) {
    const nextauthUserId = session.user.id
    const clientProfileId = await getClientProfileIdForNextAuthUser(nextauthUserId)
    if (!clientProfileId) {
      return NextResponse.json(
        { error: 'Client profile not found. Complete client onboarding first.' },
        { status: 409 },
      )
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert({
        client_profile_id: clientProfileId,
        title: payload.title.trim(),
        category: payload.category.trim(),
        description: payload.description.trim(),
        budget_mode: payload.budgetMode,
        budget_fixed_naira: payload.budgetMode === 'fixed' ? payload.budgetFixedNaira ?? null : null,
        budget_min_naira: payload.budgetMode === 'range' ? payload.budgetMinNaira ?? null : null,
        budget_max_naira: payload.budgetMode === 'range' ? payload.budgetMaxNaira ?? null : null,
        open_to_negotiation: Boolean(payload.openToNegotiation),
        location_preference: payload.locationPreference,
        city: payload.locationPreference === 'remote' ? null : (payload.city?.trim() || null),
        due_date: payload.dueDate ?? null,
        asap: Boolean(payload.asap),
        created_with_ai: Boolean(payload.createdWithAi),
        ai_prompt: payload.aiPrompt ?? null,
      })
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin.from('client_activity').insert({
      client_profile_id: clientProfileId,
      type: 'job_posted',
      message: `Job posted: ${payload.title.trim()}`,
    })

    return NextResponse.json({ ok: true, jobId: data.id })
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

  const clientProfileId = await getClientProfileIdForSupabaseUser(userData.user.id)
  if (!clientProfileId) {
    return NextResponse.json(
      { error: 'Client profile not found. Complete client onboarding first.' },
      { status: 409 },
    )
  }

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .insert({
      client_profile_id: clientProfileId,
      title: payload.title.trim(),
      category: payload.category.trim(),
      description: payload.description.trim(),
      budget_mode: payload.budgetMode,
      budget_fixed_naira: payload.budgetMode === 'fixed' ? payload.budgetFixedNaira ?? null : null,
      budget_min_naira: payload.budgetMode === 'range' ? payload.budgetMinNaira ?? null : null,
      budget_max_naira: payload.budgetMode === 'range' ? payload.budgetMaxNaira ?? null : null,
      open_to_negotiation: Boolean(payload.openToNegotiation),
      location_preference: payload.locationPreference,
      city: payload.locationPreference === 'remote' ? null : (payload.city?.trim() || null),
      due_date: payload.dueDate ?? null,
      asap: Boolean(payload.asap),
      created_with_ai: Boolean(payload.createdWithAi),
      ai_prompt: payload.aiPrompt ?? null,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabaseAdmin.from('client_activity').insert({
    client_profile_id: clientProfileId,
    type: 'job_posted',
    message: `Job posted: ${payload.title.trim()}`,
  })

  return NextResponse.json({ ok: true, jobId: data.id })
}
