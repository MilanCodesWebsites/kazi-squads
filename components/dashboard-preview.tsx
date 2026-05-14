'use client'

import Image from 'next/image'

export function DashboardPreview() {
  return (
    <section className="pb-16 md:pb-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="relative w-full h-[420px] md:h-[520px] bg-black/[0.02]">
            <Image
              src="/placeholder.jpg"
              alt="Dashboard preview"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
