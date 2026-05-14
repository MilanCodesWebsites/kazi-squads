import * as React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserIcon } from '@hugeicons/core-free-icons'
import { ProfileSetupData } from '../types'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export function BioStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const chars = data.bio.length
  const minRequired = 100

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Great. Now write a bio to tell the world about yourself.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Help people get to know you at a glance. What work do you do best? Tell them clearly. You can always edit later.
      </p>

      <div className="mt-10 flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Left Side */}
        <div className="flex-1 md:max-w-[60%]">
          <Textarea 
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
            placeholder="Enter your top skills, experiences, and what makes you different. This is one of the first things clients will see on your profile."
            className="min-h-[250px] resize-y text-base p-4"
          />
          <div className="mt-2 text-right text-sm">
            {chars < minRequired ? (
              <span className="text-red-500">{minRequired - chars} characters left</span>
            ) : (
              <span className="text-muted-foreground">{chars} characters</span>
            )}
          </div>
        </div>

        {/* Right Side - Live Preview Card */}
        <div className="w-full md:w-[360px] shrink-0">
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border bg-muted/20 flex items-center justify-center shrink-0">
                {data.photoUrl ? (
                   <img src={data.photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                   <HugeiconsIcon icon={UserIcon} className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight">Your Name</h3>
                <div className="text-sm font-medium mt-1">{data.title || 'Your Professional Title'}</div>
                <div className="mt-2 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1 text-black">
                    <span className="text-[color:var(--kazi-lime)] text-sm">★</span> 5.0
                  </span>
                  <span>₦{data.hourlyRateNaira || '0'}/hr</span>
                  <span>0 jobs</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm whitespace-pre-wrap break-words text-foreground/80 leading-relaxed max-h-[200px] overflow-hidden relative">
                {data.bio || "Your bio will appear here as you type..."}
                {data.bio.length > 200 && (
                  <span className="absolute bottom-0 right-0 bg-white pl-8 font-medium text-[color:var(--kazi-lime)] underline">more</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
