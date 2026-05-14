'use client'

import * as React from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/* ── Header ─────────────────────────────────────────── */

export function OnboardingHeader({
  onBack,
  canGoBack,
  avatarUrl,
}: {
  onBack?: () => void
  canGoBack?: boolean
  avatarUrl?: string | null
}) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-muted/40',
                !canGoBack && 'pointer-events-none opacity-30',
              )}
              aria-label="Go back"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            </button>
          ) : null}
          <Link href="/" className="text-base font-semibold tracking-tight">
            Kazi
          </Link>
        </div>

        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-muted/20">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <HugeiconsIcon icon={UserIcon} className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </header>
  )
}

/* ── Step Progress Bar (1/3 style) ──────────────────── */

export function StepProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="mb-8">
      <div className="mb-2 text-xs text-muted-foreground font-medium">
        {current}/{total}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-muted">
            {i < current && (
              <div className="h-full w-full rounded-full" style={{ backgroundColor: 'var(--kazi-lime)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Bottom Navigation Bar ──────────────────────────── */

export function BottomBar({
  left,
  right,
}: {
  left?: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>{left}</div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </div>
  )
}

/* ── Image Selection Card ───────────────────────────── */

export function ImageSelectionCard({
  label,
  description,
  icon,
  iconBg,
  selected,
  onClick,
}: {
  label: string
  description?: string
  icon: any
  iconBg: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        'cursor-pointer overflow-hidden transition-all border-2',
        selected
          ? 'border-[color:var(--kazi-lime)]'
          : 'border-transparent hover:border-muted-foreground/20',
      )}
    >
      <div className="relative">
        {/* Placeholder image area */}
        <div
          className="flex h-24 sm:h-28 items-end justify-start rounded-t-lg p-3"
          style={{ backgroundColor: iconBg }}
        >
          <HugeiconsIcon icon={icon} className="h-10 w-10 sm:h-12 sm:w-12 text-white/90" />
        </div>
        {/* Radio indicator */}
        <div className="absolute top-2.5 right-2.5">
          {selected ? (
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--kazi-lime)' }}
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5 text-black" />
            </div>
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-white/60 bg-white/30" />
          )}
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="text-sm font-medium leading-snug">{label}</div>
        {description && (
          <div className="mt-1 text-xs text-muted-foreground leading-snug">{description}</div>
        )}
      </div>
    </Card>
  )
}

/* ── Wide Selection Card (for work style stage) ─────── */

export function WideSelectionCard({
  title,
  description,
  icon,
  iconBg,
  selected,
  onClick,
}: {
  title: string
  description: string
  icon: any
  iconBg: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        'cursor-pointer overflow-hidden transition-all border-2 p-0',
        selected
          ? 'border-[color:var(--kazi-lime)]'
          : 'border-transparent hover:border-muted-foreground/20',
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <div
          className="flex h-24 sm:h-auto sm:w-32 items-center justify-center p-4"
          style={{ backgroundColor: iconBg }}
        >
          <HugeiconsIcon icon={icon} className="h-10 w-10 text-white/90" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium">{title}</div>
              <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</div>
            </div>
            <div className="mt-0.5 shrink-0">
              {selected ? (
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--kazi-lime)' }}
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5 text-black" />
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
