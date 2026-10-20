import { JOURNEY_STEPS } from '@/data/landing-healthid-content'
import { JourneyFlourish } from '@/components/landing/journey/JourneyFlourish'
import { JourneyStepConnector } from '@/components/landing/journey/JourneyStepConnector'
import { JourneyStepIcon } from '@/components/landing/journey/JourneyStepIcon'

/** HealthID `Sk` */
export function LandingHealthJourneySection() {
  return (
    <section id="how" className="bg-mint py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[14px] font-medium text-ink-muted">Your HealthID</p>
          <h2
            id="how-heading"
            className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-tight text-brand-600 sm:text-[40px]"
          >
            Health Checkup Journey
          </h2>
          <JourneyFlourish />
        </div>

        <ol className="relative mt-14 hidden gap-x-10 lg:grid lg:grid-cols-4">
          {JOURNEY_STEPS.map((step, t) => (
            <li key={step.id} className="relative">
              {t < JOURNEY_STEPS.length - 1 ? <JourneyStepConnector /> : null}
              <JourneyStepIcon icon={step.icon} index={t} />
              <h3 className="mt-6 min-h-[3rem] font-display text-[17px] font-bold leading-snug text-ink">{step.title}</h3>
              <p className="mt-2.5 max-w-[270px] text-[14.5px] leading-relaxed text-ink-soft">{step.description}</p>
            </li>
          ))}
        </ol>

        <ol className="mt-12 space-y-8 lg:hidden">
          {JOURNEY_STEPS.map((step, t) => (
            <li key={step.id} className="relative flex gap-5">
              {t < JOURNEY_STEPS.length - 1 ? (
                <span
                  className="absolute left-[43px] top-[104px] h-[calc(100%-4.5rem)] border-l-2 border-dashed border-brand-200"
                  aria-hidden
                />
              ) : null}
              <div className="shrink-0">
                <JourneyStepIcon icon={step.icon} index={t} />
              </div>
              <div className="pt-4">
                <h3 className="font-display text-[18px] font-bold leading-snug text-ink">{step.title}</h3>
                <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-ink-soft">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <a
            href="#packages"
            className="inline-flex h-12 items-center rounded-full bg-coral px-8 text-[15px] font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-coral-dark active:scale-[0.98]"
          >
            Book a test
          </a>
        </div>
      </div>
    </section>
  )
}
