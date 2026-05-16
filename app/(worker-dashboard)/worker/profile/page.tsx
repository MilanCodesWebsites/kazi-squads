import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkBadge01Icon, Location01Icon, Briefcase01Icon, Calendar01Icon, LinkSquare02Icon } from '@hugeicons/core-free-icons'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { formatNaira } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function WorkerProfilePage() {
  const ctx = await getWorkerContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Freelancer profile not found</div>
      </div>
    )
  }

  const { data: profile, error } = await supabaseAdmin
    .from('worker_onboarding')
    .select('*')
    .eq('id', ctx.workerOnboardingId)
    .single()

  if (error || !profile) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Failed to load profile</div>
        <div className="mt-1 text-sm text-muted-foreground">{error?.message}</div>
      </div>
    )
  }

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || 'U'
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Freelancer'
  const location = `${profile.city}, ${profile.state}`
  const minRate = formatNaira(profile.minimum_rate_naira)

  // Fetch jobs completed to display in stats
  const { count: jobsCompleted } = await supabaseAdmin
    .from('contracts')
    .select('id', { count: 'exact', head: true })
    .eq('worker_onboarding_id', ctx.workerOnboardingId)
    .eq('status', 'completed')

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header Profile Section */}
      <div className="rounded-xl border border-[#e5e5e5] bg-background p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-muted text-4xl font-bold text-muted-foreground uppercase">
            {initials}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  {fullName}
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} className="h-5 w-5" style={{ color: 'var(--kazi-lime)' }} />
                </h1>
                <p className="text-lg font-medium text-muted-foreground mt-1">{profile.job_title}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-black" style={{ backgroundColor: 'var(--kazi-lime)' }}>
                  Available
                </span>
                <p className="text-xl font-bold mt-2">{minRate} <span className="text-sm font-normal text-muted-foreground">/ hr min rate</span></p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5e5e5]">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <span key={skill} className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button asChild variant="outline" className="rounded-xl border-black hover:bg-black hover:text-white">
                <Link href="/worker/profile/edit">Edit Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3 rounded-xl border border-[#e5e5e5] bg-background p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Trust Score</h3>
            <span className="font-bold text-lg text-black" style={{ color: 'var(--kazi-lime)' }}>98/100</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '98%', backgroundColor: 'var(--kazi-lime)' }}></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Based on successful deliveries, on-time rate, and client ratings.</p>
        </div>

        <div className="rounded-xl border border-[#e5e5e5] bg-background p-6 text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <HugeiconsIcon icon={Briefcase01Icon} className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{jobsCompleted || 0}</div>
          <div className="text-sm font-medium text-muted-foreground">Jobs Completed</div>
        </div>

        <div className="rounded-xl border border-[#e5e5e5] bg-background p-6 text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">100%</div>
          <div className="text-sm font-medium text-muted-foreground">On-time Rate</div>
        </div>

        <div className="rounded-xl border border-[#e5e5e5] bg-background p-6 text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <HugeiconsIcon icon={Calendar01Icon} className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{memberSince}</div>
          <div className="text-sm font-medium text-muted-foreground">Member Since</div>
        </div>
      </div>
    </div>
  )
}
