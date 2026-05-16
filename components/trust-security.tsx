import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Shield01Icon, BankIcon, FlashIcon } from '@hugeicons/core-free-icons'

export function TrustSecurity() {
  return (
    <section id="payments" className="py-24 px-4 md:px-8 bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--kazi-lime)' }}>
            Payments
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Your money is protected. Always.
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            Kazi uses Squad to hold client payments in escrow until work is approved. No work, no payment. No exceptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto mb-16">
          {/* Item 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full flex items-center justify-center bg-[#AAFF00]/10 mb-6" style={{ backgroundColor: 'rgba(170, 255, 0, 0.1)' }}>
              <HugeiconsIcon icon={Shield01Icon} className="h-6 w-6" style={{ color: 'var(--kazi-lime)' }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Escrow protection</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Client pays before work starts. Funds are held securely until both sides are satisfied.
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full flex items-center justify-center bg-[#AAFF00]/10 mb-6" style={{ backgroundColor: 'rgba(170, 255, 0, 0.1)' }}>
              <HugeiconsIcon icon={BankIcon} className="h-6 w-6" style={{ color: 'var(--kazi-lime)' }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Direct bank transfer</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Workers get paid straight to their Nigerian bank account. No wallets, no delays.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full flex items-center justify-center bg-[#AAFF00]/10 mb-6" style={{ backgroundColor: 'rgba(170, 255, 0, 0.1)' }}>
              <HugeiconsIcon icon={FlashIcon} className="h-6 w-6" style={{ color: 'var(--kazi-lime)' }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant confirmation</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Squad webhooks confirm every payment in real time. Contracts activate automatically.
            </p>
          </div>
        </div>

        <div className="text-center text-xs font-medium text-white/40">
          Powered by Squad — Nigeria's leading payment infrastructure.
        </div>
      </div>
    </section>
  )
}
