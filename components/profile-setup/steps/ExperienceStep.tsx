import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Folder01Icon, PencilEdit01Icon, Delete01Icon } from '@hugeicons/core-free-icons'
import { ProfileSetupData, Experience } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const YEARS = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i))
const COUNTRIES = ['Nigeria', 'United States', 'United Kingdom', 'Canada', 'Remote']

export function ExperienceStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  // Form State
  const [title, setTitle] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [city, setCity] = React.useState('')
  const [country, setCountry] = React.useState('')
  const [startMonth, setStartMonth] = React.useState('')
  const [startYear, setStartYear] = React.useState('')
  const [endMonth, setEndMonth] = React.useState('')
  const [endYear, setEndYear] = React.useState('')
  const [isCurrent, setIsCurrent] = React.useState(false)
  const [description, setDescription] = React.useState('')

  const openNew = () => {
    setEditingId(null)
    setTitle('')
    setCompany('')
    setCity('')
    setCountry('')
    setStartMonth('')
    setStartYear('')
    setEndMonth('')
    setEndYear('')
    setIsCurrent(false)
    setDescription('')
    setIsModalOpen(true)
  }

  const openEdit = (exp: Experience) => {
    setEditingId(exp.id)
    setTitle(exp.title)
    setCompany(exp.company)
    setCity(exp.city)
    setCountry(exp.country)
    setStartMonth(exp.startMonth)
    setStartYear(exp.startYear)
    setEndMonth(exp.endMonth)
    setEndYear(exp.endYear)
    setIsCurrent(exp.isCurrent)
    setDescription(exp.description)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    updateData({ experiences: data.experiences.filter(e => e.id !== id) })
  }

  const handleSave = () => {
    const newExp: Experience = {
      id: editingId || uuidv4(),
      title, company, city, country, startMonth, startYear, 
      endMonth: isCurrent ? '' : endMonth, 
      endYear: isCurrent ? '' : endYear, 
      isCurrent, description
    }
    
    if (editingId) {
      updateData({ experiences: data.experiences.map(e => e.id === editingId ? newExp : e) })
    } else {
      updateData({ experiences: [...data.experiences, newExp] })
    }
    setIsModalOpen(false)
  }

  const isFormValid = title.trim() && company.trim() && startMonth && startYear && (isCurrent || (endMonth && endYear))

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        If you have relevant work experience, add it here.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Workers who add their experience are more likely to win jobs. But if you&apos;re just starting out, you can still create a great profile.
      </p>

      <div className="mt-10 max-w-3xl space-y-4">
        {data.experiences.map((exp) => (
          <div key={exp.id} className="relative rounded-2xl border p-6 hover:shadow-sm transition-shadow">
            <div className="flex gap-4">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/20">
                  <HugeiconsIcon icon={Folder01Icon} className="h-6 w-6 text-muted-foreground" />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-semibold">{exp.title}</h3>
                 <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                   <span className="font-medium text-foreground">{exp.company}</span>
                   <span>•</span>
                   <span>
                     {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                   </span>
                 </div>
                 {(exp.city || exp.country) && (
                   <div className="mt-1 text-sm text-muted-foreground">
                     {exp.city}{exp.city && exp.country ? ', ' : ''}{exp.country}
                   </div>
                 )}
                 {exp.description && (
                   <p className="mt-4 text-sm whitespace-pre-wrap text-foreground/80">{exp.description}</p>
                 )}
               </div>
            </div>
            
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <button onClick={() => openEdit(exp)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted/50 transition-colors">
                <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(exp.id)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-red-50 hover:text-red-600 transition-colors">
                <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={openNew}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--kazi-lime)] text-black group-hover:scale-105 transition-transform">
            <HugeiconsIcon icon={PlusSignIcon} className="h-5 w-5" />
          </div>
          <span className="text-lg font-medium">Add experience</span>
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-muted/10">
            <DialogTitle>{editingId ? 'Edit Work Experience' : 'Add Work Experience'}</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Software Engineer" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Company <span className="text-red-500">*</span></label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ex: Microsoft" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">City</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: Lagos" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Country</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-3 mt-2 cursor-pointer">
              <Checkbox 
                checked={isCurrent} 
                onCheckedChange={(v) => setIsCurrent(!!v)} 
                className="data-[state=checked]:bg-[color:var(--kazi-lime)] data-[state=checked]:border-[color:var(--kazi-lime)] data-[state=checked]:text-black"
              />
              <span className="text-sm">I am currently working in this role</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start Date <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={startMonth} onValueChange={setStartMonth}>
                    <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                    <SelectContent>{MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={startYear} onValueChange={setStartYear}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">End Date {isCurrent ? '' : <span className="text-red-500">*</span>}</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={endMonth} onValueChange={setEndMonth} disabled={isCurrent}>
                    <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                    <SelectContent>{MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={endYear} onValueChange={setEndYear} disabled={isCurrent}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your work, achievements, and responsibilities."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t bg-muted/10 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full">Cancel</Button>
            <Button 
              disabled={!isFormValid} 
              onClick={handleSave}
              className="rounded-full bg-[color:var(--kazi-lime)] text-black hover:bg-[color:var(--kazi-lime)]/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
