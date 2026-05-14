import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Delete01Icon } from '@hugeicons/core-free-icons'
import { ProfileSetupData, Language } from '../types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PROFICIENCIES = ['Basic', 'Conversational', 'Fluent', 'Native or Bilingual']

export function LanguagesStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const handleAddLanguage = () => {
    const newLang: Language = { id: uuidv4(), language: '', proficiency: '' }
    updateData({ languages: [...data.languages, newLang] })
  }

  const handleRemoveLanguage = (id: string) => {
    updateData({ languages: data.languages.filter(l => l.id !== id) })
  }

  const handleLanguageChange = (id: string, field: keyof Language, value: string) => {
    updateData({ 
      languages: data.languages.map(l => l.id === id ? { ...l, [field]: value } : l) 
    })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Looking good. Next, tell us which languages you speak.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Clients want to know what languages you speak. English is included by default.
      </p>

      <div className="mt-12 max-w-3xl space-y-6">
        <div className="grid grid-cols-[1fr_1fr_40px] gap-4">
          <div className="text-sm font-medium">Language</div>
          <div className="text-sm font-medium">Proficiency</div>
          <div></div>
        </div>

        {data.languages.map((lang, index) => (
          <div key={lang.id} className="grid grid-cols-[1fr_1fr_40px] items-center gap-4">
            <Input 
              value={lang.language}
              onChange={(e) => handleLanguageChange(lang.id, 'language', e.target.value)}
              placeholder="Ex: French"
              disabled={index === 0} // English is disabled
              className="h-12"
            />
            <Select 
              value={lang.proficiency} 
              onValueChange={(val) => handleLanguageChange(lang.id, 'proficiency', val)}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="My level is" />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex justify-center">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(lang.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <HugeiconsIcon icon={Delete01Icon} className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button
            onClick={handleAddLanguage}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--kazi-lime)] px-5 py-2 text-sm font-semibold text-black hover:bg-[color:var(--kazi-lime)]/10 transition-colors"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
            Add a language
          </button>
        </div>
      </div>
    </div>
  )
}
