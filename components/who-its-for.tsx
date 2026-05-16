import React from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'

export function WhoItsFor() {
  return (
    <section id="who-its-for" className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--kazi-lime)' }}>
            Who it's for
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Built for anyone who's tired of WhatsApp referrals.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: For Workers */}
          <div className="flex flex-col h-full rounded-2xl border border-[#e5e5e5] bg-white p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: 'var(--kazi-lime)' }} />
            
            <h3 className="text-2xl font-bold text-black mb-4">For Workers</h3>
            <p className="text-base text-black/60 leading-relaxed mb-8">
              You have the skills. Kazi gives you the visibility, the clients, and the payment protection you deserve.
            </p>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                "AI-matched job recommendations",
                "Professional profile in minutes",
                "Secure payment before you start",
                "Direct bank transfer when you finish"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--kazi-lime)' }} />
                  <span className="text-sm font-medium text-black/80">{item}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/auth" 
              className="mt-auto text-sm font-bold transition-opacity hover:opacity-80 inline-flex"
              style={{ color: 'var(--kazi-lime)' }}
            >
              Join as a Worker →
            </Link>
          </div>

          {/* Card 2: For Clients */}
          <div className="flex flex-col h-full rounded-2xl border border-[#e5e5e5] bg-white p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-black" />
            
            <h3 className="text-2xl font-bold text-black mb-4">For Clients</h3>
            <p className="text-base text-black/60 leading-relaxed mb-8">
              Stop asking around on WhatsApp. Post a job, see ranked candidates, pay securely.
            </p>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                "Post a job in under 2 minutes",
                "AI-ranked worker matches",
                "Pay only when satisfied",
                "Squad-secured transactions"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--kazi-lime)' }} />
                  <span className="text-sm font-medium text-black/80">{item}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/auth" 
              className="mt-auto text-sm font-bold text-black transition-opacity hover:opacity-80 inline-flex"
            >
              Post a Job →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
