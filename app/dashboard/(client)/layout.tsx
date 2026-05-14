import * as React from 'react'

import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <DashboardNav />

      <div className="md:pl-[240px]">
        <div className="mx-auto w-full max-w-6xl p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </div>
      </div>
    </div>
  )
}
