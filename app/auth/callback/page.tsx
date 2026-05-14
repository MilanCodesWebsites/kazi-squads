'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') ?? 'magiclink'
  const role = searchParams.get('role')

  const redirectTo = useMemo(() => {
    if (role === 'client') return '/dashboard/onboarding/client'
    if (role === 'freelancer') return '/dashboard/onboarding/freelancer'
    return '/dashboard/onboarding/freelancer'
  }, [role])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!tokenHash) {
        setError('Missing token in callback URL.')
        return
      }

      const res = await fetch('/api/auth/email/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token_hash: tokenHash, type }),
      })

      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null

      if (cancelled) return

      if (!res.ok || !json?.ok) {
        setError(json?.error ?? 'Could not verify magic link.')
        return
      }

      setDone(true)
      router.replace(redirectTo)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [router, tokenHash, type, redirectTo])

  return (
    <main className="min-h-screen bg-white landing-dots flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-black">Signing you in…</h1>
        <p className="mt-2 text-sm text-black/60">
          {done ? 'Redirecting…' : 'Verifying your magic link.'}
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="mt-5 text-sm text-black/60">
          <Link href="/auth" className="text-lime-700 hover:underline font-semibold">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
