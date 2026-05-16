import * as React from 'react'

import { WorkerNav } from '@/components/dashboard/worker-nav'

export default function WorkerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <WorkerNav />

      <div className="md:pl-[240px]">
        <div className="mx-auto w-full max-w-6xl p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </div>
      </div>
    </div>
  )
}
