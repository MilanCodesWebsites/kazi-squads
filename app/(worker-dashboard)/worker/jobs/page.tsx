import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { AiJobMatcher } from '@/components/dashboard/ai-job-matcher'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { formatNaira, formatRelativeTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const FILTERS = ['All', 'Design', 'Tech', 'Writing', 'Trades', 'Events']

export default async function WorkerJobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const ctx = await getWorkerContext()
  if (!ctx) {
    return (
      <div className="rounded-xl border bg-background p-4">
        <div className="text-sm font-semibold">Freelancer profile not found</div>
      </div>
    )
  }

  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'All'
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const pageSize = 10
  const offset = (page - 1) * pageSize

  let query = supabaseAdmin
    .from('jobs')
    .select('id, title, category, budget_mode, budget_fixed_naira, location_preference, city, posted_at, status', { count: 'exact' })
    .eq('status', 'open')

  if (category !== 'All') {
    query = query.ilike('category', `%${category}%`)
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: jobs, count } = await query
    .order('posted_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  const totalPages = count ? Math.ceil(count / pageSize) : 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Find Work</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">Search and apply for jobs that match your skills.</p>
      </div>

      <div className="space-y-4">
        <form className="relative" action="/worker/jobs" method="GET">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            name="q"
            type="search" 
            defaultValue={q}
            placeholder="Search for jobs..." 
            className="w-full rounded-xl pl-10 border-[#e5e5e5] bg-background"
          />
          <input type="hidden" name="category" value={category} />
        </form>
        
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const isActive = category === f
            return (
              <Link
                key={f}
                href={`/worker/jobs?category=${f}${q ? `&q=${q}` : ''}`}
                className={`rounded-full border border-[#e5e5e5] px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground ${isActive ? 'bg-black text-white border-black' : 'bg-background text-foreground'}`}
              >
                {f}
              </Link>
            )
          })}
        </div>
      </div>

      <AiJobMatcher workerId={ctx.workerOnboardingId} initialJobs={jobs ?? []} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center pt-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" disabled={page <= 1} className="rounded-xl border-[#e5e5e5]">
              <Link href={`/worker/jobs?page=${page - 1}&category=${category}${q ? `&q=${q}` : ''}`}>Previous</Link>
            </Button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button 
                key={i} 
                asChild 
                variant="outline" 
                className={`rounded-xl border-[#e5e5e5] ${page === i + 1 ? 'bg-muted/50 font-bold' : ''}`}
              >
                <Link href={`/worker/jobs?page=${i + 1}&category=${category}${q ? `&q=${q}` : ''}`}>{i + 1}</Link>
              </Button>
            ))}

            <Button asChild variant="outline" disabled={page >= totalPages} className="rounded-xl border-[#e5e5e5]">
              <Link href={`/worker/jobs?page=${page + 1}&category=${category}${q ? `&q=${q}` : ''}`}>Next</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
