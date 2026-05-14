import { NextResponse } from 'next/server'

export async function GET() {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return NextResponse.json(
      { error: 'Missing PAYSTACK_SECRET_KEY' },
      { status: 500 },
    )
  }

  const url = new URL('https://api.paystack.co/bank')
  url.searchParams.set('country', 'nigeria')
  url.searchParams.set('perPage', '200')

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
      { error: json?.message ?? 'Could not load banks' },
      { status: 400 },
    )
  }

  return NextResponse.json({ ok: true, data: json.data })
}
