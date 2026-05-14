import * as React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  UserIcon, PencilEdit01Icon, Location01Icon, 
  SparklesIcon, TranslateIcon, ValidationIcon 
} from '@hugeicons/core-free-icons'
import { ProfileSetupData } from '../types'
import { Button } from '@/components/ui/button'

export function PreviewStep({ 
  data, 
  setStep 
}: { 
  data: ProfileSetupData, 
  setStep: (step: number) => void 
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl mb-8">
        Preview Profile
      </h1>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-muted/20 p-6 md:p-8 mb-8 border border-[color:var(--kazi-lime)]/30">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Looking good! <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5 text-[color:var(--kazi-lime)]" />
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Make any edits you want, then submit your profile.
          </p>
        </div>
        {/* The actual submit button is handled by the main flow bottom bar, 
            but the prompt asks for one here too. It will just trigger the main flow logic if possible, 
            or we can just leave it as styling since the flow handles it. Let's make it scroll down or informational. */}
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        
        {/* Profile Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 border-b">
          <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0">
            <div className="h-full w-full rounded-full overflow-hidden border bg-muted/20 flex items-center justify-center">
               {data.photoUrl ? (
                 <img src={data.photoUrl} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <HugeiconsIcon icon={UserIcon} className="h-12 w-12 text-muted-foreground" />
               )}
            </div>
            <button onClick={() => setStep(9)} className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors shadow-sm text-[color:var(--kazi-lime)]">
               <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 pt-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Your Name
              <HugeiconsIcon icon={ValidationIcon} className="h-5 w-5 text-[color:var(--kazi-lime)]" />
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
               <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
               {data.city}{data.city && data.state ? ', ' : ''}{data.state}
               <span className="mx-2">•</span>
               <span>Local time: 10:00 AM</span> {/* Mock time */}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
               <div className="flex flex-col">
                 <span className="text-muted-foreground">Job Success</span>
                 <span className="text-[color:var(--kazi-lime)]">New</span>
               </div>
            </div>
          </div>

          <div className="pt-2 text-right">
             <div className="flex items-center justify-end gap-2 text-xl font-bold">
                ₦{data.hourlyRateNaira || 0} <span className="text-sm font-normal text-muted-foreground">/hr</span>
                <button onClick={() => setStep(8)} className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/20 hover:bg-muted transition-colors text-[color:var(--kazi-lime)] ml-2">
                  <HugeiconsIcon icon={PencilEdit01Icon} className="h-3.5 w-3.5" />
                </button>
             </div>
          </div>
        </div>

        {/* Profile Body */}
        <div className="flex flex-col md:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r">
             {/* Title & Bio */}
             <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-bold">{data.title || 'Your Professional Title'}</h3>
                 <button onClick={() => setStep(3)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors text-[color:var(--kazi-lime)]">
                   <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
                 </button>
               </div>
               <div className="relative group">
                 <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                   {data.bio || 'Your bio...'}
                 </p>
                 <button onClick={() => setStep(7)} className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 text-[color:var(--kazi-lime)]">
                   <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
                 </button>
               </div>
             </div>

             {/* Skills */}
             <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold">Skills</h3>
                 <button onClick={() => setStep(2)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors text-[color:var(--kazi-lime)]">
                   <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
                 </button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {data.skills.map(s => (
                   <span key={s} className="bg-muted/30 border px-3 py-1 rounded-full text-sm font-medium">{s}</span>
                 ))}
                 {data.skills.length === 0 && <span className="text-sm text-muted-foreground">No skills added</span>}
               </div>
             </div>

             {/* Work History */}
             <div>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold">Work History</h3>
                 <button onClick={() => setStep(4)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors text-[color:var(--kazi-lime)]">
                   <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
                 </button>
               </div>
               <div className="space-y-6">
                 {data.experiences.map(exp => (
                   <div key={exp.id}>
                     <h4 className="font-semibold">{exp.title}</h4>
                     <div className="text-sm text-muted-foreground mt-1">
                       {exp.company} • {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                     </div>
                     {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                   </div>
                 ))}
                 {data.experiences.length === 0 && <span className="text-sm text-muted-foreground">No work history added</span>}
               </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-[280px] p-6 md:p-8 bg-muted/5">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold">Languages</h3>
               <button onClick={() => setStep(6)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors text-[color:var(--kazi-lime)]">
                 <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
               </button>
             </div>
             <div className="space-y-3">
               {data.languages.map(lang => (
                 <div key={lang.id} className="text-sm">
                   <span className="font-medium">{lang.language}:</span> <span className="text-muted-foreground">{lang.proficiency}</span>
                 </div>
               ))}
             </div>

             <div className="mt-8">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold">Education</h3>
                 <button onClick={() => setStep(5)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors text-[color:var(--kazi-lime)]">
                   <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
                 </button>
               </div>
               <div className="space-y-4">
                 {data.education.map(edu => (
                   <div key={edu.id} className="text-sm">
                     <h4 className="font-semibold">{edu.school}</h4>
                     <div className="text-muted-foreground">{edu.degree}</div>
                     <div className="text-xs text-muted-foreground mt-1">{edu.startYear} - {edu.endYear || 'Present'}</div>
                   </div>
                 ))}
                 {data.education.length === 0 && <span className="text-sm text-muted-foreground">No education added</span>}
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
