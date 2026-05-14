import * as React from 'react'
import { ProfileSetupData } from '../types'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  {
    id: 'design',
    name: 'Design & Creative',
    specialties: ['Graphic Design', 'UI/UX Design', 'Video Editing', 'Animation', 'Illustration', 'Logo Design']
  },
  {
    id: 'web-mobile',
    name: 'Web & Mobile Dev',
    specialties: ['Frontend Development', 'Backend Development', 'Mobile App Dev', 'E-commerce', 'CMS Development', 'Web Design']
  },
  {
    id: 'writing',
    name: 'Writing & Translation',
    specialties: ['Copywriting', 'Content Writing', 'Translation', 'Editing & Proofreading', 'Technical Writing']
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    specialties: ['Digital Marketing', 'SEO', 'Social Media Management', 'Lead Generation', 'Email Marketing']
  },
  {
    id: 'admin-support',
    name: 'Admin Support',
    specialties: ['Virtual Assistance', 'Data Entry', 'Project Management', 'Customer Service', 'Web Research']
  },
  {
    id: 'engineering',
    name: 'Engineering & Trades',
    specialties: ['AutoCAD', '3D Modeling', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering']
  },
  {
    id: 'events',
    name: 'Events & Hospitality',
    specialties: ['Event Planning', 'Catering Consultation', 'Travel Planning']
  },
  {
    id: 'data',
    name: 'Data & Analytics',
    specialties: ['Data Analysis', 'Machine Learning', 'Data Visualization', 'Data Engineering']
  },
  {
    id: 'legal',
    name: 'Legal & Consulting',
    specialties: ['Corporate Law', 'Contract Drafting', 'Business Consulting', 'Financial Consulting']
  }
]

export function CategoryStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const selectedCatObj = CATEGORIES.find(c => c.name === data.category) || CATEGORIES[0]

  // Initialize if empty
  React.useEffect(() => {
    if (!data.category) {
      updateData({ category: CATEGORIES[0].name })
    }
  }, [])

  const handleCategoryClick = (name: string) => {
    if (data.category !== name) {
      updateData({ category: name, specialties: [] })
    }
  }

  const handleSpecialtyToggle = (spec: string, checked: boolean) => {
    if (checked) {
      if (data.specialties.length < 3) {
        updateData({ specialties: [...data.specialties, spec] })
      }
    } else {
      updateData({ specialties: data.specialties.filter(s => s !== spec) })
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Great, so what kind of work are you here to do?
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Don&apos;t worry, you can change these choices later on.
      </p>

      <div className="mt-10 flex flex-col md:flex-row border rounded-xl overflow-hidden min-h-[400px]">
        {/* Left Column - Categories */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r bg-muted/10 p-2">
          <div className="px-4 py-3 text-sm font-medium">Select 1 category</div>
          <div className="flex flex-col space-y-1">
            {CATEGORIES.map((cat) => {
              const isSelected = data.category === cat.name
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={cn(
                    "text-left px-4 py-2.5 rounded-lg text-sm transition-colors",
                    isSelected 
                      ? "bg-[color:var(--kazi-lime)]/20 font-medium text-black" 
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column - Specialties */}
        <div className="w-full md:w-1/2 p-2">
          <div className="flex items-center justify-between px-4 py-3">
             <div className="text-sm font-medium">
               Now, select 1 to 3 specialties
               {data.category && (
                 <span className="ml-1 text-muted-foreground">({data.specialties.length})</span>
               )}
             </div>
             {data.specialties.length > 0 && (
               <button 
                 onClick={() => updateData({ specialties: [] })}
                 className="text-xs font-medium text-[color:var(--kazi-lime)] hover:underline"
               >
                 Clear selections
               </button>
             )}
          </div>
          
          <div className="px-4 flex flex-col space-y-3 mt-2">
            {selectedCatObj.specialties.map((spec) => {
              const isChecked = data.specialties.includes(spec)
              const isDisabled = !isChecked && data.specialties.length >= 3
              return (
                <label 
                  key={spec} 
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                    isChecked ? "bg-[color:var(--kazi-lime)]/10" : "hover:bg-muted/30",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Checkbox 
                    checked={isChecked}
                    onCheckedChange={(checked) => handleSpecialtyToggle(spec, !!checked)}
                    disabled={isDisabled}
                    className="data-[state=checked]:bg-[color:var(--kazi-lime)] data-[state=checked]:border-[color:var(--kazi-lime)] data-[state=checked]:text-black"
                  />
                  <span className="text-sm">{spec}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
