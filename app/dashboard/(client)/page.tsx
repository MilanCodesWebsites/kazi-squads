import Link from 'next/link'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  Briefcase01Icon,
  CheckmarkCircle01Icon,
  File01Icon,
  Money01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@/components/ui/button'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatNaira, formatRelativeTime, getClientContext } from '@/lib/dashboard/client-context'

export const dynamic = 'force-dynamic'

function activityIcon(type: string) {
  switch (type) {
    case 'job_posted':
      return Briefcase01Icon
    case 'payment_confirmed':
      return Money01Icon
    case 'contract_completed':
      return CheckmarkCircle01Icon
    case 'bid_received':
      return File01Icon
    default:
      return File01Icon
  }
}

export default async function DashboardHomePage() {
  const ctx = await getClientContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Client profile not found</div>
        <div className="mt-1 text-sm text-muted-foreground">Complete client onboarding to access the dashboard.</div>
        <div className="mt-4">
          <Button asChild className="rounded-xl shadow-none" style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}>
            <Link href="/dashboard/onboarding/client">Go to onboarding</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { data: profile } = await supabaseAdmin
    .from('client_profiles')
    .select('full_name, company_name')
    .eq('id', ctx.clientProfileId)
    .maybeSingle()

  const { data: jobs } = await supabaseAdmin
    .from('jobs')
    .select('id, status')
    .eq('client_profile_id', ctx.clientProfileId)

  const jobIds = (jobs ?? []).map((j) => j.id)
  const activeJobsCount = (jobs ?? []).filter((j) => j.status === 'open').length

  const openBidsCount = jobIds.length
    ? (
        await supabaseAdmin
          .from('job_bids')
          .select('id', { count: 'exact', head: true })
          .in('job_id', jobIds)
          .eq('status', 'open')
      ).count ?? 0
    : 0

  const activeContractsCount = jobIds.length
    ? (
        await supabaseAdmin
          .from('contracts')
          .select('id', { count: 'exact', head: true })
          .in('job_id', jobIds)
          .eq('status', 'active')
      ).count ?? 0
    : 0

  const { data: payments } = await supabaseAdmin
    .from('payments')
    .select('amount_naira, status')
    .eq('client_profile_id', ctx.clientProfileId)

  const totalSpent = (payments ?? [])
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + (p.amount_naira ?? 0), 0)

  const { data: activity } = await supabaseAdmin
    .from('client_activity')
    .select('id, type, message, created_at')
    .eq('client_profile_id', ctx.clientProfileId)
    .order('created_at', { ascending: false })
    .limit(8)

  const name = profile?.full_name || ctx.sessionName || 'there'
  const STATS = [
    { label: 'Active Jobs', value: String(activeJobsCount) },
    { label: 'Open Bids', value: String(openBidsCount) },
    { label: 'Active Contracts', value: String(activeContractsCount) },
    { label: 'Total Spent', value: formatNaira(totalSpent) },
  ]

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Good morning, {name}.</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">Here’s what’s happening with your jobs.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-background p-4">
              <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            asChild
            className="w-full rounded-xl shadow-none"
            style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
          >
            <Link href="/dashboard/jobs/new">Post a Job →</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
        <div className="mt-4 divide-y rounded-xl border bg-background">
          {(activity ?? []).length ? (
            (activity ?? []).map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-4">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border bg-background" aria-hidden="true">
                <HugeiconsIcon icon={activityIcon(item.type)} className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-foreground">{item.message}</div>
              </div>
              <div className="text-xs text-muted-foreground">{formatRelativeTime(item.created_at)}</div>
            </div>
            ))
          ) : (
            <div className="p-4 text-sm text-muted-foreground">No activity yet.</div>
          )}
        </div>
      </section>
    </div>
  )
}
