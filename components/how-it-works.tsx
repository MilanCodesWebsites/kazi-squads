import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkBadge01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--kazi-lime)' }}>
            How it works
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Three steps to your next job.
          </h2>
          <p className="mt-4 text-base md:text-lg text-black/60 max-w-2xl mx-auto">
            Whether you're hiring or looking for work, Kazi gets you there fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-black">Create your profile</h3>
                <p className="mt-2 text-sm text-black/60 leading-relaxed">
                  Answer a few questions. Kazi builds your professional profile and makes you visible to clients instantly.
                </p>
              </div>
              <span className="text-sm font-bold text-black/30">01</span>
            </div>
            
            <div className="mt-auto pt-8">
              <div className="h-[280px] w-full rounded-2xl border border-[#e5e5e5] bg-white shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-[#AAFF00]/20 text-black px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'var(--kazi-lime)' }}>
                  Available
                </div>
                <div className="h-16 w-16 rounded-full bg-black/5 mb-4" />
                <div className="text-lg font-bold text-black flex items-center gap-1">
                  Emeka Okafor
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} className="h-4 w-4" style={{ color: 'var(--kazi-lime)' }} />
                </div>
                <div className="text-sm text-black/50 mb-5">Graphic Designer</div>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#AAFF00]/10 text-black" style={{ backgroundColor: 'rgba(170, 255, 0, 0.15)' }}>Branding</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#AAFF00]/10 text-black" style={{ backgroundColor: 'rgba(170, 255, 0, 0.15)' }}>Illustration</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#AAFF00]/10 text-black" style={{ backgroundColor: 'rgba(170, 255, 0, 0.15)' }}>Figma</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-black">Get AI matched</h3>
                <p className="mt-2 text-sm text-black/60 leading-relaxed">
                  Our AI reads every job posted and ranks the ones most relevant to your skills. No searching, no scrolling.
                </p>
              </div>
              <span className="text-sm font-bold text-black/30">02</span>
            </div>

            <div className="mt-auto pt-8">
              <div className="h-[280px] w-full rounded-2xl border border-[#e5e5e5] bg-white shadow-sm p-4 flex flex-col gap-3 relative overflow-hidden">
                {/* Job 1 */}
                <div className="rounded-xl border border-[#e5e5e5] p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-sm text-black">Brand Identity Design</div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#AAFF00]/20 text-black" style={{ backgroundColor: 'var(--kazi-lime)' }}>94% match ✦</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full text-black/60">Design</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--kazi-lime)', textShadow: '0 0 1px rgba(0,0,0,0.8)' }}>₦150,000</span>
                  </div>
                </div>
                {/* Job 2 */}
                <div className="rounded-xl border border-[#e5e5e5] p-3 opacity-70">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-sm text-black">Social Media Graphics</div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#AAFF00]/20 text-black" style={{ backgroundColor: 'var(--kazi-lime)' }}>87% match ✦</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full text-black/60">Design</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--kazi-lime)', textShadow: '0 0 1px rgba(0,0,0,0.8)' }}>₦80,000</span>
                  </div>
                </div>
                {/* Job 3 */}
                <div className="rounded-xl border border-[#e5e5e5] p-3 opacity-40">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-sm text-black">UI/UX for Mobile App</div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#AAFF00]/20 text-black" style={{ backgroundColor: 'var(--kazi-lime)' }}>76% match ✦</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full text-black/60">Design</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--kazi-lime)', textShadow: '0 0 1px rgba(0,0,0,0.8)' }}>₦300,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-black">Get paid securely</h3>
                <p className="mt-2 text-sm text-black/60 leading-relaxed">
                  Clients pay into Squad escrow before work starts. You get paid directly to your Nigerian bank account when the job is done.
                </p>
              </div>
              <span className="text-sm font-bold text-black/30">03</span>
            </div>

            <div className="mt-auto pt-8">
              <div className="h-[280px] w-full rounded-2xl border border-[#e5e5e5] bg-white shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="h-12 w-12 rounded-full flex items-center justify-center mb-4 bg-[#AAFF00]/20" style={{ backgroundColor: 'rgba(170, 255, 0, 0.2)' }}>
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-6 w-6 text-black" style={{ color: 'var(--kazi-lime)' }} />
                </div>
                <div className="text-3xl font-bold text-black tracking-tight mb-1">₦45,000</div>
                <div className="text-sm text-black/50 mb-8">Sent to GTBank</div>
                
                <div className="mt-auto flex items-center gap-2 text-xs font-medium text-black/40">
                  <div className="h-4 w-4 bg-black/10 rounded-sm" />
                  Secured by Squad
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
