import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

type ProfilePayload = {
  category: string
  specialties: string[]
  skills: string[]
  title: string
  bio: string
  hourlyRateNaira: number
  city: string
  state: string
  phoneNumber: string
  photoUrl: string
  experiences: Array<{
    title: string
    company: string
    city: string
    country: string
    startMonth: string
    startYear: string
    endMonth: string
    endYear: string
    isCurrent: boolean
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    fieldOfStudy: string
    startYear: string
    endYear: string
    description: string
  }>
  languages: Array<{
    language: string
    proficiency: string
  }>
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as ProfilePayload

    let authProvider = ''
    let nextAuthUserId = null
    let supabaseUserId = null

    // 1. Check NextAuth session
    const session = await getServerSession(authOptions)
    if (session?.user) {
      authProvider = 'nextauth'
      nextAuthUserId = (session.user as any).id
    } else {
      // 2. Check Supabase token
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('sb-access-token')?.value
      if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }
      const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken)
      if (userErr || !userData.user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }
      authProvider = 'supabase'
      supabaseUserId = userData.user.id
    }

    // Upsert the main profile
    const profileMatchCol = authProvider === 'nextauth' ? 'nextauth_user_id' : 'supabase_user_id'
    const profileMatchId = authProvider === 'nextauth' ? nextAuthUserId : supabaseUserId

    // First check if profile exists to get ID
    const { data: existingProfile } = await supabaseAdmin
      .from('freelancer_profiles')
      .select('id')
      .eq(profileMatchCol, profileMatchId)
      .maybeSingle()

    let profileId = existingProfile?.id

    if (profileId) {
      const { error: updateErr } = await supabaseAdmin
        .from('freelancer_profiles')
        .update({
          category: payload.category,
          specialties: payload.specialties,
          skills: payload.skills,
          title: payload.title,
          bio: payload.bio,
          hourly_rate_naira: payload.hourlyRateNaira,
          city: payload.city,
          state: payload.state,
          phone_number: payload.phoneNumber,
          photo_url: payload.photoUrl,
          is_published: true,
        })
        .eq('id', profileId)

      if (updateErr) throw new Error(`Profile update failed: ${updateErr.message}`)
    } else {
      const { data: newProfile, error: insertErr } = await supabaseAdmin
        .from('freelancer_profiles')
        .insert({
          auth_provider: authProvider,
          nextauth_user_id: nextAuthUserId,
          supabase_user_id: supabaseUserId,
          category: payload.category,
          specialties: payload.specialties,
          skills: payload.skills,
          title: payload.title,
          bio: payload.bio,
          hourly_rate_naira: payload.hourlyRateNaira,
          city: payload.city,
          state: payload.state,
          phone_number: payload.phoneNumber,
          photo_url: payload.photoUrl,
          is_published: true,
        })
        .select('id')
        .single()

      if (insertErr) throw new Error(`Profile insert failed: ${insertErr.message}`)
      profileId = newProfile.id
    }

    if (!profileId) throw new Error('Could not resolve profile ID')

    // Delete existing related data to easily replace with new payload
    await Promise.all([
      supabaseAdmin.from('freelancer_experiences').delete().eq('profile_id', profileId),
      supabaseAdmin.from('freelancer_education').delete().eq('profile_id', profileId),
      supabaseAdmin.from('freelancer_languages').delete().eq('profile_id', profileId),
    ])

    // Insert experiences
    if (payload.experiences && payload.experiences.length > 0) {
      const expRows = payload.experiences.map((exp) => ({
        profile_id: profileId,
        title: exp.title,
        company: exp.company,
        city: exp.city,
        country: exp.country,
        start_month: exp.startMonth,
        start_year: exp.startYear,
        end_month: exp.endMonth,
        end_year: exp.endYear,
        is_current: exp.isCurrent,
        description: exp.description,
      }))
      const { error: expErr } = await supabaseAdmin.from('freelancer_experiences').insert(expRows)
      if (expErr) throw new Error(`Experiences insert failed: ${expErr.message}`)
    }

    // Insert education
    if (payload.education && payload.education.length > 0) {
      const eduRows = payload.education.map((edu) => ({
        profile_id: profileId,
        school: edu.school,
        degree: edu.degree,
        field_of_study: edu.fieldOfStudy,
        start_year: edu.startYear,
        end_year: edu.endYear,
        description: edu.description,
      }))
      const { error: eduErr } = await supabaseAdmin.from('freelancer_education').insert(eduRows)
      if (eduErr) throw new Error(`Education insert failed: ${eduErr.message}`)
    }

    // Insert languages
    if (payload.languages && payload.languages.length > 0) {
      const langRows = payload.languages.map((lang) => ({
        profile_id: profileId,
        language: lang.language,
        proficiency: lang.proficiency,
      }))
      const { error: langErr } = await supabaseAdmin.from('freelancer_languages').insert(langRows)
      if (langErr) throw new Error(`Languages insert failed: ${langErr.message}`)
    }

    return NextResponse.json({ ok: true, profileId })
  } catch (error: any) {
    console.error('Profile setup submit error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
