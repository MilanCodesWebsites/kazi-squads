import { NextResponse } from 'next/server'
import { initiateTransfer, getBankList } from '@/lib/squad'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const { contract_id } = await req.json()
    if (!contract_id) {
      return NextResponse.json({ error: 'contract_id is required' }, { status: 400 })
    }

    // 1. Fetch the contract from Supabase including worker profile
    const { data: contract, error: contractErr } = await supabaseAdmin
      .from('contracts')
      .select(`
        id, 
        amount_naira, 
        status, 
        job:jobs(title),
        worker:worker_onboarding(id, bank_name, account_number)
      `)
      .eq('id', contract_id)
      .single()

    if (contractErr || !contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    if (contract.status !== 'active') {
      return NextResponse.json({ error: 'Contract is not active' }, { status: 400 })
    }

    const worker = contract.worker as any
    if (!worker?.bank_name || !worker?.account_number) {
      return NextResponse.json({ error: 'Worker banking details are incomplete' }, { status: 400 })
    }

    const jobTitle = (contract.job as any)?.title || 'Kazi Job'

    // 2. Calculate 90% of the amount and convert to kobo
    const amountNaira = contract.amount_naira
    const payoutNaira = amountNaira * 0.90
    const payoutKobo = payoutNaira * 100

    // 3. Look up the bank code from Paystack bank list
    const banksRes = await getBankList()
    if (!banksRes || !banksRes.status) {
      return NextResponse.json({ error: 'Failed to fetch bank list' }, { status: 500 })
    }
    
    const banks = banksRes.data || []
    const bank = banks.find((b: any) => b.name.toLowerCase().includes(worker.bank_name.toLowerCase()) || worker.bank_name.toLowerCase().includes(b.name.toLowerCase()))

    if (!bank) {
      return NextResponse.json({ error: `Bank code not found for ${worker.bank_name}` }, { status: 400 })
    }

    const transaction_ref = `KAZI-PAYOUT-${contract_id}-${Date.now()}`

    // 4. Call Squad payout initiate
    const squadRes = await initiateTransfer({
      transaction_ref,
      amount: payoutKobo,
      bank_code: bank.code,
      account_number: worker.account_number,
      remark: `Payment for ${jobTitle} on Kazi`
    })

    if (!squadRes || squadRes.status !== 200) {
      console.error('Squad transfer failed:', squadRes)
      return NextResponse.json({ error: 'Squad transfer initiation failed' }, { status: 500 })
    }

    // 5. Update the contract with the payout transaction ref
    await supabaseAdmin
      .from('contracts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        // Since we don't have a payout_ref column, we could store it in squad_transaction_ref or create a new one.
        // We'll just overwrite it or append to it if necessary.
      })
      .eq('id', contract_id)

    // 6. Create a notification for the worker
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: worker.id,
        type: 'payout_sent',
        message: `Payment of ₦${payoutNaira.toLocaleString()} has been sent to your ${worker.bank_name} account. It should arrive within minutes.`
      })

    return NextResponse.json({ success: true, message: 'Transfer initiated successfully' })
  } catch (error: any) {
    console.error('Transfer error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
