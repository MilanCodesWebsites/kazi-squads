import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateContent } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const { worker_id, job_id } = await req.json()
    
    if (!worker_id || !job_id) {
      return NextResponse.json({ error: 'worker_id and job_id are required' }, { status: 400 })
    }

    // Fetch worker profile
    const { data: worker, error: workerErr } = await supabaseAdmin
      .from('worker_onboarding')
      .select('*')
      .eq('id', worker_id)
      .single()

    if (workerErr || !worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
    }

    // Fetch job details
    const { data: job, error: jobErr } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', job_id)
      .single()

    if (jobErr || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const workerFullName = `${worker.first_name || ''} ${worker.last_name || ''}`.trim() || 'Freelancer'

    const prompt = `
You are helping a Nigerian freelancer write a compelling cover letter for a job application on Kazi, a Nigerian freelance marketplace.

Worker profile:
- Name: ${workerFullName}
- Title: ${worker.job_title || worker.title}
- Skills: ${worker.skills?.join(', ') || 'None'}
- Bio: ${worker.bio || ''}
- Years of experience: ${worker.experience}
- Location: ${worker.city}, ${worker.state}

Job they are applying for:
- Title: ${job.title}
- Description: ${job.description}
- Category: ${job.category}
- Budget: ₦${job.budget_min_naira || job.budget_fixed_naira} - ₦${job.budget_max_naira || job.budget_fixed_naira}
- Location: ${job.location_preference === 'remote' ? 'Remote' : job.city}

Write a short, compelling, human-sounding cover letter for this worker to send to the client. The tone should be professional but warm, not stiff or corporate. It should feel like it was written by a real Nigerian professional, not an AI.

The cover letter should:
- open with a specific reference to the job, not a generic opener
- highlight the 2-3 most relevant skills from their profile that match the job
- mention their experience level naturally
- close with a clear expression of interest and availability
- be between 120 and 180 words
- never use the phrases "I am writing to express", "I am excited to apply", "I believe I am a great fit", or any other cliche AI opener
- never use em dashes
- sound like a real person wrote it

Return only the cover letter text. No subject line, no labels, no explanation.
`

    let generatedLetter = ''
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      generatedLetter = await Promise.race([
        generateContent(prompt),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('Gemini timeout')), 10000)
        })
      ])
      clearTimeout(timeoutId)
    } catch (aiErr: any) {
      console.error('Gemini API Error (cover letter):', aiErr)
      return NextResponse.json({ error: 'Gemini API failed' }, { status: 500 })
    }

    return NextResponse.json({ coverLetter: generatedLetter.trim() })

  } catch (err: any) {
    console.error('API Error in /api/ai/cover-letter:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
