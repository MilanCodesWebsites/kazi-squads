import * as React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserIcon, PlusSignIcon, Delete01Icon, Image01Icon, ArrowTurnDownIcon } from '@hugeicons/core-free-icons'
import { ProfileSetupData } from '../types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", 
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", 
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
]

export function PhotoLocationStep({ 
  data, 
  updateData 
}: { 
  data: ProfileSetupData, 
  updateData: (d: Partial<ProfileSetupData>) => void 
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [tempPhotoUrl, setTempPhotoUrl] = React.useState<string | null>(null)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setTempPhotoUrl(url)
    }
  }

  const handleAttach = () => {
    if (tempPhotoUrl) {
      updateData({ photoUrl: tempPhotoUrl })
    }
    setIsModalOpen(false)
  }

  const handleDeletePhoto = () => {
    updateData({ photoUrl: '' })
    setTempPhotoUrl(null)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        A few last details, then you can publish your profile.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        A professional photo builds trust with clients.
      </p>

      <div className="mt-12 flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Left Side - Photo */}
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden mb-6 group cursor-pointer" onClick={() => { setTempPhotoUrl(data.photoUrl || null); setIsModalOpen(true); }}>
            {data.photoUrl ? (
               <img src={data.photoUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
               <HugeiconsIcon icon={UserIcon} className="h-12 w-12 text-muted-foreground/50 group-hover:scale-110 transition-transform" />
            )}
            <div className="absolute bottom-2 right-4 h-8 w-8 rounded-full bg-[color:var(--kazi-lime)] flex items-center justify-center shadow border-2 border-white text-black">
              <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="rounded-full px-6 font-medium"
            onClick={() => { setTempPhotoUrl(data.photoUrl || null); setIsModalOpen(true); }}
          >
            {data.photoUrl ? 'Change photo' : '+ Upload photo'}
          </Button>

          {!data.photoUrl && (
            <p className="mt-3 text-sm text-red-500 font-medium">Add a profile photo.</p>
          )}
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 max-w-lg space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
            <Input 
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              placeholder="Ex: Lagos"
              className="h-12"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">State <span className="text-red-500">*</span></label>
            <Select value={data.state} onValueChange={(val) => updateData({ state: val })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Phone number <span className="text-red-500">*</span></label>
            <div className="flex h-12 rounded-xl border overflow-hidden focus-within:ring-1 focus-within:ring-ring">
              <div className="flex items-center justify-center bg-muted/30 px-4 border-r">
                <span className="text-xl leading-none">🇳🇬</span>
                <span className="ml-2 text-sm font-medium">+234</span>
              </div>
              <input 
                type="tel"
                value={data.phoneNumber}
                onChange={(e) => updateData({ phoneNumber: e.target.value })}
                placeholder="801 234 5678"
                className="flex-1 bg-transparent px-3 py-2 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-muted/10">
            <DialogTitle>Your photo</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex flex-col md:flex-row gap-8">
             {/* Modal Left - Dropzone / Edit */}
             <div className="flex-1 flex flex-col items-center">
               <label className="relative w-full aspect-square max-w-[300px] rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/10 transition-colors overflow-hidden group">
                 <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                 
                 {tempPhotoUrl ? (
                   <img src={tempPhotoUrl} alt="Preview" className="h-full w-full object-cover" />
                 ) : (
                   <>
                     <HugeiconsIcon icon={Image01Icon} className="h-10 w-10 text-muted-foreground/50 mb-4" />
                     <div className="text-sm font-medium">Upload or drop image here</div>
                     <div className="mt-1 text-xs text-muted-foreground">250x250 Min / 5MB Max</div>
                   </>
                 )}
                 
                 {tempPhotoUrl && (
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                     Click to replace
                   </div>
                 )}
               </label>

               {tempPhotoUrl && (
                 <div className="w-full max-w-[300px] mt-6 flex items-center gap-4">
                   <span className="text-lg font-medium text-muted-foreground">-</span>
                   <Slider defaultValue={[50]} max={100} step={1} className="flex-1" />
                   <span className="text-lg font-medium text-muted-foreground">+</span>
                   <button className="ml-2 p-2 hover:bg-muted rounded-full transition-colors">
                     <HugeiconsIcon icon={ArrowTurnDownIcon} className="h-5 w-5" />
                   </button>
                 </div>
               )}
             </div>

             {/* Modal Right - Rules */}
             <div className="w-full md:w-[280px]">
               <h3 className="font-semibold text-lg">Show clients the best version of yourself!</h3>
               <div className="mt-6 flex gap-3">
                 <div className="h-12 w-12 rounded-full border border-[color:var(--kazi-lime)] bg-muted/20" />
                 <div className="h-12 w-12 rounded-full bg-muted/20" />
                 <div className="h-12 w-12 rounded-full bg-muted/20" />
                 <div className="h-12 w-12 rounded-full bg-muted/20" />
               </div>
               <div className="mt-8 space-y-4">
                 <div className="text-sm">
                   <span className="font-medium">Must be an actual photo of you.</span><br/>
                   Logos, clip-art, group photos, and digitally-altered images are not allowed.
                 </div>
               </div>

               {tempPhotoUrl && (
                 <button 
                   onClick={() => setTempPhotoUrl(null)}
                   className="mt-8 flex items-center gap-2 text-sm font-medium text-[color:var(--kazi-lime)] hover:underline"
                 >
                   <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
                   Delete current image
                 </button>
               )}
             </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t bg-muted/10 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full">Cancel</Button>
            <Button 
              disabled={!tempPhotoUrl} 
              onClick={handleAttach}
              className="rounded-full bg-[color:var(--kazi-lime)] text-black hover:bg-[color:var(--kazi-lime)]/90"
            >
              Attach photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
