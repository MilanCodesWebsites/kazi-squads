'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function MarkCompleteButton({ contractId, amountText }: { contractId: string, amountText?: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)

  async function onConfirm() {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/squad/transfer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contract_id: contractId }),
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to initiate transfer')
        setLoading(false)
        return
      }

      setShowModal(false)
      router.refresh()
    } catch {
      alert('Network error')
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        className="rounded-xl shadow-none font-bold text-black"
        style={{ backgroundColor: 'var(--kazi-lime)' }}
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {loading ? 'Processing…' : 'Mark as Complete'}
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow-lg">
            <h3 className="text-lg font-bold">Are you sure?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This will release 90% of the {amountText || 'contract'} amount to the worker immediately. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)} className="rounded-xl shadow-none">
                Cancel
              </Button>
              <Button 
                onClick={() => void onConfirm()} 
                disabled={loading}
                className="rounded-xl shadow-none font-bold text-black"
                style={{ backgroundColor: 'var(--kazi-lime)' }}
              >
                {loading ? 'Confirming...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
