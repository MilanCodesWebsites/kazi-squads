import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, BookOpen01Icon, PencilEdit01Icon, Delete01Icon } from '@hugeicons/core-free-icons'
import { ProfileSetupData, Education } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

const YEARS = Array.from({ length: 60 }, (_, i) => String(new Date().getFullYear() + 10 - i))

export function EducationStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  const [school, setSchool] = React.useState('')
  const [degree, setDegree] = React.useState('')
  const [fieldOfStudy, setFieldOfStudy] = React.useState('')
  const [startYear, setStartYear] = React.useState('')
  const [endYear, setEndYear] = React.useState('')
  const [description, setDescription] = React.useState('')

  const openNew = () => {
    setEditingId(null)
    setSchool('')
    setDegree('')
    setFieldOfStudy('')
    setStartYear('')
    setEndYear('')
    setDescription('')
    setIsModalOpen(true)
  }

  const openEdit = (edu: Education) => {
    setEditingId(edu.id)
    setSchool(edu.school)
    setDegree(edu.degree)
    setFieldOfStudy(edu.fieldOfStudy)
    setStartYear(edu.startYear)
    setEndYear(edu.endYear)
    setDescription(edu.description)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    updateData({ education: data.education.filter(e => e.id !== id) })
  }

  const handleSave = () => {
    const newEdu: Education = {
      id: editingId || uuidv4(),
      school, degree, fieldOfStudy, startYear, endYear, description
    }
    
    if (editingId) {
      updateData({ education: data.education.map(e => e.id === editingId ? newEdu : e) })
    } else {
      updateData({ education: [...data.education, newEdu] })
    }
    setIsModalOpen(false)
  }

  const isFormValid = school.trim().length > 0

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Clients like to know what you know - add your education here.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        You don&apos;t have to have a degree. Adding any relevant education helps make your profile more visible.
      </p>

      <div className="mt-10 max-w-3xl space-y-4">
        {data.education.map((edu) => (
          <div key={edu.id} className="relative rounded-2xl border p-6 hover:shadow-sm transition-shadow">
            <div className="flex gap-4">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted/20">
                  <HugeiconsIcon icon={BookOpen01Icon} className="h-6 w-6 text-muted-foreground" />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-semibold">{edu.school}</h3>
                 {(edu.degree || edu.fieldOfStudy) && (
                   <div className="mt-1 text-sm text-foreground">
                     {edu.degree}{edu.degree && edu.fieldOfStudy ? ', ' : ''}{edu.fieldOfStudy}
                   </div>
                 )}
                 {(edu.startYear || edu.endYear) && (
                   <div className="mt-1 text-sm text-muted-foreground">
                     {edu.startYear} - {edu.endYear || 'Present'}
                   </div>
                 )}
                 {edu.description && (
                   <p className="mt-4 text-sm whitespace-pre-wrap text-foreground/80">{edu.description}</p>
                 )}
               </div>
            </div>
            
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <button onClick={() => openEdit(edu)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-muted/50 transition-colors">
                <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(edu.id)} className="flex h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-red-50 hover:text-red-600 transition-colors">
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
          <span className="text-lg font-medium">Add education</span>
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-muted/10">
            <DialogTitle>{editingId ? 'Edit Education History' : 'Add Education History'}</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium">School <span className="text-red-500">*</span></label>
              <Input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Ex: University of Lagos" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Degree</label>
                <Input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Ex: Bachelor's" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Field of Study</label>
                <Input value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} placeholder="Ex: Computer Science" />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Dates Attended</label>
              <div className="grid grid-cols-2 gap-4">
                <Select value={startYear} onValueChange={setStartYear}>
                  <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
                  <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={endYear} onValueChange={setEndYear}>
                  <SelectTrigger><SelectValue placeholder="To (or expected)" /></SelectTrigger>
                  <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your studies, awards, or active student organizations."
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
