'use client'

import React from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Home01Icon, 
  Briefcase02Icon, 
  File01Icon, 
  UserCircleIcon,
  Search01Icon
} from '@hugeicons/core-free-icons'

export function DashboardPreview() {
  return (
    <section id="platform" className="w-full bg-[#f9f9f9] py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-5/12 flex flex-col items-start text-left">
          <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--kazi-lime)' }}>
            The Platform
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-5">
            Everything you need, nothing you don't.
          </h2>
          <p className="text-base md:text-lg text-black/60 mb-8 leading-relaxed">
            A clean, fast dashboard built for workers and clients. See your matches, manage contracts, and track payments in one place.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/auth" className="inline-flex items-center text-sm font-bold transition-opacity hover:opacity-80" style={{ color: 'var(--kazi-lime)' }}>
              Worker dashboard →
            </Link>
            <Link href="/auth" className="inline-flex items-center text-sm font-bold transition-opacity hover:opacity-80" style={{ color: 'var(--kazi-lime)' }}>
              Client dashboard →
            </Link>
          </div>
        </div>

        {/* Right Side: Inline UI Mock */}
        <div className="w-full lg:w-7/12 relative">
          {/* Outer container */}
          <div className="rounded-[2rem] border border-black/5 bg-white shadow-xl overflow-hidden aspect-[4/3] flex flex-col text-left select-none relative z-10 w-full max-w-[800px] ml-auto">
            
            {/* Top Nav Mock */}
            <div className="h-14 border-b border-[#e5e5e5] flex items-center justify-between px-6 shrink-0 bg-white">
              <div className="font-bold text-lg text-black">Kazi.</div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <HugeiconsIcon icon={Search01Icon} className="absolute left-2.5 top-1.5 h-4 w-4 text-black/40" />
                  <div className="h-7 w-48 rounded-full border border-[#e5e5e5] bg-black/5" />
                </div>
                <div className="h-7 w-7 rounded-full bg-black/10" />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Mock */}
              <div className="w-16 md:w-48 border-r border-[#e5e5e5] bg-[#fafafa] flex flex-col p-4 gap-2 shrink-0 hidden sm:flex">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-[#AAFF00]/20 text-black">
                  <HugeiconsIcon icon={Home01Icon} className="h-4 w-4 shrink-0" style={{ color: 'var(--kazi-lime)' }} />
                  <span className="text-sm font-semibold hidden md:block">Home</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-2 text-black/60 hover:bg-black/5 rounded-lg">
                  <HugeiconsIcon icon={Briefcase02Icon} className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium hidden md:block">Jobs</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-2 text-black/60 hover:bg-black/5 rounded-lg">
                  <HugeiconsIcon icon={File01Icon} className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium hidden md:block">Contracts</span>
                </div>
                <div className="mt-auto flex items-center gap-3 px-2 py-2 text-black/60 hover:bg-black/5 rounded-lg">
                  <HugeiconsIcon icon={UserCircleIcon} className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium hidden md:block">Profile</span>
                </div>
              </div>

              {/* Main Content Mock */}
              <div className="flex-1 bg-white p-6 md:p-8 overflow-hidden relative">
                <h3 className="text-2xl font-bold text-black mb-1">Good morning, Emeka!</h3>
                <p className="text-sm text-black/50 mb-6">Here are the best jobs for your skills today.</p>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                  <div className="rounded-xl border border-[#e5e5e5] p-3">
                    <div className="text-[10px] text-black/50 uppercase tracking-wider font-bold mb-1">Profile Views</div>
                    <div className="text-xl font-bold text-black">48</div>
                  </div>
                  <div className="rounded-xl border border-[#e5e5e5] p-3">
                    <div className="text-[10px] text-black/50 uppercase tracking-wider font-bold mb-1">Applied</div>
                    <div className="text-xl font-bold text-black">7</div>
                  </div>
                  <div className="rounded-xl border border-[#e5e5e5] p-3 hidden md:block">
                    <div className="text-[10px] text-black/50 uppercase tracking-wider font-bold mb-1">Contracts</div>
                    <div className="text-xl font-bold text-black">1</div>
                  </div>
                  <div className="rounded-xl border border-[#e5e5e5] p-3 hidden md:block">
                    <div className="text-[10px] text-black/50 uppercase tracking-wider font-bold mb-1">Earned</div>
                    <div className="text-xl font-bold text-black">₦85,000</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-sm font-bold text-black">Recommended Jobs</h4>
                  <div className="px-2 py-0.5 rounded bg-[#AAFF00]/20 text-black text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--kazi-lime)' }}>
                    AI Matched
                  </div>
                </div>

                {/* Job Cards */}
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-[#e5e5e5] p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-black">Senior UI Designer</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded text-black/60">Design</span>
                        <span className="text-[10px] text-black/40">• Remote</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: 'var(--kazi-lime)', textShadow: '0 0 1px rgba(0,0,0,0.8)' }}>₦450,000</div>
                  </div>
                  
                  <div className="rounded-xl border border-[#e5e5e5] p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 opacity-80">
                    <div>
                      <div className="font-bold text-sm text-black">Frontend Webflow Dev</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded text-black/60">Development</span>
                        <span className="text-[10px] text-black/40">• Lagos</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: 'var(--kazi-lime)', textShadow: '0 0 1px rgba(0,0,0,0.8)' }}>₦200,000</div>
                  </div>
                </div>
                
                {/* Fade out bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Decorative background blobs to make it pop slightly */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] bg-[#AAFF00]/5 blur-3xl rounded-full -z-0" />
        </div>
        
      </div>
    </section>
  )
}
