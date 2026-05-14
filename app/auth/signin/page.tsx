'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AuthSignInPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [emailError, setEmailError] = useState<string | null>(null)

  const title = role === 'freelancer' ? 'Sign up to find work' : 'Sign up to hire talent'

  const callbackUrl = useMemo(() => {
    if (role === 'client') return '/dashboard/onboarding/client'
    if (role === 'freelancer') return '/dashboard/onboarding/freelancer'
    return '/dashboard/onboarding/freelancer'
  }, [role])

  async function sendMagicLink() {
    setEmailError(null)
    setEmailStatus('loading')

    const res = await fetch('/api/auth/email/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, role }),
    })

    const json = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null

    if (!res.ok || !json?.ok) {
      setEmailStatus('error')
      setEmailError(json?.error ?? 'Could not send magic link.')
      return
    }

    setEmailStatus('sent')
  }

  return (
    <main className="min-h-screen bg-white landing-dots">
      <header className="max-w-6xl mx-auto px-4 md:px-8 pt-6 flex items-center justify-between">
        <Link href="/" className="text-black text-base font-semibold">
          Kazi
        </Link>
        <div className="text-sm text-black/60">
          {role === 'freelancer' ? (
            <Link href="/auth?role=client" className="hover:underline">
              Looking to hire? <span className="text-lime-700 font-semibold">Continue as client</span>
            </Link>
          ) : (
            <Link href="/auth?role=freelancer" className="hover:underline">
              Looking for work? <span className="text-lime-700 font-semibold">Apply as talent</span>
            </Link>
          )}
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-center text-black">
            {title}
          </h1>

          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
            <div className="grid gap-3">
              <Button
                type="button"
                className="w-full rounded-full h-11 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => signIn('google', { callbackUrl })}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-white flex items-center justify-center">
                    <Image src="/google.svg" alt="Google" width={18} height={18} />
                  </span>
                  Continue with Google
                </span>
              </Button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-black/10" />
                <div className="text-xs font-semibold text-black/40">or</div>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-black">Email address</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailStatus !== 'idle') setEmailStatus('idle')
                  }}
                  className="h-11 rounded-xl"
                  autoComplete="email"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full h-11"
                  disabled={!email.trim() || emailStatus === 'loading'}
                  onClick={sendMagicLink}
                >
                  {emailStatus === 'loading' ? 'Sending…' : 'Email me a sign-in link'}
                </Button>

                {emailStatus === 'sent' && (
                  <div className="rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/70">
                    Check your email for a sign-in link.
                  </div>
                )}

                {emailStatus === 'error' && emailError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {emailError}
                  </div>
                )}
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-black/60">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>

            <p className="mt-6 text-center text-sm text-black/60">
              <Link href="/auth" className="text-lime-700 hover:underline font-semibold">
                Back
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
