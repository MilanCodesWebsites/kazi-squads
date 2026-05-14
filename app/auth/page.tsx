import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Briefcase01Icon, LaptopIcon } from '@hugeicons/core-free-icons'

export default function AuthRolePage() {
  return (
    <main className="min-h-screen bg-white landing-dots">
      <header className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-black">
          <span className="text-base font-semibold">Kazi</span>
        </Link>
      </header>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
            Welcome to Kazi
          </h1>
          <p className="mt-3 text-sm md:text-base text-black/60 font-medium">
            Which describes you best?
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/auth/signin?role=client"
              className="group rounded-2xl border border-black/10 bg-white hover:border-black/20 transition p-6"
            >
              <div className="rounded-2xl bg-lime-200/60 p-10 flex items-center justify-center">
                <HugeiconsIcon icon={Briefcase01Icon} size={56} color="#111" />
              </div>
              <div className="mt-5">
                <div className="text-lg font-semibold text-black flex items-center justify-center gap-2">
                  Client <span aria-hidden="true">→</span>
                </div>
                <div className="mt-1 text-sm text-black/50">Post jobs and hire</div>
              </div>
            </Link>

            <Link
              href="/auth/signin?role=freelancer"
              className="group rounded-2xl border border-black/10 bg-white hover:border-black/20 transition p-6"
            >
              <div className="rounded-2xl bg-lime-200/60 p-10 flex items-center justify-center">
                <HugeiconsIcon icon={LaptopIcon} size={56} color="#111" />
              </div>
              <div className="mt-5">
                <div className="text-lg font-semibold text-black flex items-center justify-center gap-2">
                  Freelancer <span aria-hidden="true">→</span>
                </div>
                <div className="mt-1 text-sm text-black/50">Work and get paid</div>
              </div>
            </Link>
          </div>

          <p className="mt-12 text-sm text-black/60">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-lime-700 hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
