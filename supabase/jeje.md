Integrate Gemini AI into the Kazi platform for two features: job matching and AI-assisted cover letter writing.
setup
GEMINI_API_KEY=
install the SDK:
npm install @google/genai
create a shared Gemini client:
typescript// lib/gemini.ts
i// lib/gemini.ts
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function generateContent(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: prompt,
  })
  return response.text ?? ''
}

feature 1: job matching
when a worker loads their jobs tab on the dashboard, jobs should be ranked by how relevant they are to that specific worker. this is the core AI pillar of the platform.
create this API route:
POST /api/ai/match
body: { worker_id }
this route should:

fetch the worker's full profile from Supabase including skills, title, bio, location, work preference, years experience, and category
fetch all open jobs from the jobs table
if there are no open jobs return an empty array
send everything to Gemini with this prompt:

typescriptconst prompt = `
You are an AI job matching engine for a Nigerian freelance platform called Kazi.

Here is a worker's profile:
- Title: ${worker.title}
- Skills: ${worker.skills.join(', ')}
- Bio: ${worker.bio}
- Location: ${worker.location_city}, ${worker.location_state}
- Work preference: ${worker.work_preference}
- Years of experience: ${worker.years_experience}
- Category: ${worker.category}

Here are the available jobs:
${jobs.map((job, i) => `
Job ${i + 1}:
- ID: ${job.id}
- Title: ${job.title}
- Description: ${job.description}
- Category: ${job.category}
- Budget: ₦${job.budget_min} - ₦${job.budget_max}
- Location preference: ${job.location_preference}
- Location: ${job.location_city || 'not specified'}
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

parse the JSON response from Gemini
return the jobs array reordered by match score with the score and reason attached to each job object
cache the result in Supabase or in-memory for 30 minutes so you're not calling Gemini on every page load

create this API route:
POST /api/ai/match
frontend integration
on the worker dashboard jobs tab, when the component mounts call /api/ai/match with the worker's id. show a small loading skeleton while results load. once loaded show jobs ranked by score. each job card should show a small lime green "AI Match" badge with the score like "94% match". below the job title show the one sentence reason in small gray italic text. this makes the AI visible and tangible to judges during the demo.

feature 2: AI cover letter assistant
on the application page when a worker clicks "Apply Now", the cover letter textarea should have an "Write with AI" button next to the label. clicking it generates a tailored cover letter draft based on the worker's profile and the specific job they're applying to.
create this API route:
POST /api/ai/cover-letter
body: { worker_id, job_id }
this route should:

fetch the worker's full profile
fetch the job details
call Gemini with this prompt:

typescriptconst prompt = `
You are helping a Nigerian freelancer write a compelling cover letter for a job application on Kazi, a Nigerian freelance marketplace.

Worker profile:
- Name: ${worker.full_name}
- Title: ${worker.title}
- Skills: ${worker.skills.join(', ')}
- Bio: ${worker.bio}
- Years of experience: ${worker.years_experience}
- Location: ${worker.location_city}, ${worker.location_state}

Job they are applying for:
- Title: ${job.title}
- Description: ${job.description}
- Category: ${job.category}
- Budget: ₦${job.budget_min} - ₦${job.budget_max}
- Location: ${job.location_preference === 'remote' ? 'Remote' : job.location_city}

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

return the generated cover letter as plain text

frontend integration
on the apply now page, next to the "Cover Letter" label add a small "Write with AI ✦" button in lime green text, no background. clicking it:

shows a loading spinner inside the textarea
calls /api/ai/cover-letter
populates the textarea with the generated letter
the worker can edit it freely after it's generated
show a small gray note below the textarea: "AI-generated. Review and edit before submitting."

if the API call fails show a toast: "couldn't generate cover letter. write your own and give it your best shot."

api route structure
app/api/ai/
  match/route.ts           # job matching
  cover-letter/route.ts    # cover letter generation

important notes

never expose the Gemini API key to the frontend, all calls go through the Next.js API routes
always parse Gemini JSON responses inside a try/catch, strip any markdown fences before parsing
if Gemini returns malformed JSON for the matching endpoint, fall back to returning jobs in chronological order with no scores
add a 10 second timeout on all Gemini calls so the UI never hangs indefinitely
log all Gemini errors to the console with enough context to debug

build both features completely.