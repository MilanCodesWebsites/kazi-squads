import { NextResponse } from 'next/server'
import { initiateTransaction } from '@/lib/squad'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const { job_id, worker_id, amount, client_email, job_title, client_id } = await req.json()

    if (!job_id || !worker_id || !amount || !client_email || !client_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Create a contract record in Supabase with status payment_pending
    const { data: contract, error: contractErr } = await supabaseAdmin
      .from('contracts')
      .insert({
        job_id,
        worker_onboarding_id: worker_id,
        amount_naira: amount,
        status: 'payment_pending'
      })
      .select('id')
      .single()

    if (contractErr || !contract) {
      console.error('Contract creation error:', contractErr)
      return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 })
    }

    const contract_id = contract.id
    const transaction_ref = `KAZI-${contract_id}-${Date.now()}`
    
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // 2. Call Squad's initiate transaction endpoint
    const squadRes = await initiateTransaction({
      email: client_email,
      amount: amount * 100, // Squad amount is in kobo
      transaction_ref,
      callback_url: `${APP_URL}/dashboard?payment=success`,
      metadata: {
        contract_id,
        worker_id,
        client_id,
        job_title: job_title || 'Kazi Job'
      }
    })

    if (!squadRes?.data?.checkout_url) {
      console.error('Squad init error:', squadRes)
      return NextResponse.json({ error: 'Failed to initiate payment with Squad' }, { status: 500 })
    }

    // 3. Store the transaction_ref on the contract record
    await supabaseAdmin
      .from('contracts')
      .update({ squad_payment_ref: transaction_ref })
      .eq('id', contract_id)

    // Also update the job_bid to accepted since the client is paying
    await supabaseAdmin
      .from('job_bids')
      .update({ status: 'accepted' })
      .eq('job_id', job_id)
      .eq('worker_onboarding_id', worker_id)

    // Return the checkout url for redirection
    return NextResponse.json({ checkout_url: squadRes.data.checkout_url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
