import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getClientContext, formatNaira, formatRelativeTime } from '@/lib/dashboard/client-context'
import { notFound } from 'next/navigation'
import { AcceptButton } from './accept-button'

export const dynamic = 'force-dynamic'

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const ctx = await getClientContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Client profile not found</div>
      </div>
    )
  }

  // Fetch the job
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .eq('client_profile_id', ctx.clientProfileId)
    .single()

  if (jobError || !job) {
    notFound()
  }

  // Fetch bids with worker details
  const { data: bids } = await supabaseAdmin
    .from('job_bids')
    .select(`
      id,
      worker_onboarding_id,
      bid_amount_naira,
      message,
      status,
      created_at,
      worker_onboarding (
        first_name,
        last_name,
        job_title
      )
    `)
    .eq('job_id', params.id)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <Link href="/dashboard/jobs">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{job.title}</h1>
          <p className="text-sm text-muted-foreground">
            {formatRelativeTime(job.posted_at)} • {bids?.length || 0} applications
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Applications</h2>
        {bids && bids.length > 0 ? bids.map((bid: any) => {
          const workerName = `${bid.worker_onboarding?.first_name || ''} ${bid.worker_onboarding?.last_name || ''}`.trim() || 'Freelancer'
          const workerTitle = bid.worker_onboarding?.job_title || 'Worker'
          
          return (
            <div key={bid.id} className="rounded-xl border border-[#e5e5e5] bg-background p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground uppercase">
                    {workerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{workerName}</h3>
                    <p className="text-sm text-muted-foreground">{workerTitle}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <div className="font-bold text-lg text-[#AAFF00] drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" style={{ color: 'var(--kazi-lime)' }}>
                    {formatNaira(bid.bid_amount_naira)}
                  </div>
                  {bid.status === 'open' && job.status === 'open' && (
                    <AcceptButton 
                      jobId={job.id}
                      workerId={bid.worker_onboarding_id}
                      amount={bid.bid_amount_naira}
                      clientEmail={ctx.sessionEmail || 'client@kazi.com'}
                      jobTitle={job.title}
                      clientId={ctx.clientProfileId}
                    />
                  )}
                  {bid.status === 'accepted' && (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-black" style={{ backgroundColor: 'var(--kazi-lime)' }}>
                      Accepted
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#e5e5e5] pt-4 mt-4">
                <h4 className="font-semibold text-sm mb-2">Cover Letter</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {bid.message}
                </p>
              </div>
            </div>
          )
        }) : (
          <div className="rounded-xl border border-[#e5e5e5] bg-background p-8 text-center text-muted-foreground">
            No applications received yet.
          </div>
        )}
      </div>
    </div>
  )
}
