'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiEditingIcon,
  ArrowLeft01Icon,
  Briefcase01Icon,
  CheckmarkCircle01Icon,
  PencilEdit01Icon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type OrgSize = 'just_me' | '2_9' | '10_99' | '100_499' | '500_4999' | '5000_plus' | ''

function stripUrl(value: string) {
  return value.trim().replace(/^https?:\/\//i, '')
}

function PillOption({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'rounded-full border px-4 py-2 text-sm transition-colors',
        selected
          ? 'border-[color:var(--kazi-lime)] bg-[color:var(--kazi-lime)]/10'
          : 'hover:border-foreground/30',
      )}
    >
      {label}
    </button>
  )
}

function SelectCard({
  title,
  description,
  icon,
  selected,
  onSelect,
}: {
  title: string
  description?: string
  icon: any
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect()
      }}
      className={cn(
        'relative p-4 sm:p-5 transition-colors',
        selected
          ? 'border-[color:var(--kazi-lime)]'
          : 'hover:border-muted-foreground/30',
      )}
      style={selected ? { boxShadow: '0 0 0 1px var(--kazi-lime) inset' } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border bg-background"
            aria-hidden="true"
          >
            <HugeiconsIcon icon={icon} className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium">{title}</div>
            {description ? (
              <div className="mt-1 text-sm text-muted-foreground">{description}</div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selected ? (
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              className="h-5 w-5"
              style={{ color: 'var(--kazi-lime)' }}
              aria-hidden="true"
            />
          ) : (
            <div className="h-5 w-5 rounded-full border" aria-hidden="true" />
          )}
        </div>
      </div>
    </Card>
  )
}

function BottomBar({
  left,
  right,
}: {
  left?: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 p-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div>{left}</div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </div>
  )
}

function Header({ onBack, canGoBack }: { onBack?: () => void; canGoBack?: boolean }) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
                !canGoBack && 'pointer-events-none opacity-40',
              )}
              aria-label="Go back"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
            </button>
          ) : null}
          <div className="text-base font-semibold">Kazi</div>
        </div>

        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background">
          <HugeiconsIcon icon={UserMultipleIcon} className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}

type ClientStep = 'business' | 'congrats'

const ORG_SIZE_OPTIONS: Array<{ value: OrgSize; label: string }> = [
  { value: 'just_me', label: 'Just me' },
  { value: '2_9', label: '2 - 9' },
  { value: '10_99', label: '10 - 99' },
  { value: '100_499', label: '100 - 499' },
  { value: '500_4999', label: '500 - 4,999' },
  { value: '5000_plus', label: '5,000+' },
]

export default function ClientOnboarding() {
  const router = useRouter()

  const [step, setStep] = React.useState<ClientStep>('business')

  const [companyName, setCompanyName] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [orgSize, setOrgSize] = React.useState<OrgSize>('')

  const goBack = React.useCallback(() => {
    if (step === 'congrats') setStep('business')
  }, [step])

  const canGoBack = step !== 'business'

  const canContinueBusiness =
    companyName.trim().length >= 2 && orgSize !== ''

  const [saving, setSaving] = React.useState(false)

  const saveProfile = React.useCallback(async () => {
    if (!canContinueBusiness) return
    setSaving(true)
    try {
      await fetch('/api/onboarding/client/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          website: website.trim() ? website.trim() : null,
          orgSize: orgSize || null,
        }),
      })
    } finally {
      setSaving(false)
    }
  }, [canContinueBusiness, companyName, website, orgSize])

  React.useEffect(() => {
    if (step !== 'congrats') return
    const t = window.setTimeout(() => router.push('/dashboard'), 1400)
    return () => window.clearTimeout(t)
  }, [step, router])

  const page = (() => {
    switch (step) {
      case 'business': {
        return (
          <main className="min-h-dvh bg-white">
            <Header onBack={goBack} canGoBack={canGoBack} />

            <section className="mx-auto w-full max-w-6xl px-4 pt-12 pb-28 md:px-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Welcome!</h1>
                <p className="mt-2 text-sm md:text-base text-muted-foreground">
                  Tell us about your business and you’ll be on your way to connect with talent.
                </p>

                <div className="mt-8 grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. MyCampus"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(stripUrl(e.target.value))}
                      placeholder="e.g. mycompany.com"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>How many people are in your organization?</Label>
                    <div className="flex flex-wrap gap-2">
                      {ORG_SIZE_OPTIONS.map((opt) => (
                        <PillOption
                          key={opt.value}
                          label={opt.label}
                          selected={orgSize === opt.value}
                          onSelect={() => setOrgSize(opt.value)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <BottomBar
              right={
                <Button
                  type="button"
                  onClick={async () => {
                    await saveProfile()
                    setStep('congrats')
                  }}
                  disabled={!canContinueBusiness}
                  className="rounded-full px-8"
                  style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
                >
                  {saving ? 'Saving…' : 'Continue'}
                </Button>
              }
            />
          </main>
        )
      }

      case 'congrats': {
        return (
          <main className="min-h-dvh bg-white">
            <Header onBack={goBack} canGoBack={canGoBack} />

            <section className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-6xl flex-col items-center justify-center px-4 pb-28 md:px-8">
              <div className="w-full max-w-3xl text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl border bg-muted/30">
                  <Image src="/placeholder.svg" alt="" width={64} height={64} className="opacity-80" />
                </div>

                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
                  You’re all set, {companyName.trim() ? companyName.trim() : 'welcome'}.
                </h1>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  Taking you to your dashboard…
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setStep('business')}
                  >
                    Edit details
                  </Button>
                  <Button
                    type="button"
                    className="rounded-full px-8"
                    style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
                    onClick={() => router.push('/dashboard')}
                  >
                    Go to dashboard
                  </Button>
                </div>
              </div>
            </section>
          </main>
        )
      }

      default:
        return null
    }
  })()

  return (
    <div>
      {page}
      <div className="h-24" />
    </div>
  )
}
