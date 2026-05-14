import * as React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Cancel01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { ProfileSetupData } from '../types'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const SUGGESTED_SKILLS = [
  'HTML5', 'CSS3', 'React.js', 'Tailwind CSS', 'Next.js', 
  'TypeScript', 'Node.js', 'Figma', 'UI Design', 'Copywriting'
]

export function SkillsStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const [inputValue, setInputValue] = React.useState('')

  const handleAddSkill = (skill: string) => {
    const s = skill.trim()
    if (s && !data.skills.includes(s) && data.skills.length < 15) {
      updateData({ skills: [...data.skills, s] })
    }
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddSkill(inputValue)
    }
  }

  const handleRemoveSkill = (skill: string) => {
    updateData({ skills: data.skills.filter(s => s !== skill) })
  }

  const availableSuggested = SUGGESTED_SKILLS.filter(s => !data.skills.includes(s))

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Nearly there! What work are you here to do?
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Your skills show clients what you can offer and help us match you to the right jobs.
      </p>

      <div className="mt-10 flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Left Side */}
        <div className="flex-1 md:max-w-[60%]">
          <div className="space-y-1">
            <label className="text-sm font-medium">Your skills</label>
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter skills here (press Enter)"
                className="h-12 rounded-xl text-base"
                disabled={data.skills.length >= 15}
              />
              <div className="absolute right-3 top-3.5 text-xs text-muted-foreground">
                Max 15 skills
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="rounded-full hover:bg-black/10 p-0.5"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <label className="text-sm font-medium text-muted-foreground">Suggested skills</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {availableSuggested.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleAddSkill(skill)}
                  disabled={data.skills.length >= 15}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Quote Card */}
        <div className="w-full md:w-[320px] shrink-0">
          <div className="rounded-2xl border bg-muted/10 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lime-200 to-emerald-300 flex items-center justify-center border-2 border-white">
                 <HugeiconsIcon icon={UserIcon} className="h-5 w-5 text-emerald-700/60" />
              </div>
              <div>
                <div className="text-sm font-medium">System Tip</div>
                <div className="text-xs text-muted-foreground">Kazi Matching Engine</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              "Clients search for specific skills. The more accurate your tags are, the better our AI can match you with high-paying clients looking for your exact expertise."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
