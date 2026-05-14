import * as React from 'react'
import { ProfileSetupData } from '../types'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function RateStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const rate = Number(data.hourlyRateNaira) || 0
  const fee = rate * 0.10
  const net = rate - fee

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Now, let&apos;s set your minimum rate.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Clients will see this on your profile. You can adjust it when submitting proposals.
      </p>

      <div className="mt-12 max-w-3xl">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Minimum rate</h3>
            <p className="mt-1 text-sm text-muted-foreground">Total amount the client will see.</p>
          </div>
          <div className="flex items-center gap-2 sm:w-[200px]">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold">₦</span>
              <Input 
                type="number"
                min="0"
                value={data.hourlyRateNaira}
                onChange={(e) => updateData({ hourlyRateNaira: e.target.value === '' ? '' : Number(e.target.value) })}
                className="h-12 pl-8 pr-12 text-right font-semibold text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/job</span>
            </div>
          </div>
        </div>
        
        <div className="h-px w-full bg-border" />

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Platform fee</h3>
              <a href="#" className="text-sm font-medium text-[color:var(--kazi-lime)] underline">Learn more</a>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Kazi takes 10% of every completed job to keep the platform running.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:w-[200px]">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
              <Input 
                disabled
                value={fee > 0 ? `-${fee.toFixed(2)}` : '0.00'}
                className="h-12 pl-8 pr-12 text-right font-medium text-red-500 bg-muted/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/job</span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        {/* Row 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">You&apos;ll get</h3>
            <p className="mt-1 text-sm text-muted-foreground">The estimated amount you&apos;ll receive after fees.</p>
          </div>
          <div className="flex items-center gap-2 sm:w-[200px]">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold">₦</span>
              <Input 
                disabled
                value={net > 0 ? net.toFixed(2) : '0.00'}
                className="h-12 pl-8 pr-12 text-right font-semibold text-lg bg-muted/10 border-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/job</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
