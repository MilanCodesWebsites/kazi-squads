import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY!

function verifySquadWebhook(rawBody: string, signature: string, secret: string): boolean {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex')
  return hash.toUpperCase() === signature.toUpperCase()
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-squad-encrypted-body')
    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 401 })
    }

    const rawBody = await req.text()
    
    if (!verifySquadWebhook(rawBody, signature, SQUAD_SECRET_KEY)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)

    // Check event type
    if (payload.Event === 'charge_successful') {
      const transaction_ref = payload.Body.transaction_ref
      const squad_transaction_ref = payload.Body.transaction_id

      // Find the contract in Supabase where squad_payment_ref = transaction_ref
      const { data: contract } = await supabaseAdmin
        .from('contracts')
        .select('id, worker_onboarding_id, job:jobs(title)')
        .eq('squad_payment_ref', transaction_ref)
        .single()

      if (contract) {
        const jobTitle = (contract.job as any)?.title || 'your job'

        // Update contract status to active and store squad transaction ref
        await supabaseAdmin
          .from('contracts')
          .update({
            status: 'active',
            squad_transaction_ref: squad_transaction_ref,
            started_at: new Date().toISOString()
          })
          .eq('id', contract.id)

        // Create a notification for the worker
        if (contract.worker_onboarding_id) {
          await supabaseAdmin
            .from('notifications')
            .insert({
              user_id: contract.worker_onboarding_id,
              type: 'payment_confirmed',
              message: `Payment confirmed. Your contract for ${jobTitle} is now active. Get to work!`
            })
        }
      }
    }

    // Return 200 immediately.
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
