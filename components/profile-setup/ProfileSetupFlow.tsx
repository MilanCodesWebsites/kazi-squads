'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { ProfileSetupData, initialProfileData } from './types'
import { CategoryStep } from './steps/CategoryStep'
import { SkillsStep } from './steps/SkillsStep'
import { TitleStep } from './steps/TitleStep'
import { ExperienceStep } from './steps/ExperienceStep'
import { EducationStep } from './steps/EducationStep'
import { LanguagesStep } from './steps/LanguagesStep'
import { BioStep } from './steps/BioStep'
import { RateStep } from './steps/RateStep'
import { PhotoLocationStep } from './steps/PhotoLocationStep'
import { PreviewStep } from './steps/PreviewStep'

const TOTAL_STEPS = 10 // 9 steps + 1 preview

export default function ProfileSetupFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [data, setData] = React.useState<ProfileSetupData>(initialProfileData)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const updateData = (newData: Partial<ProfileSetupData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/profile-setup/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        // Redirect to dashboard on success
        router.push('/dashboard/freelancer')
      } else {
        console.error('Submission failed:', json.error)
        alert(`Error saving profile: ${json.error}`)
      }
    } catch (err) {
      console.error('Submission error:', err)
      alert('Network error occurred while saving.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine what the "Next" button should say based on current step
  const getNextLabel = () => {
    switch (currentStep) {
      case 1: return 'Next, add your skills'
      case 2: return 'Next, your profile title'
      case 3: return 'Next, add your experience'
      case 4: return 'Next, add your education'
      case 5: return 'Next, add languages'
      case 6: return 'Next, write your bio'
      case 7: return 'Next, set your rate'
      case 8: return 'Next, add your photo and details'
      case 9: return 'Review your profile'
      case 10: return 'Submit profile'
      default: return 'Next'
    }
  }

  // Determine if "Next" button should be disabled
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: return !data.category || data.specialties.length === 0
      case 2: return data.skills.length === 0
      case 3: return !data.title.trim()
      // Steps 4 and 5 (Experience/Education) are optional, so never disabled
      case 6: return data.languages.some(l => !l.language.trim() || !l.proficiency.trim())
      case 7: return data.bio.trim().length < 100
      case 8: return !data.hourlyRateNaira || Number(data.hourlyRateNaira) <= 0
      case 9: return !data.city.trim() || !data.state || !data.phoneNumber.trim() || !data.photoUrl
      default: return false
    }
  }

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <CategoryStep data={data} updateData={updateData} />
      case 2: return <SkillsStep data={data} updateData={updateData} />
      case 3: return <TitleStep data={data} updateData={updateData} />
      case 4: return <ExperienceStep data={data} updateData={updateData} />
      case 5: return <EducationStep data={data} updateData={updateData} />
      case 6: return <LanguagesStep data={data} updateData={updateData} />
      case 7: return <BioStep data={data} updateData={updateData} />
      case 8: return <RateStep data={data} updateData={updateData} />
      case 9: return <PhotoLocationStep data={data} updateData={updateData} />
      case 10: return <PreviewStep data={data} setStep={setCurrentStep} />
      default: return null
    }
  }

  return (
    <div className="flex min-h-dvh flex-col pb-24">
      {/* Top Progress Bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted">
        <div 
          className="h-full bg-[color:var(--kazi-lime)] transition-all duration-300"
          style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">Kazi.</Link>
          {/* We would fetch real avatar URL here if we had it, but keeping it simple for flow */}
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-muted/20">
            {data.photoUrl ? (
               <img src={data.photoUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
               <HugeiconsIcon icon={UserIcon} className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8 md:py-12">
        {/* Step Counter */}
        {currentStep < TOTAL_STEPS && (
          <div className="mb-8 text-sm font-medium text-muted-foreground">
            {currentStep}/{TOTAL_STEPS - 1}
          </div>
        )}
        
        {renderStep()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              className="rounded-full px-8 h-11"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
          ) : (
             <div /> // Placeholder for alignment
          )}

          <div className="flex items-center gap-4">
             {/* Skip for now links for optional steps */}
             {(currentStep === 4 || currentStep === 5) && (
               <button
                 type="button"
                 onClick={handleNext}
                 className="text-sm font-medium text-[color:var(--kazi-lime)] hover:underline"
               >
                 Skip for now
               </button>
             )}

             <Button
               className={cn(
                 "rounded-full px-8 h-11 font-medium",
                 currentStep === TOTAL_STEPS ? "px-10" : ""
               )}
               style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
               onClick={currentStep === TOTAL_STEPS ? handleSubmit : handleNext}
               disabled={isNextDisabled() || isSubmitting}
             >
               {isSubmitting ? 'Saving...' : getNextLabel()}
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
