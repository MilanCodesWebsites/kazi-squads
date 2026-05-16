import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { DashboardPreview } from '@/components/dashboard-preview'
import { AiExplainer } from '@/components/ai-explainer'
import { WhoItsFor } from '@/components/who-its-for'
import { TrustSecurity } from '@/components/trust-security'
import { LandingCta } from '@/components/landing-cta'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="w-full bg-white landing-dots min-h-dvh flex flex-col">
      <Navbar />
      <Hero />
      <HowItWorks />
      <DashboardPreview />
      <AiExplainer />
      <WhoItsFor />
      <TrustSecurity />
      <LandingCta />
      <Footer />
    </main>
  )
}

