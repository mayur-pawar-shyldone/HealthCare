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

type LandingPageProps = {
  /** Non-interactive layer behind login modal */
  backdrop?: boolean
}

/** Section order: hero → services → packages → … (LabVert removed per product request) */
export function LandingPage({ backdrop = false }: LandingPageProps) {
  const { hash } = useLocation()

  useEffect(() => {
    if (backdrop) return
    const previous = history.scrollRestoration
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!hash) {
      window.scrollTo(0, 0)
      return () => {
        if ('scrollRestoration' in history) history.scrollRestoration = previous
      }
    }
    const id = hash.replace('#', '')
    const jump = () => {
      if (id === POPULAR_PLANS_SECTION_ID) {
        scrollToPopularPlans('smooth')
        return
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const t = window.setTimeout(jump, 50)
    return () => {
      window.clearTimeout(t)
      if ('scrollRestoration' in history) history.scrollRestoration = previous
    }
  }, [hash, backdrop])

  return (
    <div
      className={`landing-page bg-white font-sans text-ink ${backdrop ? 'min-h-[120vh] pointer-events-none select-none' : 'min-h-screen'}`}
    >
      {backdrop ? null : <CardSignupModal />}
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
