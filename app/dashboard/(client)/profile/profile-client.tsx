'use client'

import * as React from 'react'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type PaymentRow = {
  id: string
  jobTitle: string
  amount: string
  date: string
}

export function ProfileClient(props: {
  name: string
  email: string
  companyName: string
  payments: PaymentRow[]
}) {
  const [name, setName] = React.useState(props.name)
  const [companyName, setCompanyName] = React.useState(props.companyName)

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full bg-muted" aria-hidden="true" />
        <div className="mt-4 text-xl font-semibold tracking-tight">{name}</div>
        <div className="mt-1 text-sm text-muted-foreground">{props.email}</div>
      </div>

      <div className="mt-10 space-y-8">
        <section className="rounded-xl border bg-background p-4">
          <h2 className="text-sm font-semibold tracking-tight">Account Details</h2>

          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company name</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-background p-4">
          <h2 className="text-sm font-semibold tracking-tight">Payment History</h2>

          <div className="mt-4 divide-y rounded-xl border">
            {props.payments.length ? (
              props.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 p-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{p.jobTitle}</div>
                    <div className="text-xs text-muted-foreground">{p.date}</div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{p.amount}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground">No payments yet.</div>
            )}
          </div>
        </section>

        <div className="pt-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-center rounded-xl shadow-none text-destructive hover:text-destructive hover:bg-transparent"
            onClick={() => void signOut({ callbackUrl: '/' })}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
