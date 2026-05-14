import { Button } from '@/components/ui/button'

import { MarkCompleteButton } from './mark-complete-button'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatNaira, getClientContext } from '@/lib/dashboard/client-context'

export const dynamic = 'force-dynamic'

type ContractStatus = 'Active' | 'Completed' | 'Cancelled'

function StatusPill({ status }: { status: ContractStatus }) {
  if (status === 'Active') {
    return (
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
        style={{ backgroundColor: 'color-mix(in oklab, var(--kazi-lime) 25%, white)', color: 'black' }}
      >
        Active
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      {status}
    </span>
  )
}

export default async function ContractsPage() {
  const ctx = await getClientContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Client profile not found</div>
        <div className="mt-1 text-sm text-muted-foreground">Complete client onboarding to access contracts.</div>
      </div>
    )
  }

  const { data: jobs } = await supabaseAdmin
    .from('jobs')
    .select('id')
    .eq('client_profile_id', ctx.clientProfileId)

  const jobIds = (jobs ?? []).map((j) => j.id)
  if (!jobIds.length) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Contracts</h1>
        </div>
        <div className="rounded-xl border bg-background p-6">
          <div className="text-sm font-semibold">No contracts yet</div>
          <div className="mt-1 text-sm text-muted-foreground">Contracts appear when you accept a bid.</div>
        </div>
      </div>
    )
  }

  const { data: contracts, error } = await supabaseAdmin
    .from('contracts')
    .select(
      'id, amount_naira, status, started_at, completed_at, job:jobs(title), worker:worker_onboarding(first_name, last_name, job_title)',
    )
    .in('job_id', jobIds)
    .order('started_at', { ascending: false })

  if (error) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Failed to load contracts</div>
        <div className="mt-1 text-sm text-muted-foreground">{error.message}</div>
      </div>
    )
  }

  const CONTRACTS = (contracts ?? []).map((c: any) => {
    const first = String(c?.worker?.first_name ?? '').trim()
    const last = String(c?.worker?.last_name ?? '').trim()
    const workerName = `${first} ${last}`.trim() || 'Worker'
    const jobTitle = String(c?.job?.title ?? '—')

    const status: ContractStatus =
      c.status === 'active' ? 'Active' : c.status === 'completed' ? 'Completed' : 'Cancelled'

    return {
      id: String(c.id),
      workerName,
      jobTitle,
      amount: formatNaira(c.amount_naira),
      status,
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your Contracts</h1>
      </div>

      <div className="space-y-4">
        {CONTRACTS.length ? CONTRACTS.map((c) => (
          <div key={c.id} className="rounded-xl border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-foreground">{c.workerName}</div>
                  <div className="text-sm text-muted-foreground">{c.jobTitle}</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="font-semibold text-foreground">{c.amount}</div>
                <StatusPill status={c.status} />
              </div>
            </div>

            {c.status === 'Active' ? (
              <div className="mt-4">
                <MarkCompleteButton contractId={c.id} />
              </div>
            ) : null}
          </div>
        )) : (
          <div className="rounded-xl border bg-background p-6">
            <div className="text-sm font-semibold">No contracts yet</div>
            <div className="mt-1 text-sm text-muted-foreground">Contracts appear when you accept a bid.</div>
          </div>
        )}
      </div>
    </div>
  )
}
