'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatNaira, formatRelativeTime } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function AiJobMatcher({ workerId, initialJobs }: { workerId: string, initialJobs: any[] }) {
  const [jobs, setJobs] = useState<any[]>(initialJobs)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/ai/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ worker_id: workerId })
        })
        const data = await res.json()
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs)
        }
      } catch (err) {
        console.error('Failed to fetch AI matches', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMatches()
  }, [workerId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col justify-between gap-4 rounded-xl border border-[#e5e5e5] bg-background p-5">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {jobs && jobs.length > 0 ? jobs.map((job) => {
        const location = job.location_preference === 'remote' ? 'Remote' : job.city || 'Onsite'
        const budget = job.budget_mode === 'fixed' && job.budget_fixed_naira 
          ? formatNaira(job.budget_fixed_naira) 
          : 'Negotiable'

        return (
          <div 
            key={job.id} 
            className="group flex flex-col justify-between gap-4 rounded-xl border border-[#e5e5e5] bg-background p-5 transition-colors hover:border-[#AAFF00]"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                {job.aiScore && job.aiScore > 0 ? (
                  <span className="shrink-0 rounded-full bg-[#AAFF00]/20 px-2.5 py-0.5 text-xs font-bold text-black" style={{ backgroundColor: 'var(--kazi-lime)' }}>
                    {job.aiScore}% Match ✦
                  </span>
                ) : null}
              </div>
              
              {job.aiReason ? (
                <p className="text-xs text-muted-foreground italic mb-2">{job.aiReason}</p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">
                  {job.category}
                </span>
                <span className="font-bold text-[#AAFF00] drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" style={{ color: 'var(--kazi-lime)' }}>{budget}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{location}</span>
                <span>•</span>
                <span>{formatRelativeTime(job.posted_at)}</span>
              </div>
            </div>
            <div className="mt-2">
              <Button 
                asChild 
                variant="outline" 
                className="w-full rounded-xl border-black hover:bg-black hover:text-white"
              >
                <Link href={`/worker/jobs/${job.id}/apply`}>Apply Now</Link>
              </Button>
            </div>
          </div>
        )
      }) : (
        <div className="col-span-full rounded-xl border border-[#e5e5e5] bg-background p-8 text-center text-muted-foreground">
          No jobs found matching your criteria.
        </div>
      )}
    </div>
  )
}
