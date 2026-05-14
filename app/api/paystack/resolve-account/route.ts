import { NextResponse } from 'next/server'

type Body = { bankCode?: string; accountNumber?: string }

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return NextResponse.json(
      { error: 'Missing PAYSTACK_SECRET_KEY' },
      { status: 500 },
    )
  }

  const body = (await req.json().catch(() => null)) as Body | null
  const bankCode = body?.bankCode
  const accountNumber = body?.accountNumber

  if (!bankCode) {
    return NextResponse.json({ error: 'bankCode is required' }, { status: 400 })
  }

  if (!accountNumber || !/^[0-9]{10}$/.test(accountNumber)) {
    return NextResponse.json(
      { error: 'accountNumber must be 10 digits' },
      { status: 400 },
    )
  }

  const url = new URL('https://api.paystack.co/bank/resolve')
  url.searchParams.set('account_number', accountNumber)
  url.searchParams.set('bank_code', bankCode)

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
    },
    cache: 'no-store',
  })

  const json = (await res.json().catch(() => null)) as any

  if (!res.ok || !json?.status) {
    return NextResponse.json(
      { error: json?.message ?? 'Could not resolve account' },
      { status: 400 },
    )
  }

  return NextResponse.json({ ok: true, data: json.data })
}
