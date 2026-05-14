'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="pt-28 md:pt-32 pb-10 md:pb-14 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center pt-10 md:pt-14 lg:pt-16">
          <div className="flex justify-center mb-7">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 hover:text-black transition"
            >
              <span className="inline-flex items-center rounded-full bg-lime-300/70 px-2 py-0.5 text-xs font-semibold text-black">
                New
              </span>
              <span className="font-medium">Announcing our $2.3M Seed Round</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-black leading-[1.05]">
            Say hello to
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">smarter</span>
              <span className="absolute left-0 right-0 bottom-[0.18em] h-[0.55em] bg-lime-300/70 -z-0 rounded-sm" />
            </span>{' '}
            <span className="font-normal text-black/90">hiring</span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-black/60 font-medium">
            A hiring platform that works the way you do.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" className="rounded-full px-6 h-11">
              Try for free
            </Button>
            <Button className="rounded-full bg-black text-white hover:bg-black/90 px-6 h-11">
              Get a demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
