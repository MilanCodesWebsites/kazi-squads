'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export function MarkCompleteButton({ contractId }: { contractId: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  async function onClick() {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/contracts/mark-complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contractId }),
      })

      if (!res.ok) {
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      className="rounded-xl shadow-none"
      style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
      onClick={() => void onClick()}
      disabled={loading}
    >
      {loading ? 'Marking…' : 'Mark as Complete'}
    </Button>
  )
}
