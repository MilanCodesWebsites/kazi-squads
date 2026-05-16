import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { formatNaira, formatRelativeTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function WorkerHomePage() {
  const ctx = await getWorkerContext()
  
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Freelancer profile not found</div>
        <div className="mt-1 text-sm text-muted-foreground">Complete freelancer onboarding to access the dashboard.</div>
        <div className="mt-4">
          <Button asChild className="rounded-xl shadow-none" style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}>
            <Link href="/onboarding">Go to onboarding</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 1. Fetch worker profile for greeting and stats
  const { data: profile } = await supabaseAdmin
    .from('worker_onboarding')
    .select('first_name, last_name, job_title')
    .eq('id', ctx.workerOnboardingId)
    .maybeSingle()

  const name = profile?.first_name || ctx.sessionName || 'there'

  // 2. Fetch jobs applied (job bids)
  const { count: jobsApplied } = await supabaseAdmin
    .from('job_bids')
    .select('id', { count: 'exact', head: true })
    .eq('worker_onboarding_id', ctx.workerOnboardingId)

  // 3. Fetch active contracts
  const { count: activeContracts } = await supabaseAdmin
    .from('contracts')
    .select('id', { count: 'exact', head: true })
    .eq('worker_onboarding_id', ctx.workerOnboardingId)
    .eq('status', 'active')

  // 4. Fetch completed contracts to sum total earned
  const { data: completedContracts } = await supabaseAdmin
    .from('contracts')
    .select('amount_naira')
    .eq('worker_onboarding_id', ctx.workerOnboardingId)
    .eq('status', 'completed')

  const totalEarned = (completedContracts ?? []).reduce((sum, c) => sum + (c.amount_naira ?? 0), 0)

  const STATS = [
    { label: 'Profile Views', value: '0' }, // Currently not tracked in worker_onboarding, mock for now
    { label: 'Jobs Applied', value: String(jobsApplied ?? 0) },
    { label: 'Active Contracts', value: String(activeContracts ?? 0) },
    { label: 'Total Earned', value: formatNaira(totalEarned) },
  ]

  // 5. Fetch recommended jobs (last 3 open jobs)
  const { data: jobs } = await supabaseAdmin
    .from('jobs')
    .select('id, title, category, budget_mode, budget_fixed_naira, location_preference, city, posted_at')
    .eq('status', 'open')
    .order('posted_at', { ascending: false })
    .limit(3)

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Good morning, {name}.</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">Here are the best jobs for your skills today.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#e5e5e5] bg-background p-4">
              <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">Recommended Jobs</h2>
          <span className="rounded-full bg-[#AAFF00]/20 px-2.5 py-0.5 text-xs font-semibold text-black" style={{ backgroundColor: 'var(--kazi-lime)' }}>
            AI Matched
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => {
              const location = job.location_preference === 'remote' ? 'Remote' : job.city || 'Onsite'
              const budget = job.budget_mode === 'fixed' && job.budget_fixed_naira 
                ? formatNaira(job.budget_fixed_naira) 
                : 'Negotiable'
              
              return (
                <div 
                  key={job.id} 
                  className="group flex flex-col items-start justify-between gap-4 rounded-xl border border-[#e5e5e5] bg-background p-5 transition-colors hover:border-[#AAFF00] md:flex-row md:items-center"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">
                        {job.category}
                      </span>
                      <span className="font-bold text-[#AAFF00] drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" style={{ color: 'var(--kazi-lime)' }}>{budget}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{location}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{formatRelativeTime(job.posted_at)}</span>
                    </div>
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full shrink-0 rounded-xl border-black hover:bg-black hover:text-white md:w-auto"
                  >
                    <Link href={`/worker/jobs/${job.id}/apply`}>Apply Now</Link>
                  </Button>
                </div>
              )
            })
          ) : (
            <div className="rounded-xl border border-[#e5e5e5] bg-background p-6 text-center text-sm text-muted-foreground">
              No recommended jobs at the moment.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
