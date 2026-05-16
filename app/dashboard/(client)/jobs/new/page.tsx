'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  AiEditingIcon,
  Briefcase01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type JobStep = 'basics' | 'budget' | 'location' | 'timeline' | 'review'

type JobCategory =
  | ''
  | 'design'
  | 'tech'
  | 'writing'
  | 'trades'
  | 'events'
  | 'marketing'
  | 'admin'
  | 'other'

type BudgetMode = 'fixed' | 'range'

type LocationPreference = 'remote' | 'onsite' | 'both'

type BasicsMode = 'manual' | 'ai'

const CATEGORY_OPTIONS: Array<{ value: JobCategory; label: string }> = [
  { value: '', label: 'Select a category' },
  { value: 'design', label: 'Design' },
  { value: 'tech', label: 'Tech' },
  { value: 'writing', label: 'Writing' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'trades', label: 'Trades' },
  { value: 'events', label: 'Events' },
  { value: 'admin', label: 'Admin & Support' },
  { value: 'other', label: 'Other' },
]

function parseMoneyToNumber(value: string): number | null {
  const cleaned = value.replace(/[^0-9]/g, '')
  if (!cleaned) return null
  const num = Number.parseInt(cleaned, 10)
  return Number.isFinite(num) ? num : null
}

function formatNaira(value: number | null) {
  if (!value) return '—'
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `₦${value.toLocaleString()}`
  }
}

function BottomBar({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 p-4 backdrop-blur md:left-[240px]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div>{left}</div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </div>
  )
}

export default function NewJobPage() {
  const router = useRouter()

  const [step, setStep] = React.useState<JobStep>('basics')
  const order: JobStep[] = ['basics', 'budget', 'location', 'timeline', 'review']

  const [basicsMode, setBasicsMode] = React.useState<BasicsMode>('manual')
  const [aiPrompt, setAiPrompt] = React.useState('')
  const [aiGenerating, setAiGenerating] = React.useState(false)

  // Step 1
  const [title, setTitle] = React.useState('')
  const [category, setCategory] = React.useState<JobCategory>('')
  const [description, setDescription] = React.useState('')

  // Step 2
  const [budgetMode, setBudgetMode] = React.useState<BudgetMode>('fixed')
  const [fixedBudget, setFixedBudget] = React.useState('')
  const [budgetMin, setBudgetMin] = React.useState('')
  const [budgetMax, setBudgetMax] = React.useState('')
  const [openToNegotiation, setOpenToNegotiation] = React.useState(false)

  // Step 3
  const [locationPref, setLocationPref] = React.useState<LocationPreference>('remote')
  const [city, setCity] = React.useState('')

  // Step 4
  const [dueDate, setDueDate] = React.useState<string>('')
  const [asap, setAsap] = React.useState(false)

  const [posting, setPosting] = React.useState(false)

  const canGoBack = step !== 'basics'

  const goBack = React.useCallback(() => {
    const idx = order.indexOf(step)
    if (idx <= 0) {
      router.push('/dashboard/jobs')
      return
    }
    setStep(order[idx - 1]!)
  }, [order, router, step])

  const next = React.useCallback(() => {
    const idx = order.indexOf(step)
    if (idx < 0 || idx >= order.length - 1) return
    setStep(order[idx + 1]!)
  }, [order, step])

  const canContinueBasics = title.trim().length >= 4 && category !== '' && description.trim().length >= 20

  const fixedBudgetNumber = parseMoneyToNumber(fixedBudget)
  const budgetMinNumber = parseMoneyToNumber(budgetMin)
  const budgetMaxNumber = parseMoneyToNumber(budgetMax)

  const canContinueBudget = React.useMemo(() => {
    if (budgetMode === 'fixed') {
      return fixedBudgetNumber !== null && fixedBudgetNumber > 0
    }

    if (budgetMinNumber === null || budgetMaxNumber === null) return false
    if (budgetMinNumber <= 0) return false
    return budgetMaxNumber >= budgetMinNumber
  }, [budgetMode, fixedBudgetNumber, budgetMinNumber, budgetMaxNumber])

  const canContinueLocation = React.useMemo(() => {
    if (locationPref === 'remote') return true
    return city.trim().length >= 2
  }, [locationPref, city])

  const canContinueTimeline = React.useMemo(() => {
    return Boolean(dueDate)
  }, [dueDate])

  async function generateAiPreview() {
    const prompt = aiPrompt.trim()
    if (!prompt) return
    setAiGenerating(true)

    const fallback = () => {
      setTitle((prev) => prev || prompt.slice(0, 60))
      setCategory((prev) => (prev ? prev : 'tech'))
      setDescription((prev) =>
        prev ||
        `${prompt}\n\nDeliverables:\n- \n\nContext:\n- \n\nNice to have:\n- `,
      )
    }

    try {
      const res = await fetch('/api/ai/job-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        fallback()
        return
      }

      const data = (await res.json()) as {
        title?: string
        category?: string
        description?: string
      }

      const nextTitle = typeof data.title === 'string' ? data.title.trim() : ''
      const nextCategory = typeof data.category === 'string' ? data.category.trim() : ''
      const nextDescription = typeof data.description === 'string' ? data.description.trim() : ''

      const validCategory = CATEGORY_OPTIONS.some((opt) => opt.value === nextCategory)
        ? (nextCategory as JobCategory)
        : ''

      if (nextTitle) setTitle((prev) => prev || nextTitle)
      if (validCategory) setCategory((prev) => (prev ? prev : validCategory))
      if (nextDescription) setDescription((prev) => prev || nextDescription)

      if (!nextTitle && !nextDescription) {
        fallback()
      }
    } catch {
      fallback()
    } finally {
      setAiGenerating(false)
    }
  }

  async function postJob() {
    setPosting(true)
    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          budgetMode,
          budgetFixedNaira: budgetMode === 'fixed' ? fixedBudgetNumber : null,
          budgetMinNaira: budgetMode === 'range' ? budgetMinNumber : null,
          budgetMaxNaira: budgetMode === 'range' ? budgetMaxNumber : null,
          openToNegotiation,
          locationPreference: locationPref,
          city: locationPref === 'remote' ? null : city,
          dueDate: dueDate || null,
          asap,
          createdWithAi: basicsMode === 'ai',
          aiPrompt: basicsMode === 'ai' ? (aiPrompt.trim() || null) : null,
        }),
      })

      if (!res.ok) {
        setPosting(false)
        return
      }

      router.push('/dashboard/jobs')
    } catch {
      setPosting(false)
    }
  }

  const idx = Math.max(0, order.indexOf(step))

  return (
    <div className="min-h-[calc(100dvh-96px)]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
                !canGoBack && 'opacity-60',
              )}
              aria-label="Go back"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
            </button>
            <div>
              <div className="text-base font-semibold">Post a Job</div>
              <div className="text-xs text-muted-foreground">Step {idx + 1} of {order.length}</div>
            </div>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background" aria-hidden="true">
            <HugeiconsIcon icon={Briefcase01Icon} className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {step === 'basics' ? (
          <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Job basics</h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Keep it clear and specific — it helps workers know if they’re a fit.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={basicsMode === 'manual' ? 'default' : 'outline'}
                  className="rounded-xl shadow-none"
                  onClick={() => setBasicsMode('manual')}
                >
                  Manual
                </Button>
                <Button
                  type="button"
                  variant={basicsMode === 'ai' ? 'default' : 'outline'}
                  className="rounded-xl shadow-none"
                  onClick={() => setBasicsMode('ai')}
                >
                  AI Assist
                </Button>
              </div>

              {basicsMode === 'ai' ? (
                <div className="mt-6 rounded-xl border bg-background p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={AiEditingIcon} className="h-4 w-4" />
                        <div className="text-sm font-semibold">Describe everything</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        We’ll generate a preview job post you can edit.
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="rounded-xl shadow-none"
                      style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
                      onClick={() => void generateAiPreview()}
                      disabled={aiGenerating || !aiPrompt.trim()}
                    >
                      {aiGenerating ? 'Generating…' : 'Generate'}
                    </Button>
                  </div>

                  <div className="mt-4">
                    <Textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Explain what you need, context, deliverables, and any links/examples."
                      className="min-h-28 rounded-xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border bg-muted/10 p-4 text-sm text-muted-foreground">
                  Helper prompt: Include what you need, what “done” looks like, any examples/links, and constraints.
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Job title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Brand designer for Instagram templates"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JobCategory)}
                  className={cn(
                    'h-11 w-full rounded-xl border bg-background px-3 text-sm shadow-none outline-none',
                    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  )}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What do you need done? Be specific about deliverables, context, and any examples."
                  className="min-h-40 rounded-xl"
                />
                <div className="text-xs text-muted-foreground">
                  No character limit — the more specific you are, the better matches you get.
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {step === 'budget' ? (
          <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Budget</h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">Set a fixed amount or a range in naira.</p>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={budgetMode === 'fixed' ? 'default' : 'outline'}
                  className="rounded-xl shadow-none"
                  onClick={() => setBudgetMode('fixed')}
                >
                  Fixed
                </Button>
                <Button
                  type="button"
                  variant={budgetMode === 'range' ? 'default' : 'outline'}
                  className="rounded-xl shadow-none"
                  onClick={() => setBudgetMode('range')}
                >
                  Range
                </Button>
              </div>

              {budgetMode === 'fixed' ? (
                <div className="grid gap-2">
                  <Label htmlFor="fixedBudget">Budget (₦)</Label>
                  <div className="flex items-center gap-2">
                    <div className="rounded-md border px-3 py-2 text-sm">₦</div>
                    <Input
                      id="fixedBudget"
                      value={fixedBudget}
                      onChange={(e) => setFixedBudget(e.target.value)}
                      inputMode="numeric"
                      placeholder="e.g. 150000"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">Preview: {formatNaira(fixedBudgetNumber)}</div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Budget range (₦)</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md border px-3 py-2 text-sm">₦</div>
                        <Input
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          inputMode="numeric"
                          placeholder="Min"
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-md border px-3 py-2 text-sm">₦</div>
                        <Input
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          inputMode="numeric"
                          placeholder="Max"
                          className="h-11 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Preview: {formatNaira(budgetMinNumber)} – {formatNaira(budgetMaxNumber)}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <div className="text-sm font-medium">Open to negotiation</div>
                  <div className="text-xs text-muted-foreground">Let workers know you can flex on price.</div>
                </div>
                <Switch checked={openToNegotiation} onCheckedChange={setOpenToNegotiation} />
              </div>
            </div>
          </section>
        ) : null}

        {step === 'location' ? (
          <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Location preference</h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">Remote, on-site, or both.</p>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4">
                  <div>
                    <div className="text-sm font-medium">Remote</div>
                    <div className="text-xs text-muted-foreground">Work can be done from anywhere.</div>
                  </div>
                  <input
                    type="radio"
                    name="location"
                    value="remote"
                    checked={locationPref === 'remote'}
                    onChange={() => setLocationPref('remote')}
                    className="h-4 w-4"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4">
                  <div>
                    <div className="text-sm font-medium">On-site</div>
                    <div className="text-xs text-muted-foreground">Work happens in a specific city.</div>
                  </div>
                  <input
                    type="radio"
                    name="location"
                    value="onsite"
                    checked={locationPref === 'onsite'}
                    onChange={() => setLocationPref('onsite')}
                    className="h-4 w-4"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4">
                  <div>
                    <div className="text-sm font-medium">Both</div>
                    <div className="text-xs text-muted-foreground">Remote is okay, but on-site is possible.</div>
                  </div>
                  <input
                    type="radio"
                    name="location"
                    value="both"
                    checked={locationPref === 'both'}
                    onChange={() => setLocationPref('both')}
                    className="h-4 w-4"
                  />
                </label>
              </div>

              {locationPref === 'remote' ? null : (
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lagos"
                    className="h-11 rounded-xl"
                  />
                </div>
              )}
            </div>
          </section>
        ) : null}

        {step === 'timeline' ? (
          <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Timeline</h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">When do you need it done?</p>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="due">Due date</Label>
                <Input
                  id="due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <div className="text-sm font-medium">ASAP</div>
                  <div className="text-xs text-muted-foreground">If you need it immediately.</div>
                </div>
                <Switch checked={asap} onCheckedChange={setAsap} />
              </div>
            </div>
          </section>
        ) : null}

        {step === 'review' ? (
          <section className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Review and post</h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Your job goes live immediately and matching starts in the background.
              </p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <div className="text-lg font-semibold">{title.trim() || '—'}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? '—'}
              </div>
              <div className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{description.trim() || '—'}</div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <div className="text-xs font-medium text-muted-foreground">Budget</div>
                  <div className="mt-1 font-semibold">
                    {budgetMode === 'fixed'
                      ? formatNaira(fixedBudgetNumber)
                      : `${formatNaira(budgetMinNumber)} – ${formatNaira(budgetMaxNumber)}`}
                  </div>
                  {openToNegotiation ? <div className="mt-1 text-xs text-muted-foreground">Open to negotiation</div> : null}
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-xs font-medium text-muted-foreground">Location</div>
                  <div className="mt-1 font-semibold">
                    {locationPref === 'remote'
                      ? 'Remote'
                      : locationPref === 'onsite'
                        ? `On-site (${city.trim() || '—'})`
                        : `Both (On-site in ${city.trim() || '—'})`}
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-xs font-medium text-muted-foreground">Timeline</div>
                  <div className="mt-1 font-semibold">{dueDate || '—'}</div>
                  {asap ? <div className="mt-1 text-xs text-muted-foreground">ASAP</div> : null}
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-xs font-medium text-muted-foreground">Created with</div>
                  <div className="mt-1 font-semibold">{basicsMode === 'ai' ? 'AI Assist' : 'Manual'}</div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {step === 'basics' ? (
        <BottomBar
          left={
            <Button
              type="button"
              variant="outline"
              className="rounded-xl shadow-none"
              onClick={() => router.push('/dashboard/jobs')}
            >
              Cancel
            </Button>
          }
          right={
            <Button
              type="button"
              className="rounded-xl px-8 shadow-none"
              style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
              disabled={!canContinueBasics}
              onClick={next}
            >
              Next
            </Button>
          }
        />
      ) : step === 'budget' ? (
        <BottomBar
          left={
            <Button type="button" variant="outline" className="rounded-xl shadow-none" onClick={goBack}>
              Back
            </Button>
          }
          right={
            <Button
              type="button"
              className="rounded-xl px-8 shadow-none"
              style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
              disabled={!canContinueBudget}
              onClick={next}
            >
              Next
            </Button>
          }
        />
      ) : step === 'location' ? (
        <BottomBar
          left={
            <Button type="button" variant="outline" className="rounded-xl shadow-none" onClick={goBack}>
              Back
            </Button>
          }
          right={
            <Button
              type="button"
              className="rounded-xl px-8 shadow-none"
              style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
              disabled={!canContinueLocation}
              onClick={next}
            >
              Next
            </Button>
          }
        />
      ) : step === 'timeline' ? (
        <BottomBar
          left={
            <Button type="button" variant="outline" className="rounded-xl shadow-none" onClick={goBack}>
              Back
            </Button>
          }
          right={
            <Button
              type="button"
              className="rounded-xl px-8 shadow-none"
              style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
              disabled={!canContinueTimeline}
              onClick={next}
            >
              Next
            </Button>
          }
        />
      ) : (
        <BottomBar
          left={
            <Button type="button" variant="outline" className="rounded-xl shadow-none" onClick={goBack}>
              Back
            </Button>
          }
          right={
            <Button
              type="button"
              className="rounded-xl px-8 shadow-none"
              style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
              disabled={posting}
              onClick={() => void postJob()}
            >
              {posting ? 'Posting…' : 'Post Job'}
            </Button>
          }
        />
      )}

      <div className="h-24" />
    </div>
  )
}
