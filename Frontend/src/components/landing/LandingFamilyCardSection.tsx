import { ArrowRight, Check } from 'lucide-react'
import { FAMILY_CARD_PERKS } from '@/data/landing-healthid-content'
import { openHealthCard } from '@/lib/health-card-bus'

export function LandingFamilyCardSection() {
  return (
    <section id="family-card" className="bg-white py-20" aria-labelledby="family-card-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[26px] bg-ink text-white">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-12 lg:p-12 xl:p-14">
              <span className="inline-flex items-center rounded-full bg-coral px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.08em] text-white">
                Free for 1 year
              </span>
              <h2 id="family-card-heading" className="mt-5 font-display text-[clamp(30px,2.5vw,36px)] font-extrabold leading-tight tracking-tight">
                One card for your whole family
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/75">
                The HealthID Card is the account behind your bookings — member pricing, home collection and a shared
                health record for everyone you care for. No fee, no auto-renewal.
              </p>
              <ul className="mt-8 space-y-3.5">
                {FAMILY_CARD_PERKS.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-white/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openHealthCard}
                className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-coral px-7 text-[15px] font-semibold text-white transition hover:bg-coral-dark active:scale-[0.98]"
              >
                Activate your free card
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="relative min-h-[320px] lg:min-h-[440px]">
              <img
                src="/landing/yk.webp"
                alt="A family sitting together at home"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <img
                src="/landing/eg.webp"
                alt="HealthID Card — front design for family membership"
                className="absolute bottom-5 left-5 w-[64%] max-w-[420px] drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
