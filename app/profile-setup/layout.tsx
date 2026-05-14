import * as React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile Setup - Kazi',
  description: 'Complete your Kazi freelancer profile.',
}

export default function ProfileSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-white font-sans text-black">
      {children}
    </div>
  )
}
