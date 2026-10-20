import { useState } from 'react'
import { CHECKUP_SUBTITLE, CHECKUP_TAB_DATA, CHECKUP_TONES } from '@/data/landing-checkup-tabs'
import { LandingPopularCheckupCard } from '@/components/landing/LandingPopularCheckupCard'

/** HealthID `ik` — Popular packages section */
export function LandingPopularCheckups() {
  const [tabId, setTabId] = useState(CHECKUP_TAB_DATA[0].id)
  const activeTab = CHECKUP_TAB_DATA.find((t) => t.id === tabId) ?? CHECKUP_TAB_DATA[0]

  return (
    <section id="checkups" className="bg-white py-20" aria-labelledby="checkups-heading">
      <div className="mx-auto max-w-7xl px-6">
        <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-600">
          <span className="h-0.5 w-5 rounded-full bg-coral" aria-hidden />
          Popular packages
        </p>
        <h2
          id="checkups-heading"
          className="mt-3 font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]"
        >
          {activeTab.label} in Mumbai
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{CHECKUP_SUBTITLE}</p>

        <div className="no-scrollbar mt-8 -mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
          <div role="tablist" aria-label="Package categories" className="flex w-max gap-2.5">
            {CHECKUP_TAB_DATA.map((t) => {
              const on = t.id === tabId
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`checkup-tab-${t.id}`}
                  aria-selected={on}
                  aria-controls="checkup-grid"
                  onClick={() => setTabId(t.id)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-[14px] font-semibold transition-[color,background-color,border-color] duration-150 ease-out ${
                    on
                      ? 'border-ink bg-ink text-white'
                      : 'border-ink/15 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        <div
          id="checkup-grid"
          role="tabpanel"
          aria-labelledby={`checkup-tab-${activeTab.id}`}
          className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {activeTab.packages.map((pkg, i) => (
            <LandingPopularCheckupCard key={pkg.id} pkg={pkg} tone={CHECKUP_TONES[i % CHECKUP_TONES.length]} />
          ))}
        </div>
      </div>
    </section>
  )
}
