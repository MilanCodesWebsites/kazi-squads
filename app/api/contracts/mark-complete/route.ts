import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { getClientContext } from '@/lib/dashboard/client-context'

type Payload = {
  contractId: string
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(req: Request) {
  const ctx = await getClientContext()
  if (!ctx) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const payload = (await req.json().catch(() => null)) as Payload | null
  if (!payload?.contractId?.trim()) return badRequest('contractId is required')

  const { data: contract, error } = await supabaseAdmin
    .from('contracts')
    .select('id, status, job_id, job:jobs(client_profile_id, title)')
    .eq('id', payload.contractId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!contract) return NextResponse.json({ error: 'Contract not found' }, { status: 404 })

  const job = (contract as any).job
  if (!job || String(job.client_profile_id) !== String(ctx.clientProfileId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if ((contract as any).status === 'completed') {
    return NextResponse.json({ ok: true })
  }

  const { error: updateErr } = await supabaseAdmin
    .from('contracts')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', payload.contractId)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  await supabaseAdmin.from('client_activity').insert({
    client_profile_id: ctx.clientProfileId,
    type: 'contract_completed',
    message: `Contract completed: ${String(job.title ?? 'Job')}`,
  })

  return NextResponse.json({ ok: true })
}
