'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { markContractDelivered } from './actions'

export function DeliverButton({ contractId }: { contractId: string }) {
  const [isPending, setIsPending] = React.useState(false)

  const handleDeliver = async () => {
    setIsPending(true)
    const result = await markContractDelivered(contractId)
    setIsPending(false)
    if (result.error) {
      alert(result.error)
    }
  }

  return (
    <Button 
      onClick={handleDeliver}
      disabled={isPending}
      className="w-full sm:w-auto rounded-xl font-bold text-black disabled:opacity-50" 
      style={{ backgroundColor: 'var(--kazi-lime)' }}
    >
      {isPending ? 'Processing...' : 'Mark as Delivered'}
    </Button>
  )
}
