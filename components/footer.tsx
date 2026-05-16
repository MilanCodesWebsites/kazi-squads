import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e5e5e5] px-4 md:px-8">
      <div className="max-w-6xl mx-auto py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-bold text-black mb-4 inline-block">
              Kazi.
            </Link>
            <p className="text-sm text-black/80 font-medium mb-2">
              Nigeria's AI-powered freelance marketplace.
            </p>
            <p className="text-sm text-black/50">
              Built for the informal economy.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-black">Platform</h4>
            <Link href="#how-it-works" className="text-sm text-black/60 hover:text-black transition-colors">How it Works</Link>
            <Link href="/auth" className="text-sm text-black/60 hover:text-black transition-colors">Find Work</Link>
            <Link href="/auth" className="text-sm text-black/60 hover:text-black transition-colors">Post a Job</Link>
            <Link href="#payments" className="text-sm text-black/60 hover:text-black transition-colors">Pricing</Link>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-black">Company</h4>
            <Link href="#platform" className="text-sm text-black/60 hover:text-black transition-colors">About</Link>
            <Link href="#" className="text-sm text-black/60 hover:text-black transition-colors">Blog</Link>
            <Link href="#" className="text-sm text-black/60 hover:text-black transition-colors">Careers</Link>
            <Link href="#" className="text-sm text-black/60 hover:text-black transition-colors">Contact</Link>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-black">Legal</h4>
            <Link href="#" className="text-sm text-black/60 hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-black/60 hover:text-black transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-black/60 hover:text-black transition-colors">Cookie Policy</Link>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="mt-16 pt-8 border-t border-[#e5e5e5] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-black/50">
            © 2026 Kazi. All rights reserved.
          </div>
          <div className="text-sm font-medium text-black/50">
            Powered by Squad • Built by Prince
          </div>
        </div>
      </div>
    </footer>
  )
}
