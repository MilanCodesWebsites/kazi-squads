'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

export function AcceptButton({ 
  jobId, 
  workerId, 
  amount, 
  clientEmail, 
  jobTitle, 
  clientId 
}: { 
  jobId: string, 
  workerId: string, 
  amount: number, 
  clientEmail: string, 
  jobTitle: string, 
  clientId: string 
}) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleAcceptAndPay = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/squad/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_id: jobId,
          worker_id: workerId,
          amount,
          client_email: clientEmail,
          job_title: jobTitle,
          client_id: clientId
        })
      })
      const data = await res.json()
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        alert(data.error || 'Failed to initialize payment.')
        setIsLoading(false)
      }
    } catch (err: any) {
      alert('Network error')
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleAcceptAndPay}
      disabled={isLoading}
      className="w-full sm:w-auto rounded-xl font-bold shadow-none text-black"
      style={{ backgroundColor: 'var(--kazi-lime)' }}
    >
      {isLoading ? 'Processing...' : 'Accept & Pay'}
    </Button>
  )
}
