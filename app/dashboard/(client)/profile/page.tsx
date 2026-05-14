import { ProfileClient } from './profile-client'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatNaira, getClientContext } from '@/lib/dashboard/client-context'

export const dynamic = 'force-dynamic'

function formatDate(value: string | null | undefined) {
  if (!value) return ''
  const dt = new Date(value)
  try {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(dt)
  } catch {
    return dt.toDateString()
  }
}

export default async function ProfilePage() {
  const ctx = await getClientContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Client profile not found</div>
        <div className="mt-1 text-sm text-muted-foreground">Complete client onboarding to access your profile.</div>
      </div>
    )
  }

  const { data: profile } = await supabaseAdmin
    .from('client_profiles')
    .select('full_name, email, company_name')
    .eq('id', ctx.clientProfileId)
    .maybeSingle()

  const { data: payments } = await supabaseAdmin
    .from('payments')
    .select('id, amount_naira, paid_at, job:jobs(title)')
    .eq('client_profile_id', ctx.clientProfileId)
    .order('paid_at', { ascending: false })
    .limit(20)

  const name = profile?.full_name || ctx.sessionName || '—'
  const email = profile?.email || ctx.sessionEmail || '—'
  const companyName = profile?.company_name || '—'

  const paymentRows = (payments ?? []).map((p: any) => ({
    id: String(p.id),
    jobTitle: String(p?.job?.title ?? 'Payment'),
    amount: formatNaira(p.amount_naira),
    date: formatDate(p.paid_at),
  }))

  return <ProfileClient name={name} email={email} companyName={companyName} payments={paymentRows} />
}
