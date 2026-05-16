import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateContent } from '@/lib/gemini'

const matchCache = new Map<string, { jobs: any[], timestamp: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export async function POST(req: Request) {
  try {
    const { worker_id } = await req.json()
    if (!worker_id) {
      return NextResponse.json({ error: 'worker_id is required' }, { status: 400 })
    }

    // Check cache
    const cached = matchCache.get(worker_id)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ jobs: cached.jobs })
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

    // Fetch open jobs
    const { data: jobs, error: jobsErr } = await supabaseAdmin
      .from('jobs')
      .select('id, title, description, category, budget_mode, budget_fixed_naira, budget_min_naira, budget_max_naira, location_preference, city, posted_at, status')
      .eq('status', 'open')
      .order('posted_at', { ascending: false })

    if (jobsErr || !jobs || jobs.length === 0) {
      return NextResponse.json({ jobs: [] })
    }

    // Prepare prompt
    const prompt = `
You are an AI job matching engine for a Nigerian freelance platform called Kazi.

Here is a worker's profile:
- Title: ${worker.job_title || worker.title}
- Skills: ${worker.skills?.join(', ') || 'None'}
- Bio: ${worker.bio || ''}
- Location: ${worker.city}, ${worker.state}
- Work preference: ${worker.work_preference}
- Years of experience: ${worker.experience}
- Category: ${worker.role || 'Any'}

Here are the available jobs:
${jobs.map((job, i) => `
Job ${i + 1}:
- ID: ${job.id}
- Title: ${job.title}
- Description: ${job.description}
- Category: ${job.category}
- Budget: ₦${job.budget_min_naira || job.budget_fixed_naira} - ₦${job.budget_max_naira || job.budget_fixed_naira}
- Location preference: ${job.location_preference}
- Location: ${job.city || 'not specified'}
`).join('\n')}

Rank these jobs from most to least relevant for this worker. Consider:
1. skill match between worker skills and job requirements
2. category alignment
3. location compatibility (remote jobs match everyone, onsite jobs should match worker's city)
4. experience level implied by the job description vs worker's experience
5. budget alignment with worker's minimum rate

Return ONLY a valid JSON array of job IDs in order from most to least relevant, with a match score (0-100) and a one sentence reason for each. No preamble, no markdown, no explanation outside the JSON.

Format:
[
  { "job_id": "uuid", "score": 95, "reason": "Strong skill match in web development with remote preference aligned" },
  { "job_id": "uuid", "score": 78, "reason": "Partial skill match but budget is below worker's minimum rate" }
]
`

    let aiResultText = ''
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      aiResultText = await Promise.race([
        generateContent(prompt),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('Gemini timeout')), 10000)
        })
      ])
      clearTimeout(timeoutId)
    } catch (aiErr: any) {
      console.error('Gemini API Error (matching):', aiErr)
      return NextResponse.json({ jobs }) // Fallback to chronological order without scores
    }

    // Parse JSON
    let parsedMatches: Array<{ job_id: string; score: number; reason: string }> = []
    try {
      // Strip any markdown fences
      const cleanJson = aiResultText.replace(/```json/g, '').replace(/```/g, '').trim()
      parsedMatches = JSON.parse(cleanJson)
    } catch (parseErr) {
      console.error('Gemini JSON parsing error:', parseErr, aiResultText)
      return NextResponse.json({ jobs }) // Fallback to chronological order without scores
    }

    // Reorder and inject scores into jobs
    const matchedJobs = []
    const jobsMap = new Map(jobs.map(j => [j.id, j]))

    for (const match of parsedMatches) {
      const job = jobsMap.get(match.job_id)
      if (job) {
        matchedJobs.push({
          ...job,
          aiScore: match.score,
          aiReason: match.reason
        })
        jobsMap.delete(match.job_id)
      }
    }

    // Append any remaining jobs that the AI missed at the end
    for (const [id, job] of jobsMap) {
      matchedJobs.push({
        ...job,
        aiScore: 0,
        aiReason: "No AI matching data available"
      })
    }

    // Store in cache
    matchCache.set(worker_id, { jobs: matchedJobs, timestamp: Date.now() })

    return NextResponse.json({ jobs: matchedJobs })
  } catch (err: any) {
    console.error('API Error in /api/ai/match:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
