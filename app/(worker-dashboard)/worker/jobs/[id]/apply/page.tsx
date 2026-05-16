import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { ApplyForm } from './apply-form'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { formatNaira } from '@/lib/utils'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const ctx = await getWorkerContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Freelancer profile not found</div>
      </div>
    )
  }

  const { data: job, error } = await supabaseAdmin
    .from('jobs')
    .select('title, budget_mode, budget_fixed_naira')
    .eq('id', params.id)
    .single()

  if (error || !job) {
    notFound()
  }

  const budgetText = job.budget_mode === 'fixed' && job.budget_fixed_naira
    ? formatNaira(job.budget_fixed_naira)
    : 'Negotiable'

  const prefilledRate = job.budget_mode === 'fixed' && job.budget_fixed_naira
    ? job.budget_fixed_naira.toLocaleString()
    : ''

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <Link href="/worker/jobs">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{job.title}</h1>
          <p className="text-sm font-bold text-[#AAFF00] drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" style={{ color: 'var(--kazi-lime)' }}>Budget: {budgetText}</p>
        </div>
      </div>

      <ApplyForm jobId={params.id} prefilledRate={prefilledRate} workerId={ctx.workerOnboardingId} />
    </div>
  )
}
