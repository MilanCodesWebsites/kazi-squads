'use client'

import * as React from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  UserIcon,
  Briefcase01Icon,
  Money01Icon,
  Search01Icon,
  PencilEdit01Icon,
  LaptopIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  OnboardingHeader,
  StepProgressBar,
  BottomBar,
  ImageSelectionCard,
  WideSelectionCard,
} from './onboarding-ui'
import FreelancerOnboarding from './freelancer-onboarding'

type Stage = 'signup' | 'welcome' | 'experience' | 'goal' | 'workstyle' | 'profile'
type ExperienceLevel = 'new' | 'some_experience' | 'expert' | ''
type FreelanceGoal = 'main_income' | 'side_money' | 'experience' | 'no_goal' | ''
type WorkStyle = 'find_opportunities' | 'package_work' | ''

export default function FreelancerFlow() {
  const [stage, setStage] = React.useState<Stage>('signup')
  const [loading, setLoading] = React.useState(true)
  const [userName, setUserName] = React.useState('')
  const [userEmail, setUserEmail] = React.useState('')
  const [userImage, setUserImage] = React.useState<string | null>(null)

  // Stage 0
  const [country, setCountry] = React.useState('Nigeria')
  const [emailOptIn, setEmailOptIn] = React.useState(true)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [creating, setCreating] = React.useState(false)

  // Stage 2
  const [experienceLevel, setExperienceLevel] = React.useState<ExperienceLevel>('')

  // Stage 3
  const [freelanceGoal, setFreelanceGoal] = React.useState<FreelanceGoal>('')

  // Stage 4
  const [workStyle, setWorkStyle] = React.useState<WorkStyle>('')
  const [openToContract, setOpenToContract] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json: any) => {
        setUserName(json?.user?.name ?? '')
        setUserEmail(json?.user?.email ?? '')
        setUserImage(json?.user?.image ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const firstName = userName.split(' ')[0] || 'there'

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    )
  }

  // After stage 4, render existing profile flow
  if (stage === 'profile') {
    return <FreelancerOnboarding />
  }

  /* ── Stage 0: Post-Signup ─────────────────────────── */
  if (stage === 'signup') {
    return (
      <main className="flex min-h-dvh flex-col items-center bg-white px-4 pt-16 pb-20 md:pt-24">
        <div className="w-full max-w-md">
          <h1 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
            Sign up to find work you love
          </h1>

          <div className="mt-6 flex items-center justify-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-muted/20">
              {userImage ? (
                <img src={userImage} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <HugeiconsIcon icon={UserIcon} className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">{userEmail || 'user@email.com'}</span>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={emailOptIn}
                onCheckedChange={(v) => setEmailOptIn(v === true)}
                className="mt-0.5 data-[state=checked]:bg-[#16a34a] data-[state=checked]:border-[#16a34a]"
              />
              <span className="text-sm leading-snug">
                Send me helpful emails to find rewarding work and job leads.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={agreedToTerms}
                onCheckedChange={(v) => setAgreedToTerms(v === true)}
                className="mt-0.5 data-[state=checked]:bg-[#16a34a] data-[state=checked]:border-[#16a34a]"
              />
              <span className="text-sm leading-snug">
                Yes, I understand and agree to the{' '}
                <Link href="/terms" className="underline underline-offset-2 hover:text-black" target="_blank">
                  Kazi Terms of Service
                </Link>
                , including the{' '}
                <Link href="/terms" className="underline underline-offset-2 hover:text-black" target="_blank">
                  User Agreement
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-black" target="_blank">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <Button
            className="mt-8 h-11 w-full rounded-full text-sm font-medium"
            style={{ backgroundColor: agreedToTerms ? 'var(--kazi-lime)' : undefined, color: agreedToTerms ? 'black' : undefined }}
            disabled={!agreedToTerms || creating}
            onClick={() => {
              setCreating(true)
              setTimeout(() => { setCreating(false); setStage('welcome') }, 800)
            }}
          >
            {creating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Creating account…
              </span>
            ) : (
              'Create my account'
            )}
          </Button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth" className="font-medium text-black underline underline-offset-2">
              Log In
            </Link>
          </p>
        </div>
      </main>
    )
  }

  /* ── Stage 1: Welcome ─────────────────────────────── */
  if (stage === 'welcome') {
    const bullets = [
      { icon: UserIcon, text: 'Answer a few questions and start building your profile' },
      { icon: Briefcase01Icon, text: 'Apply for open roles or list services for clients to buy' },
      { icon: Money01Icon, text: 'Get paid safely and know we\'re there to help' },
    ]
    return (
      <main className="min-h-dvh bg-white">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 px-4 py-12 md:px-8 md:py-16">
          {/* Left */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
              Hey {firstName}. Ready for your next big opportunity?
            </h1>

            <div className="mt-8 space-y-5">
              {bullets.map((b) => (
                <div key={b.text} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-muted/20">
                    <HugeiconsIcon icon={b.icon} className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm leading-relaxed md:text-base">{b.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                className="rounded-full px-7 h-11 text-sm font-semibold"
                style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
                onClick={() => setStage('experience')}
              >
                Get started
              </Button>
              <span className="text-xs text-muted-foreground max-w-xs leading-snug">
                It only takes 5–10 minutes and you can edit it later. We'll save as you go.
              </span>
            </div>
          </div>

          {/* Right: Testimonial Card */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-lime-200 to-emerald-300 flex items-center justify-center overflow-hidden border-2 border-white shadow">
                    <HugeiconsIcon icon={UserIcon} className="h-10 w-10 text-emerald-700/60" />
                  </div>
                  <div className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <div className="mt-4 text-lg font-semibold">Adaeze O.</div>
                <div className="text-sm text-muted-foreground">UX Designer</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">⭐ 5.0</span>
                  <span>₦15,000/hr</span>
                  <span>📋 23 jobs</span>
                </div>
              </div>
              <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground italic">
                &quot;Kazi has enabled me to connect with amazing clients across Nigeria. I know what I&apos;m bringing
                to the table and love the feeling of being able to help a variety of clients.&quot;
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ── Stages 2–4: Questionnaire ────────────────────── */
  const goBack = () => {
    if (stage === 'experience') setStage('welcome')
    else if (stage === 'goal') setStage('experience')
    else if (stage === 'workstyle') setStage('goal')
  }

  const canNext =
    (stage === 'experience' && experienceLevel !== '') ||
    (stage === 'goal' && freelanceGoal !== '') ||
    (stage === 'workstyle' && workStyle !== '')

  const goNext = () => {
    if (stage === 'experience') setStage('goal')
    else if (stage === 'goal') setStage('workstyle')
    else if (stage === 'workstyle') setStage('profile')
  }

  const skip = () => goNext()

  const stepNum = stage === 'experience' ? 1 : stage === 'goal' ? 2 : 3
  const nextLabel = stage === 'workstyle' ? 'Next, create a profile' : 'Next'

  return (
    <main className="min-h-dvh bg-white">
      <OnboardingHeader onBack={goBack} canGoBack avatarUrl={userImage} />

      <div className="mx-auto w-full max-w-4xl px-4 pt-8 pb-28 md:px-8 md:pt-12">
        <StepProgressBar current={stepNum} total={3} />

        {/* Stage 2: Experience */}
        {stage === 'experience' && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              A few quick questions: first, have you freelanced before?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base max-w-2xl">
              This lets us know how much help to give you along the way. We won&apos;t share your answer with anyone
              else, including potential clients.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ImageSelectionCard
                label="I am brand new to this"
                icon={Search01Icon}
                iconBg="#d1fae5"
                selected={experienceLevel === 'new'}
                onClick={() => setExperienceLevel('new')}
              />
              <ImageSelectionCard
                label="I have some experience"
                icon={PencilEdit01Icon}
                iconBg="#fef3c7"
                selected={experienceLevel === 'some_experience'}
                onClick={() => setExperienceLevel('some_experience')}
              />
              <ImageSelectionCard
                label="I am an expert"
                icon={LaptopIcon}
                iconBg="#dbeafe"
                selected={experienceLevel === 'expert'}
                onClick={() => setExperienceLevel('expert')}
              />
            </div>
          </>
        )}

        {/* Stage 3: Goal */}
        {stage === 'goal' && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              Got it. What&apos;s your biggest goal for freelancing?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base max-w-2xl">
              Different people come to Kazi for various reasons. We want to highlight the opportunities that fit your
              goals best while still showing you all the possibilities.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ImageSelectionCard
                label="To earn my main income"
                icon={Money01Icon}
                iconBg="#fde68a"
                selected={freelanceGoal === 'main_income'}
                onClick={() => setFreelanceGoal('main_income')}
              />
              <ImageSelectionCard
                label="To make money on the side"
                icon={Briefcase01Icon}
                iconBg="#bbf7d0"
                selected={freelanceGoal === 'side_money'}
                onClick={() => setFreelanceGoal('side_money')}
              />
              <ImageSelectionCard
                label="To get experience, for a full-time job"
                icon={CheckmarkCircle01Icon}
                iconBg="#fecaca"
                selected={freelanceGoal === 'experience'}
                onClick={() => setFreelanceGoal('experience')}
              />
              <ImageSelectionCard
                label="I don't have a goal in mind yet"
                icon={Search01Icon}
                iconBg="#e0e7ff"
                selected={freelanceGoal === 'no_goal'}
                onClick={() => setFreelanceGoal('no_goal')}
              />
            </div>
          </>
        )}

        {/* Stage 4: Work Style */}
        {stage === 'workstyle' && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              And how would you like to work?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base max-w-2xl">
              Everybody works in different ways, so we have different ways of helping you win work. You can select
              multiple preferences now and can always change it later.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <WideSelectionCard
                title="I'd like to find opportunities myself"
                description="Clients post jobs on our Marketplace: you can browse and bid for them, or get invited by a client."
                icon={Search01Icon}
                iconBg="#d1fae5"
                selected={workStyle === 'find_opportunities'}
                onClick={() => setWorkStyle('find_opportunities')}
              />
              <WideSelectionCard
                title="I'd like to package up my work for clients to buy"
                description="Define your service with prices and timelines: we'll list it in our Project Catalog for clients to buy right away."
                icon={Briefcase01Icon}
                iconBg="#dbeafe"
                selected={workStyle === 'package_work'}
                onClick={() => setWorkStyle('package_work')}
              />
            </div>

            <label className="mt-6 flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={openToContract}
                onCheckedChange={(v) => setOpenToContract(v === true)}
                className="mt-0.5"
              />
              <span className="text-sm leading-snug">
                <strong>I&apos;m open to contract-to-hire opportunities</strong> — Start with a contract, and later
                explore a full-time option with the client
              </span>
            </label>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomBar
        left={
          <Button
            variant="outline"
            className="rounded-full px-5 h-10 text-sm"
            onClick={goBack}
          >
            Back
          </Button>
        }
        right={
          <>
            <button
              type="button"
              onClick={skip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Skip for now
            </button>
            <Button
              className="rounded-full px-6 h-10 text-sm font-semibold"
              style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
              disabled={!canNext}
              onClick={goNext}
            >
              {nextLabel}
            </Button>
          </>
        }
      />
    </main>
  )
}
