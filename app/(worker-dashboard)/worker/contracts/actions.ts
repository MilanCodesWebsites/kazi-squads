'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { revalidatePath } from 'next/cache'

export async function markContractDelivered(contractId: string) {
  const ctx = await getWorkerContext()
  if (!ctx) return { error: 'Not authenticated' }

  // In a real flow, 'delivered' might be a distinct status requiring client approval.
  // Based on current schema ('active', 'completed', 'cancelled'), we'll set it to completed to reflect finishing.
  const { error } = await supabaseAdmin
    .from('contracts')
    .update({ 
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', contractId)
    .eq('worker_onboarding_id', ctx.workerOnboardingId)

  if (error) return { error: error.message }

  revalidatePath('/worker/contracts')
  return { success: true }
}
