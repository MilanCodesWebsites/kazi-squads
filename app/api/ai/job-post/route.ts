import { NextResponse } from 'next/server'

import { generateContent } from '@/lib/gemini'

const CATEGORY_OPTIONS = [
  'design',
  'tech',
  'writing',
  'trades',
  'events',
  'marketing',
  'admin',
  'other',
] as const

type JobCategory = (typeof CATEGORY_OPTIONS)[number]

function normalizeCategory(value: string | undefined): JobCategory {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return 'other'
  return CATEGORY_OPTIONS.includes(normalized as JobCategory) ? (normalized as JobCategory) : 'other'
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { prompt?: string } | null
    const promptInput = body?.prompt?.trim()

    if (!promptInput) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }

    const prompt = `
You are a helpful assistant for a Nigerian freelance marketplace called Kazi.

Use the client input below to draft a job post. Keep it clear, professional, and human.

Client input:
${promptInput}

Return ONLY valid JSON with this shape:
{
  "title": "string (max 80 characters)",
  "category": "one of: design, tech, writing, trades, events, marketing, admin, other",
  "description": "string (include deliverables, context, and nice-to-have sections)"
}

The description should be friendly, specific, and formatted with short paragraphs or bullet points.
`

    let aiResultText = ''
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      aiResultText = await Promise.race([
        generateContent(prompt),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('Gemini timeout')), 10000)
        }),
      ])
      clearTimeout(timeoutId)
    } catch (aiErr: any) {
      console.error('Gemini API Error (job post):', aiErr)
      return NextResponse.json({ error: 'Gemini API failed' }, { status: 500 })
    }

    let parsed: { title?: string; category?: string; description?: string } = {}
    try {
      const cleanJson = aiResultText.replace(/```json/gi, '').replace(/```/g, '').trim()
      parsed = JSON.parse(cleanJson)
    } catch (parseErr) {
      console.error('Gemini JSON parsing error (job post):', parseErr, aiResultText)
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 })
    }

    const title = parsed.title?.trim() ?? ''
    const description = parsed.description?.trim() ?? ''
    const category = normalizeCategory(parsed.category)

    if (!title || !description) {
      return NextResponse.json({ error: 'AI response incomplete' }, { status: 500 })
    }

    return NextResponse.json({ title, category, description })
  } catch (err: any) {
    console.error('API Error in /api/ai/job-post:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
