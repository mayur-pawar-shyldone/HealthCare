import { Check, Users } from 'lucide-react'
import { PLATFORM } from '@/data/platform-content'
import { openHealthCard } from '@/lib/health-card-bus'

const PERKS = [
  'Free 1-year family membership',
  `Extra ${PLATFORM.membership.flatDiscount}% off at every payment`,
  'Special rates on 63+ tests',
  'WhatsApp reports & free home collection',
]

export function LandingCardPromo() {
  return (
    <section id="card" className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-ink to-brand-700 py-20 text-white">
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-coral/20 blur-3xl" aria-hidden />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-coral-bright">HealthID Card</p>
          <h2 className="mt-3 font-display text-[32px] font-extrabold leading-tight sm:text-[38px]">
            One card for your whole family
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/75">
            Launch offer: get member rates on every test, with an extra flat discount applied at checkout — not on MRP.
          </p>
          <ul className="mt-8 space-y-3">
            {PERKS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14px] text-white/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral-bright" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={openHealthCard}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-coral px-8 text-[15px] font-semibold text-white transition hover:bg-coral-dark active:scale-[0.98]"
          >
            Get your free card
          </button>
        </div>
        <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm">
          <div className="rounded-[22px] bg-gradient-to-br from-brand-700 to-brand-500 p-6 shadow-2xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">HealthID Card</p>
            <p className="mt-6 font-display text-2xl">Your Name</p>
            <p className="mt-1 text-sm text-white/60">Valid thru · 12 Sep 2027</p>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs text-white/50">Family · Special rates</span>
              <Users className="h-5 w-5 text-coral-bright" aria-hidden />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-white/50">Digital card with QR · Share at home collection</p>
        </div>
      </div>
    </section>
  )
}
