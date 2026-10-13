import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { CardSignupModal } from '@/components/landing/CardSignupModal'
import { LandingCardHkSection } from '@/components/landing/LandingCardHkSection'
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
  const navigate = useNavigate()
  const { user, accessToken } = useSelector((s: RootState) => s.auth)

  useEffect(() => {
    if (user?.id && accessToken) navigate('/home', { replace: true })
  }, [user, accessToken, navigate])

  useEffect(() => {
    document.body.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = 'hidden'
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
        <LandingCardHkSection />
        <LandingScansSection />
        <LandingFamilyCardSection />
        <LandingJourneyInteractive />
        <LandingTestimonialsSection />
      </main>

      <LandingFooter />
    </div>
  )
}
