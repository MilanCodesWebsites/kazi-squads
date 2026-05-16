import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { formatNaira, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'open':
    case 'pending':
      return 'bg-muted text-muted-foreground'
    case 'viewed':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'accepted':
      return 'bg-[#AAFF00]/20 text-black dark:text-[#AAFF00] drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]'
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export default async function WorkerApplicationsPage() {
  const ctx = await getWorkerContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Freelancer profile not found</div>
      </div>
    )
  }

  const { data: bids, error } = await supabaseAdmin
    .from('job_bids')
    .select(`
      id, 
      bid_amount_naira, 
      message, 
      status, 
      created_at,
      job:jobs (
        title,
        client_profile:client_profiles (
          company_name
        )
      )
    `)
    .eq('worker_onboarding_id', ctx.workerOnboardingId)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Your Applications</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">Track the status of jobs you've applied to.</p>
      </div>

      <div className="space-y-4">
        {bids && bids.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {bids.map((app: any) => {
              const jobTitle = app.job?.title || 'Unknown Job'
              const companyName = app.job?.client_profile?.company_name || 'Unknown Client'
              const displayStatus = app.status.charAt(0).toUpperCase() + app.status.slice(1)
              const rate = formatNaira(app.bid_amount_naira)

              return (
                <AccordionItem 
                  key={app.id} 
                  value={app.id}
                  className="rounded-xl border border-[#e5e5e5] bg-background px-5 py-2 data-[state=open]:border-[#AAFF00]"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pr-4">
                      <div className="space-y-1 text-left">
                        <h3 className="font-bold text-foreground">{jobTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{companyName}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(app.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:ml-auto">
                        <span className="font-bold">{rate}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(app.status)}`} style={app.status === 'accepted' ? { backgroundColor: 'var(--kazi-lime)', color: 'black' } : {}}>
                          {displayStatus}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 border-t border-[#e5e5e5] text-muted-foreground">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Cover Letter</h4>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{app.message}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        ) : (
          <div className="rounded-xl border border-[#e5e5e5] bg-background p-8 text-center text-muted-foreground">
            <p>You haven't submitted any applications yet.</p>
            <Button asChild variant="outline" className="mt-4 rounded-xl border-black hover:bg-black hover:text-white">
              <Link href="/worker/jobs">Browse Jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
