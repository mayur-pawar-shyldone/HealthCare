import { ArrowRight, CreditCard, Heart, Percent } from 'lucide-react'
import { CARD_BENEFITS, CARD_STATS } from '@/data/landing-healthid-content'
import { openHealthCard } from '@/lib/health-card-bus'

const BENEFIT_ICONS = [Percent, Heart, CreditCard]

export function LandingCardHkSection() {
  return (
    <section id="card" className="relative overflow-hidden bg-white py-20" aria-labelledby="card-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-14 lg:gap-y-9">
          <div className="lg:col-start-1 lg:row-start-1 lg:max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-600">
              <CreditCard className="h-3.5 w-3.5" aria-hidden />
              HealthID Card
            </span>
            <h2 id="card-heading" className="mt-4 font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px] xl:text-[40px]">
              One free card. Member pricing for life.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              The card is what makes the prices on this page possible. It takes two minutes to claim and applies
              automatically at checkout.
            </p>
          </div>

          <div className="group relative mx-auto w-full max-w-[520px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[130%] -translate-y-1/2 bg-[radial-gradient(58%_58%_at_50%_50%,#EDF5F9_0%,rgba(237,245,249,0.5)_45%,transparent_75%)]"
              aria-hidden
            />
            <img
              src="/landing/eg.webp"
              alt="HealthID Card front — family membership card issued to the account holder"
              className="w-full transition duration-500 hover:scale-[1.015] hover:-rotate-[0.6deg]"
              loading="lazy"
            />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <dl className="grid grid-cols-3 gap-3">
              {CARD_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-ink/10 bg-white px-4 py-4 text-center">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-[24px] font-extrabold leading-none text-brand-600">{stat.value}</span>
                    <span className="mt-2 block text-[12.5px] leading-snug text-ink-soft">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-10 space-y-6">
              {CARD_BENEFITS.map((item, i) => {
                const Icon = BENEFIT_ICONS[i] ?? CreditCard
                return (
                  <li key={item.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-[16.5px] font-bold text-ink">{item.title}</h3>
                      <p className="mt-1 max-w-md text-[14.5px] leading-relaxed text-ink-soft">{item.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openHealthCard}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-coral to-coral-dark px-7 text-[15px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(226,61,38,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-10px_rgba(226,61,38,0.9)] active:scale-[0.98]"
              >
                Get your free card
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <a
                href="#how"
                className="inline-flex h-12 items-center rounded-full border border-ink/15 px-6 text-[15px] font-semibold text-ink transition hover:border-brand-300 hover:text-brand-600"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
