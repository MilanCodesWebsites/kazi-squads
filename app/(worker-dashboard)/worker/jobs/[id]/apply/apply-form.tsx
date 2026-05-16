'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { submitApplication } from './actions'

export function ApplyForm({ jobId, prefilledRate = '50,000', workerId }: { jobId: string, prefilledRate?: string, workerId: string }) {
  const [coverLetter, setCoverLetter] = React.useState('')
  const [rate, setRate] = React.useState(prefilledRate)
  const [delivery, setDelivery] = React.useState('1-3 days')
  const [links, setLinks] = React.useState([{ label: '', url: '' }])
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false)
  const [aiError, setAiError] = React.useState<string | null>(null)

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true)
    setAiError(null)
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId, job_id: jobId })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCoverLetter(data.coverLetter)
    } catch (err) {
      console.error(err)
      setAiError("couldn't generate cover letter. write your own and give it your best shot.")
    } finally {
      setIsGeneratingAi(false)
    }
  }

  const handleAddLink = () => {
    if (links.length < 3) {
      setLinks([...links, { label: '', url: '' }])
    }
  }

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('coverLetter', coverLetter)
    formData.append('rate', rate)
    formData.append('delivery', delivery)
    // Note: If we added portfolio_links to schema, we'd process links here. For now, we store the message.
    
    const result = await submitApplication(jobId, formData)
    setIsSubmitting(false)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#AAFF00]/20" style={{ backgroundColor: 'rgba(170, 255, 0, 0.2)' }}>
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-10 w-10 text-black" style={{ color: 'var(--kazi-lime)' }} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Application submitted.</h1>
          <p className="text-muted-foreground">We'll notify you when the client views it.</p>
        </div>
        <Button asChild className="rounded-xl mt-4" style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}>
          <Link href="/worker/applications">View Applications</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-[#e5e5e5] bg-background p-6 shadow-sm">
      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-sm text-red-700">{error}</div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label htmlFor="cover-letter" className="text-base font-semibold">Cover Letter</Label>
            <button
              type="button"
              onClick={handleGenerateAi}
              disabled={isGeneratingAi}
              className="text-sm font-bold transition-opacity hover:opacity-80 disabled:opacity-50 flex items-center gap-1"
              style={{ color: 'var(--kazi-lime)' }}
            >
              {isGeneratingAi ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Writing...
                </>
              ) : 'Write with AI ✦'}
            </button>
          </div>
          <span className={`text-xs ${coverLetter.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {coverLetter.length} / 500
          </span>
        </div>
        {aiError && (
          <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-600">{aiError}</div>
        )}
        <Textarea
          id="cover-letter"
          name="coverLetter"
          placeholder="Tell the client why you're the right person for this job. Be specific about your experience and approach."
          className="min-h-[150px] resize-none rounded-xl border-[#e5e5e5]"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          maxLength={500}
          disabled={isGeneratingAi}
          required
        />
        <p className="text-xs text-muted-foreground">AI-generated. Review and edit before submitting.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="rate" className="text-base font-semibold">Your Rate</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">₦</span>
            <Input
              id="rate"
              name="rate"
              type="text"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="rounded-xl pl-8 border-[#e5e5e5]"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="delivery" className="text-base font-semibold">Estimated Delivery</Label>
          <select
            id="delivery"
            name="delivery"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-xl border border-[#e5e5e5] bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="1-3 days">1-3 days</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
            <option value="1 month">1 month</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-base font-semibold">Portfolio Links</Label>
          <p className="text-sm text-muted-foreground">Add up to 3 links to your past work.</p>
        </div>
        
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                placeholder="Label (e.g. Dribbble, GitHub)"
                value={link.label}
                onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                className="rounded-xl border-[#e5e5e5]"
              />
              <Input
                placeholder="URL (https://...)"
                type="url"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                className="rounded-xl border-[#e5e5e5]"
              />
            </div>
          ))}
        </div>

        {links.length < 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddLink}
            className="rounded-xl border-dashed border-[#e5e5e5]"
          >
            + Add Link
          </Button>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full rounded-xl py-6 text-lg font-bold shadow-none" 
        style={{ backgroundColor: 'var(--kazi-lime)', color: 'black' }}
        disabled={coverLetter.length === 0 || coverLetter.length > 500 || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  )
}
