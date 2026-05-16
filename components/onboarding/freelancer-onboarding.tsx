'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const NIGERIA_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT - Abuja',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

type PaystackBank = {
  id: number
  name: string
  slug: string
  code: string
}

type ExperienceLevel = 'entry' | 'intermediate' | 'expert' | ''

type WorkPreference = 'remote' | 'hybrid' | 'onsite' | ''

type Availability = 'immediately' | 'two_weeks' | 'one_month' | ''

function clampInt(value: string) {
  const digits = value.replace(/[^0-9]/g, '')
  if (!digits) return ''
  const n = Number.parseInt(digits, 10)
  if (!Number.isFinite(n)) return ''
  return String(n)
}

function normalizeSkill(skill: string) {
  return skill.trim().replace(/\s+/g, ' ')
}

function splitName(fullName: string) {
  const cleaned = fullName.trim().replace(/\s+/g, ' ')
  if (!cleaned) return { firstName: '', lastName: '' }
  const parts = cleaned.split(' ')
  if (parts.length === 1) return { firstName: parts[0] ?? '', lastName: '' }
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.at(-1) ?? '',
  }
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <div className="mb-6">
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted-foreground md:text-base">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

function ChoiceCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      className={cn(
        'cursor-pointer p-4 transition-colors',
        selected
          ? 'border-[color:var(--kazi-lime)]'
          : 'hover:border-muted-foreground/30',
      )}
      style={selected ? { boxShadow: '0 0 0 1px var(--kazi-lime) inset' } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{description}</div>
        </div>
        {selected ? (
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5" style={{ color: 'var(--kazi-lime)' }} />
        ) : null}
      </div>
    </Card>
  )
}

function ProgressBar({ currentIndex, total }: { currentIndex: number; total: number }) {
  const percent = total <= 1 ? 0 : Math.round((currentIndex / (total - 1)) * 100)
  return (
    <div className="h-1 w-full bg-muted">
      <div
        className="h-1 transition-all"
        style={{ width: `${percent}%`, backgroundColor: 'var(--kazi-lime)' }}
      />
    </div>
  )
}

export default function FreelancerOnboarding() {
  const router = useRouter()

  const [step, setStep] = React.useState(0)
  const totalSteps = 10

  const [loadingMe, setLoadingMe] = React.useState(true)

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [jobTitle, setJobTitle] = React.useState('')

  const [skills, setSkills] = React.useState<string[]>([])
  const [skillDraft, setSkillDraft] = React.useState('')

  const [experience, setExperience] = React.useState<ExperienceLevel>('')

  const [state, setState] = React.useState('')
  const [city, setCity] = React.useState('')

  const [workPreference, setWorkPreference] = React.useState<WorkPreference>('')

  const [availability, setAvailability] = React.useState<Availability>('')

  const [rateNgn, setRateNgn] = React.useState('')

  const [bio, setBio] = React.useState('')

  const [banksLoading, setBanksLoading] = React.useState(false)
  const [banks, setBanks] = React.useState<PaystackBank[]>([])
  const [bankCode, setBankCode] = React.useState('')
  const [accountNumber, setAccountNumber] = React.useState('')
  const [accountName, setAccountName] = React.useState('')
  const [resolvingAccount, setResolvingAccount] = React.useState(false)
  const [bankError, setBankError] = React.useState<string | null>(null)

  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    async function loadMe() {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        const json = (await res.json().catch(() => null)) as any

        if (cancelled) return

        const fullName = json?.user?.name
        if (typeof fullName === 'string' && fullName.trim()) {
          const parts = splitName(fullName)
          setFirstName(parts.firstName)
          setLastName(parts.lastName)
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingMe(false)
      }
    }

    loadMe()

    return () => {
      cancelled = true
    }
  }, [])

  const selectedBank = React.useMemo(
    () => banks.find((b) => b.code === bankCode) ?? null,
    [banks, bankCode],
  )

  const canContinue = React.useMemo(() => {
    if (done) return true

    switch (step) {
      case 0:
        return firstName.trim().length > 0 && lastName.trim().length > 0
      case 1:
        return jobTitle.trim().length > 1
      case 2:
        return skills.length >= 1 && skills.length <= 8
      case 3:
        return experience !== ''
      case 4:
        return state.trim().length > 0 && city.trim().length > 0
      case 5:
        return workPreference !== ''
      case 6:
        return availability !== ''
      case 7:
        return rateNgn.trim().length > 0
      case 8:
        return bio.trim().length > 10 && bio.length <= 300
      case 9:
        return (
          bankCode.trim().length > 0 &&
          accountNumber.length === 10 &&
          accountName.trim().length > 0 &&
          (selectedBank?.name?.trim().length ?? 0) > 0
        )
      default:
        return false
    }
  }, [
    done,
    step,
    firstName,
    lastName,
    jobTitle,
    skills,
    experience,
    state,
    city,
    workPreference,
    availability,
    rateNgn,
    bio,
    bankCode,
    accountNumber,
    accountName,
    selectedBank,
  ])

  const addSkill = React.useCallback(() => {
    const next = normalizeSkill(skillDraft)
    if (!next) return
    if (skills.length >= 8) return

    const exists = skills.some((s) => s.toLowerCase() === next.toLowerCase())
    if (exists) {
      setSkillDraft('')
      return
    }

    setSkills((prev) => [...prev, next])
    setSkillDraft('')
  }, [skillDraft, skills])

  const removeSkill = React.useCallback((skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }, [])

  const fetchBanks = React.useCallback(async () => {
    setBanksLoading(true)
    setBankError(null)

    try {
      const res = await fetch('/api/paystack/banks', { cache: 'no-store' })
      const json = (await res.json().catch(() => null)) as any

      if (!res.ok || !json?.ok) {
        setBankError(json?.error ?? 'Could not load banks')
        return
      }

      const data = Array.isArray(json?.data) ? (json.data as PaystackBank[]) : []
      setBanks(
        data
          .filter((b) => typeof b?.code === 'string' && typeof b?.name === 'string')
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
    } catch {
      setBankError('Could not load banks')
    } finally {
      setBanksLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (step === 9 && banks.length === 0 && !banksLoading) {
      void fetchBanks()
    }
  }, [step, banks.length, banksLoading, fetchBanks])

  React.useEffect(() => {
    setAccountName('')
    setBankError(null)
  }, [bankCode, accountNumber])

  const resolveAccount = React.useCallback(async () => {
    if (!bankCode || accountNumber.length !== 10) return

    setResolvingAccount(true)
    setBankError(null)

    try {
      const res = await fetch('/api/paystack/resolve-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankCode, accountNumber }),
      })

      const json = (await res.json().catch(() => null)) as any
      if (!res.ok || !json?.ok) {
        setBankError(json?.error ?? 'Could not resolve account')
        return
      }

      setAccountName(String(json?.data?.account_name ?? ''))
    } catch {
      setBankError('Could not resolve account')
    } finally {
      setResolvingAccount(false)
    }
  }, [bankCode, accountNumber])

  React.useEffect(() => {
    if (step !== 9) return
    if (!bankCode) return
    if (accountNumber.length !== 10) return
    if (resolvingAccount) return

    const t = window.setTimeout(() => {
      void resolveAccount()
    }, 350)
    return () => window.clearTimeout(t)
  }, [step, bankCode, accountNumber, resolvingAccount, resolveAccount])

  const goBack = React.useCallback(() => {
    setSubmitError(null)
    setBankError(null)

    setStep((s) => {
      const prev = Math.max(0, s - 1)
      return prev
    })
  }, [])

  const submitOnboarding = React.useCallback(async () => {
    setSubmitting(true)
    setSubmitError(null)

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      jobTitle: jobTitle.trim(),
      skills,
      experience,
      state: state.trim(),
      city: city.trim(),
      workPreference,
      availability,
      minimumRateNaira: Number.parseInt(rateNgn, 10),
      bio: bio.trim(),
      bankCode,
      bankName: selectedBank?.name ?? '',
      accountNumber,
      accountName,
      role: 'freelancer',
    }

    try {
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => null)) as any

      if (!res.ok || !json?.ok) {
        setSubmitError(json?.error ?? 'Could not submit onboarding')
        return
      }

      setDone(true)
    } catch {
      setSubmitError('Could not submit onboarding')
    } finally {
      setSubmitting(false)
    }
  }, [
    firstName,
    lastName,
    jobTitle,
    skills,
    experience,
    state,
    city,
    workPreference,
    availability,
    rateNgn,
    bio,
    bankCode,
    selectedBank,
    accountNumber,
    accountName,
  ])

  const onContinue = React.useCallback(async () => {
    if (done) {
      router.push('/dashboard')
      return
    }

    if (!canContinue) return

    if (step === totalSteps - 1) {
      await submitOnboarding()
      return
    }

    setSubmitError(null)
    setStep((s) => Math.min(totalSteps - 1, s + 1))
  }, [done, canContinue, step, totalSteps, submitOnboarding, router])

  const headerTitle = done ? 'You’re all set' : 'Onboarding'

  return (
    <div className="min-h-dvh w-full">
      <ProgressBar currentIndex={done ? totalSteps - 1 : step} total={totalSteps} />

      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 px-4 py-4 backdrop-blur">
        <button
          type="button"
          onClick={goBack}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
            (step === 0 || done) && 'pointer-events-none opacity-40',
          )}
          aria-label="Go back"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
        </button>
        <div className="text-sm font-medium">{headerTitle}</div>
        <div className="h-10 w-10" />
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${done ? totalSteps * 100 : step * 100}%)` }}
        >
          <div className="w-full shrink-0 py-10">
            <StepShell title="What’s your name?" subtitle="So your profile feels personal.">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first">First name</Label>
                  <Input
                    id="first"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. David"
                    autoComplete="given-name"
                    disabled={loadingMe}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last">Last name</Label>
                  <Input
                    id="last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Okafor"
                    autoComplete="family-name"
                    disabled={loadingMe}
                  />
                </div>
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Your role" subtitle="What do you want to be hired as?">
              <div className="grid gap-2">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Product Designer"
                  autoComplete="organization-title"
                />
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Skills" subtitle="Add up to 8 skills.">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="skill">Add a skill</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skill"
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      placeholder="e.g. Figma"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addSkill}
                      disabled={!skillDraft.trim() || skills.length >= 8}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <div
                      key={s}
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        aria-label={`Remove ${s}`}
                        className="rounded-full p-1 hover:bg-muted"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">{skills.length}/8 skills</div>
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Experience" subtitle="Pick one.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ChoiceCard
                  title="Entry"
                  description="0–1 years"
                  selected={experience === 'entry'}
                  onClick={() => setExperience('entry')}
                />
                <ChoiceCard
                  title="Intermediate"
                  description="2–4 years"
                  selected={experience === 'intermediate'}
                  onClick={() => setExperience('intermediate')}
                />
                <ChoiceCard
                  title="Expert"
                  description="5+ years"
                  selected={experience === 'expert'}
                  onClick={() => setExperience('expert')}
                />
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Location" subtitle="Where are you based?">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIA_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Ikeja"
                    autoComplete="address-level2"
                  />
                </div>
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Work preference" subtitle="How do you prefer to work?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ChoiceCard
                  title="Remote"
                  description="Work from anywhere"
                  selected={workPreference === 'remote'}
                  onClick={() => setWorkPreference('remote')}
                />
                <ChoiceCard
                  title="Hybrid"
                  description="A mix of both"
                  selected={workPreference === 'hybrid'}
                  onClick={() => setWorkPreference('hybrid')}
                />
                <ChoiceCard
                  title="On-site"
                  description="In-person"
                  selected={workPreference === 'onsite'}
                  onClick={() => setWorkPreference('onsite')}
                />
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Availability" subtitle="When can you start?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ChoiceCard
                  title="Immediately"
                  description="Ready now"
                  selected={availability === 'immediately'}
                  onClick={() => setAvailability('immediately')}
                />
                <ChoiceCard
                  title="2 weeks"
                  description="Soon"
                  selected={availability === 'two_weeks'}
                  onClick={() => setAvailability('two_weeks')}
                />
                <ChoiceCard
                  title="1 month"
                  description="Later"
                  selected={availability === 'one_month'}
                  onClick={() => setAvailability('one_month')}
                />
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Rate" subtitle="Your hourly rate in Naira.">
              <div className="grid gap-2">
                <Label htmlFor="rate">Hourly rate</Label>
                <div className="flex items-center gap-2">
                  <div className="rounded-md border px-3 py-2 text-sm">₦</div>
                  <Input
                    id="rate"
                    inputMode="numeric"
                    value={rateNgn}
                    onChange={(e) => setRateNgn(clampInt(e.target.value))}
                    placeholder="e.g. 15000"
                  />
                </div>
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell
              title="Bio"
              subtitle="Write a short intro (max 300 characters)."
            >
              <div className="grid gap-2">
                <Label htmlFor="bio">About you</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  placeholder="Tell clients what you’re great at…"
                  rows={6}
                />
                <div className="text-xs text-muted-foreground">{bio.length}/300</div>
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Bank details" subtitle="So you can get paid.">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Bank</Label>
                  <Select value={bankCode} onValueChange={setBankCode}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={banksLoading ? 'Loading banks…' : 'Select a bank'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((b) => (
                        <SelectItem key={b.code} value={b.code}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="acct">Account number</Label>
                  <Input
                    id="acct"
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(clampInt(e.target.value).slice(0, 10))}
                    placeholder="10-digit NUBAN"
                    autoComplete="off"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="acctName">Account name</Label>
                  <Input
                    id="acctName"
                    value={accountName}
                    placeholder={
                      resolvingAccount
                        ? 'Resolving…'
                        : selectedBank && accountNumber.length === 10
                          ? 'Resolved name will appear here'
                          : '—'
                    }
                    readOnly
                  />
                </div>

                {bankError ? (
                  <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
                    {bankError}
                  </div>
                ) : null}
              </div>
            </StepShell>
          </div>

          <div className="w-full shrink-0 py-10">
            <StepShell title="Done" subtitle="Your profile is ready.">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    className="h-6 w-6"
                    style={{ color: 'var(--kazi-lime)' }}
                  />
                  <div>
                    <div className="font-medium">Onboarding completed</div>
                    <div className="text-sm text-muted-foreground">You can now browse jobs.</div>
                  </div>
                </div>
              </div>
            </StepShell>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 p-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-lg items-center justify-center">
          <Button
            type="button"
            onClick={() => void onContinue()}
            disabled={!canContinue || submitting || resolvingAccount}
            className="w-full"
            style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
          >
            {done
              ? 'Go to dashboard'
              : step === totalSteps - 1
                ? submitting
                  ? 'Submitting…'
                  : 'Finish'
                : 'Continue'}
          </Button>
        </div>

        {submitError ? (
          <div className="mx-auto mt-3 w-full max-w-lg rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
            {submitError}
          </div>
        ) : null}
      </div>

      <div className="h-24" />
    </div>
  )
}
