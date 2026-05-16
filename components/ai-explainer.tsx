import React from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Setup02Icon, Location04Icon, SparklesIcon } from '@hugeicons/core-free-icons'

export function AiExplainer() {
  return (
    <section id="ai-matching" className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--kazi-lime)' }}>
            AI Powered
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            The right jobs find you.
          </h2>
          <p className="mt-4 text-base md:text-lg text-black/60 max-w-2xl mx-auto">
            Kazi's AI reads your profile and every job posted, then ranks opportunities by how well they match your skills, location, and experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8">
            <HugeiconsIcon icon={Setup02Icon} className="h-8 w-8 mb-6" style={{ color: 'var(--kazi-lime)' }} />
            <h3 className="text-lg font-bold text-black mb-3">Skill matching</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              Gemini compares your skills against every job description and scores compatibility in real time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8">
            <HugeiconsIcon icon={Location04Icon} className="h-8 w-8 mb-6" style={{ color: 'var(--kazi-lime)' }} />
            <h3 className="text-lg font-bold text-black mb-3">Location aware</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              Remote jobs match everyone. On-site jobs are prioritised for workers in the right city.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8">
            <HugeiconsIcon icon={SparklesIcon} className="h-8 w-8 mb-6" style={{ color: 'var(--kazi-lime)' }} />
            <h3 className="text-lg font-bold text-black mb-3">Gets smarter</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              The more you use Kazi, the better the matches get. Every completed job improves your profile signal.
            </p>
          </div>
        </div>

        {/* Callout Box */}
        <div className="max-w-4xl mx-auto bg-[#0a0a0a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: 'var(--kazi-lime)' }} />
          <p className="text-white text-base md:text-lg font-medium leading-relaxed pl-4 md:pl-6 flex-1">
            "When you apply, our AI helps you write a cover letter tailored to the specific job. One click, fully editable."
          </p>
          <Link 
            href="/auth" 
            className="shrink-0 text-sm font-bold tracking-wide transition-opacity hover:opacity-80 px-4 py-2" 
            style={{ color: 'var(--kazi-lime)' }}
          >
            Try it →
          </Link>
        </div>
      </div>
    </section>
  )
}
