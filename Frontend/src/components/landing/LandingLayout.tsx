import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Sparkles } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { LandingCategoryMenu } from '@/components/landing/LandingCategoryMenu'
import { usePaymentDiscountCopy } from '@/components/brand/PaymentDiscountOffer'
import { openHealthCard } from '@/lib/health-card-bus'

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const copy = usePaymentDiscountCopy()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header id="top" className="sticky top-0 z-50">
      {copy.isPromoActive ? (
        <div className="relative overflow-hidden border-b border-ink/10 bg-white text-ink">
          <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-6 py-2 text-center text-[13px]">
            <span className="hidden items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-800 sm:inline-flex">
              <Sparkles className="h-3 w-3" aria-hidden />
              Launch offer
            </span>
            <span className="text-ink/80">
              Extra <strong className="font-bold text-amber-700">{copy.pct}% off</strong> on every payment with a free
              HealthID Card — not on MRP.
            </span>
          </div>
        </div>
      ) : null}

      <div
        className={`relative border-b bg-white transition-[box-shadow,border-color] duration-300 ${
          scrolled ? 'border-ink/10 shadow-[0_10px_30px_-18px_rgba(16,52,74,0.4)]' : 'border-ink/10'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center gap-3 px-4 transition-[height] duration-300 sm:gap-4 sm:px-6 ${
            scrolled ? 'h-[62px]' : 'h-[76px]'
          }`}
        >
          <Link to="/" className="flex shrink-0 items-center transition hover:scale-[1.02]" aria-label="HealthID Card home">
            <Logo variant="compact" />
          </Link>

          <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[12.5px] font-semibold text-brand-600 xl:inline-flex">
            Member rates on 1,200+ tests
          </span>

          <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
            <span className="group hidden items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 md:inline-flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Location</span>
                <span className="mt-0.5 text-[13.5px] font-bold text-ink group-hover:text-brand-600">Nashik</span>
              </span>
            </span>

            <span className="hidden h-6 w-px bg-ink/10 lg:block" aria-hidden />

            <a
              href="tel:18001234567"
              className="group hidden items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition hover:bg-brand-50 xl:inline-flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
                <Phone className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Free call</span>
                <span className="mt-0.5 text-[13.5px] font-bold text-ink group-hover:text-brand-600">1800-123-4567</span>
              </span>
            </a>

            <span className="hidden h-6 w-px bg-ink/10 lg:block" aria-hidden />

            <Link
              to="/login"
              className="hidden rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink transition hover:border-brand-300 hover:text-brand-600 sm:inline-flex"
            >
              Log in
            </Link>

            <button
              type="button"
              onClick={openHealthCard}
              className="inline-flex h-10 items-center justify-center rounded-full bg-coral px-4 text-[13.5px] font-bold text-white transition hover:bg-coral-dark active:scale-[0.98] sm:px-5"
            >
              Get free card
            </button>
          </div>
        </div>
      </div>

      <LandingCategoryMenu />
    </header>
  )
}

export { LandingFooterHealthId as LandingFooter } from '@/components/landing/LandingFooterHealthId'
