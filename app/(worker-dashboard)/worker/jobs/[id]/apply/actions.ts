'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { getWorkerContext } from '@/lib/dashboard/worker-context'
import { revalidatePath } from 'next/cache'

export async function submitApplication(jobId: string, formData: FormData) {
  const ctx = await getWorkerContext()
  if (!ctx) {
    return { error: 'Not authenticated' }
  }

  const coverLetter = formData.get('coverLetter') as string
  const rateStr = formData.get('rate') as string
  const rateNaira = parseInt(rateStr.replace(/,/g, ''), 10)

  if (!coverLetter || isNaN(rateNaira)) {
    return { error: 'Invalid input' }
  }

  // The job_bids table expects: job_id, worker_onboarding_id, bid_amount_naira, message, status
  const { error } = await supabaseAdmin.from('job_bids').insert({
    job_id: jobId,
    worker_onboarding_id: ctx.workerOnboardingId,
    bid_amount_naira: rateNaira,
    message: coverLetter,
    status: 'open'
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/worker/applications')
  return { success: true }
}
