import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { POPULAR_PLANS_SECTION_ID, scrollToPopularPlans } from '@/lib/landing-nav-scroll'
import { CardSignupModal } from '@/components/landing/CardSignupModal'
import { LandingFamilyCardSection } from '@/components/landing/LandingFamilyCardSection'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingJourneyInteractive } from '@/components/landing/LandingJourneyInteractive'
import { LandingFooter, LandingHeader } from '@/components/landing/LandingLayout'
import { LandingScansSection } from '@/components/landing/LandingScansSection'
import { LandingShowcaseSection } from '@/components/landing/LandingShowcaseSection'
import { LandingServicesCarousel } from '@/components/landing/LandingServicesCarousel'
import { LandingTestimonialsSection } from '@/components/landing/LandingTestimonialsSection'

/** Section order: hero → services → packages → … (LabVert removed per product request) */
export function LandingPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')
    if (id === POPULAR_PLANS_SECTION_ID) {
      scrollToPopularPlans('smooth')
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    const root = document.getElementById('root')
    if (root) root.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (root) root.style.overflow = ''
    }
  }, [])

  return (
    <div className="landing-page min-h-screen bg-white font-sans text-ink">
      <CardSignupModal />
      <LandingHeader />

      <main>
        <LandingHero />
        <LandingServicesCarousel />
        <LandingShowcaseSection />
        <LandingScansSection />
        <LandingFamilyCardSection />
        <LandingJourneyInteractive />
        <LandingTestimonialsSection />
      </main>

      <LandingFooter />
    </div>
  )
}
