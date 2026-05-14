import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatRelativeTime, getClientContext } from '@/lib/dashboard/client-context'

export const dynamic = 'force-dynamic'

type JobStatus = 'Open' | 'Closed'

function StatusPill({ status }: { status: JobStatus }) {
  if (status === 'Open') {
    return (
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
        style={{ backgroundColor: 'color-mix(in oklab, var(--kazi-lime) 25%, white)', color: 'black' }}
      >
        Open
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      Closed
    </span>
  )
}

export default async function JobsPage() {
  const ctx = await getClientContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Client profile not found</div>
        <div className="mt-1 text-sm text-muted-foreground">Complete client onboarding to access jobs.</div>
        <div className="mt-4">
          <Button asChild className="rounded-xl shadow-none" style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}>
            <Link href="/dashboard/onboarding/client">Go to onboarding</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { data: jobs, error } = await supabaseAdmin
    .from('jobs')
    .select('id, title, status, category, posted_at')
    .eq('client_profile_id', ctx.clientProfileId)
    .order('posted_at', { ascending: false })

  if (error) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Failed to load jobs</div>
        <div className="mt-1 text-sm text-muted-foreground">{error.message}</div>
      </div>
    )
  }

  const bidCounts = await Promise.all(
    (jobs ?? []).map(async (job) => {
      const { count } = await supabaseAdmin
        .from('job_bids')
        .select('id', { count: 'exact', head: true })
        .eq('job_id', job.id)
        .eq('status', 'open')
      return count ?? 0
    }),
  )

  const JOBS = (jobs ?? []).map((job, idx) => ({
    id: job.id as string,
    title: job.title as string,
    status: (job.status === 'open' ? 'Open' : 'Closed') as JobStatus,
    category: String(job.category ?? '').trim() || 'Other',
    bids: bidCounts[idx] ?? 0,
    posted: `Posted ${formatRelativeTime(job.posted_at as any)}`,
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your Jobs</h1>
        <Button
          asChild
          className="rounded-xl shadow-none"
          style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
        >
          <Link href="/dashboard/jobs/new">Post a Job</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {JOBS.length ? JOBS.map((job) => (
          <div key={job.id} className="rounded-xl border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-semibold text-foreground">{job.title}</div>
              </div>
              <StatusPill status={job.status} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border px-3 py-1 text-xs text-foreground">{job.category}</span>
              <span className="text-muted-foreground">{job.bids} bids</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{job.posted}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button variant="outline" className="rounded-xl shadow-none">
                View Bids
              </Button>
            </div>
          </div>
        )) : (
          <div className="rounded-xl border bg-background p-6">
            <div className="text-sm font-semibold">No jobs yet</div>
            <div className="mt-1 text-sm text-muted-foreground">Post your first job to start getting bids.</div>
            <div className="mt-4">
              <Button asChild className="rounded-xl shadow-none" style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}>
                <Link href="/dashboard/jobs/new">Post a Job</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
