import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function LandingCta() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
          Ready to find work that pays?
        </h2>
        <p className="text-lg md:text-xl text-black/60 mb-10 max-w-2xl mx-auto">
          Join thousands of Nigerian professionals already on Kazi.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Button 
            asChild 
            className="rounded-full px-8 h-12 text-base font-semibold w-full sm:w-auto"
            style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
          >
            <Link href="/auth">Join as a Worker</Link>
          </Button>
          <Button 
            asChild 
            className="rounded-full px-8 h-12 text-base font-semibold w-full sm:w-auto bg-black text-white hover:bg-black/90"
          >
            <Link href="/auth">Post a Job</Link>
          </Button>
        </div>
        
        <p className="text-sm font-medium text-black/40">
          Free to join. Kazi takes 10% only when you get paid.
        </p>
      </div>
    </section>
  )
}
