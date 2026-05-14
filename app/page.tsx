import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { DashboardPreview } from '@/components/dashboard-preview'

export default function Home() {
  return (
    <main className="w-full bg-white landing-dots">
      <Navbar />
      <Hero />
      <DashboardPreview />
    </main>
  )
}
