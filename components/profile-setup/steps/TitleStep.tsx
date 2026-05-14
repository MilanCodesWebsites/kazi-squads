import * as React from 'react'
import { ProfileSetupData } from '../types'
import { Input } from '@/components/ui/input'

export function TitleStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Got it. Now, add a title to tell the world what you do.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        It&apos;s the very first thing clients see, so make it count.
      </p>

      <div className="mt-12 max-w-2xl">
        <label className="mb-2 block text-sm font-medium">Your professional role</label>
        <Input
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          placeholder="Ex: Full Stack Web Developer"
          className="h-14 rounded-xl text-lg font-medium"
        />
      </div>
    </div>
  )
}
