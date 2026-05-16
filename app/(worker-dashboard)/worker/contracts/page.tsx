import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { formatNaira } from '@/lib/utils'
import { DeliverButton } from './deliver-button'

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

  if (status === 'Completed') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs font-medium text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3 w-3" style={{ color: 'var(--kazi-lime)' }} />
        Completed
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      {status}
    </span>
  )
}

export default async function WorkerContractsPage() {
  const ctx = await getWorkerContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Freelancer profile not found</div>
      </div>
    )
  }

  const { data: contracts, error } = await supabaseAdmin
    .from('contracts')
    .select(`
      id, 
      amount_naira, 
      status, 
      started_at, 
      completed_at, 
      job:jobs(
        title,
        client_profile:client_profiles(company_name)
      )
    `)
    .eq('worker_onboarding_id', ctx.workerOnboardingId)
    .order('started_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Your Contracts</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">Manage your active and past work engagements.</p>
      </div>

      <div className="space-y-4">
        {contracts && contracts.length > 0 ? contracts.map((c: any) => {
          const jobTitle = c.job?.title || 'Unknown Job'
          const clientName = c.job?.client_profile?.company_name || 'Unknown Client'
          const amount = formatNaira(c.amount_naira)
          const status = (c.status === 'active' ? 'Active' : c.status === 'completed' ? 'Completed' : 'Cancelled') as ContractStatus

          return (
            <div key={c.id} className="rounded-xl border border-[#e5e5e5] bg-background p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground" aria-hidden="true">
                    {clientName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-foreground text-lg">{clientName}</div>
                    <div className="text-sm font-medium text-muted-foreground">{jobTitle}</div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2">
                  <div className="font-bold text-xl text-foreground sm:text-right">{amount}</div>
                  <StatusPill status={status} />
                </div>
              </div>

              {status === 'Active' ? (
                <div className="mt-6 border-t border-[#e5e5e5] pt-4">
                  <p className="mb-4 text-sm font-medium text-foreground">Payment confirmed, get to work.</p>
                  <DeliverButton contractId={c.id} />
                </div>
              ) : status === 'Completed' ? (
                <div className="mt-6 border-t border-[#e5e5e5] pt-4">
                  <p className="text-sm font-medium text-foreground">{amount} paid to your account.</p>
                </div>
              ) : null}
            </div>
          )
        }) : (
          <div className="rounded-xl border border-[#e5e5e5] bg-background p-6 text-center">
            <div className="text-lg font-bold">No contracts yet</div>
            <div className="mt-2 text-sm text-muted-foreground">When clients hire you, the active contracts will appear here.</div>
          </div>
        )}
      </div>
    </div>
  )
}
