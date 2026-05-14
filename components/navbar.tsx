'use client'

import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserMultipleIcon } from '@hugeicons/core-free-icons'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/90 border-b border-black/5 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center">
            <HugeiconsIcon icon={UserMultipleIcon} size={18} color="currentColor" aria-hidden="true" />
          </div>
          <span className="text-base font-semibold text-black">Remote</span>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#about" className="text-sm font-medium text-black/70 hover:text-black transition">
            About
          </Link>
          <Link href="#feature" className="text-sm font-medium text-black/70 hover:text-black transition">
            Feature
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-black/70 hover:text-black transition">
            Pricing
          </Link>
          <Link href="#contact" className="text-sm font-medium text-black/70 hover:text-black transition">
            Contact
          </Link>
          <Link href="#blog" className="text-sm font-medium text-black/70 hover:text-black transition">
            Blog
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          <Button asChild className="rounded-full bg-black text-white hover:bg-black/90 px-5">
            <Link href="/auth">Sign in</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
