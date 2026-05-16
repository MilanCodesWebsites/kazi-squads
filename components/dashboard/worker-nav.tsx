'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  Briefcase01Icon,
  File01Icon,
  House01Icon,
  UserIcon,
  Search01Icon
} from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { NotificationBell } from './notification-bell'

type NavItem = {
  href: string
  label: string
  icon: any
  match: (pathname: string) => boolean
}

const NAV: NavItem[] = [
  {
    href: '/worker',
    label: 'Home',
    icon: House01Icon,
    match: (p) => p === '/worker',
  },
  {
    href: '/worker/jobs',
    label: 'Jobs',
    icon: Search01Icon,
    match: (p) => p.startsWith('/worker/jobs') && !p.startsWith('/worker/applications'),
  },
  {
    href: '/worker/applications',
    label: 'Applications',
    icon: Briefcase01Icon,
    match: (p) => p.startsWith('/worker/applications'),
  },
  {
    href: '/worker/contracts',
    label: 'Contracts',
    icon: File01Icon,
    match: (p) => p.startsWith('/worker/contracts'),
  },
  {
    href: '/worker/profile',
    label: 'Profile',
    icon: UserIcon,
    match: (p) => p.startsWith('/worker/profile'),
  },
]

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors',
        active ? 'bg-muted/30' : 'hover:bg-muted/20',
      )}
      style={
        active
          ? {
              boxShadow: 'inset 3px 0 0 0 var(--kazi-lime)',
            }
          : undefined
      }
    >
      <HugeiconsIcon icon={item.icon} className={cn('h-5 w-5', active ? '' : 'text-muted-foreground')} style={active ? { color: 'var(--kazi-lime)' } : undefined} />
      <span className={cn(active ? '' : 'text-foreground')}>{item.label}</span>
    </Link>
  )
}

function BottomTab({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
    >
      <HugeiconsIcon
        icon={item.icon}
        className="h-5 w-5"
        style={active ? { color: 'var(--kazi-lime)' } : { color: 'var(--foreground)' }}
      />
      <span
        className={cn('text-[11px] leading-none', active ? '' : 'text-foreground')}
        style={active ? { color: 'var(--kazi-lime)' } : undefined}
      >
        {item.label}
      </span>
    </Link>
  )
}

export function WorkerNav() {
  const pathnameRaw = usePathname() || '/worker'
  const pathname = pathnameRaw.endsWith('/') && pathnameRaw !== '/' ? pathnameRaw.slice(0, -1) : pathnameRaw

  const hideBottomNav = pathname.includes('/apply')

  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
  const [profileId, setProfileId] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json: any) => {
        if (json?.user?.image) setAvatarUrl(json.user.image)
        if (json?.roles?.workerProfileId) setProfileId(json.roles.workerProfileId)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-[240px] md:flex-col md:border-r md:bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="text-lg font-semibold tracking-tight">Kazi.</div>
          <div className="flex items-center gap-3">
            {profileId && <NotificationBell userId={profileId} />}
            {avatarUrl ? (
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border">
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : null}
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {NAV.map((item) => {
            const active = item.match(pathname)
            return <SidebarLink key={item.href} item={item} active={active} />
          })}
        </nav>
      </aside>

      {hideBottomNav ? null : (
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background md:hidden">
          <div className="mx-auto flex h-16 max-w-5xl items-stretch">
            {NAV.map((item) => {
              const active = item.match(pathname)
              if (item.label === 'Profile' && avatarUrl) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
                  >
                    <div className={cn(
                      'flex h-5 w-5 items-center justify-center overflow-hidden rounded-full',
                      active ? 'ring-2' : '',
                    )} style={active ? { ringColor: 'var(--kazi-lime)' } : undefined}>
                      <img src={avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span
                      className={cn('text-[11px] leading-none', active ? '' : 'text-foreground')}
                      style={active ? { color: 'var(--kazi-lime)' } : undefined}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              }
              return <BottomTab key={item.href} item={item} active={active} />
            })}
          </div>
        </nav>
      )}
    </>
  )
}
