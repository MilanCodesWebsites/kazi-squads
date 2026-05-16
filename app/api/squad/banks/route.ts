import { NextResponse } from 'next/server'
import { getBankList } from '@/lib/squad'

export async function GET() {
  try {
    const banks = await getBankList()
    return NextResponse.json(banks)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
