export type Experience = {
  id: string
  title: string
  company: string
  city: string
  country: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  isCurrent: boolean
  description: string
}

export type Education = {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  startYear: string
  endYear: string
  description: string
}

export type Language = {
  id: string
  language: string
  proficiency: string
}

export type ProfileSetupData = {
  category: string
  specialties: string[]
  skills: string[]
  title: string
  experiences: Experience[]
  education: Education[]
  languages: Language[]
  bio: string
  hourlyRateNaira: number | ''
  city: string
  state: string
  phoneNumber: string
  photoUrl: string
}

export const initialProfileData: ProfileSetupData = {
  category: '',
  specialties: [],
  skills: [],
  title: '',
  experiences: [],
  education: [],
  languages: [{ id: '1', language: 'English', proficiency: 'Fluent' }],
  bio: '',
  hourlyRateNaira: '',
  city: '',
  state: '',
  phoneNumber: '',
  photoUrl: '',
}
