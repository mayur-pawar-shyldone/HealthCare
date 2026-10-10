import { HealthVerticalPanel } from '@/components/landing/HealthVerticalPanel'

export function LandingLabVerticalSection() {
  return (
    <section id="lab-vertical" className="mx-auto max-w-7xl overflow-hidden px-6 py-10" aria-labelledby="lab-vertical-heading">
      <div className="mb-6">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-brand-600">Lab tests by concern</p>
        <h2 className="mt-2 font-display text-[26px] font-extrabold leading-snug text-ink">
          Find the right test, faster
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
          Pick a health need on the left — lab tests on the right update instantly.
        </p>
      </div>
      <HealthVerticalPanel />
    </section>
  )
}
