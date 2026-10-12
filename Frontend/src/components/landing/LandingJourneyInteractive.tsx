import { useState } from 'react'
import { ArrowRight, Barcode, MessageCircle, Smartphone, UserCheck } from 'lucide-react'
import { JOURNEY_STEP_TAGS, JOURNEY_STEPS, type JourneyStepIconId } from '@/data/landing-healthid-content'

const ICONS: Record<JourneyStepIconId, typeof Smartphone> = {
  smartphone: Smartphone,
  userCheck: UserCheck,
  barcode: Barcode,
  message: MessageCircle,
}

function stepIconClasses(on: boolean, done: boolean) {
  if (on) {
    return 'scale-105 bg-brand-500 text-white shadow-[0_10px_26px_-10px_rgba(29,108,140,0.85)]'
  }
  if (done) {
    return 'bg-brand-200 text-brand-700'
  }
  return 'border border-brand-200/80 bg-brand-100 text-brand-700 group-hover:bg-brand-200/60'
}

function stepBadgeClasses(on: boolean) {
  return on ? 'bg-coral text-white' : 'bg-ink text-white'
}

function stepTagClasses(on: boolean) {
  return on ? 'bg-coral-soft text-coral-dark' : 'bg-mint text-ink-muted'
}

/** HealthID `jk` */
export function LandingJourneyInteractive() {
  const [active, setActive] = useState(0)
  const progress = (active / (JOURNEY_STEPS.length - 1)) * 100

  return (
    <section id="journey" className="bg-white py-20" aria-labelledby="journey-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-600">How it works</span>
          <h2
            id="journey-heading"
            className="mt-3 font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]"
          >
            Your health checkup, in four steps
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            From booking to report, here is exactly what happens and who handles your sample. Tap a step to see where you
            are in the journey.
          </p>
        </div>

        <ol className="relative mt-16 hidden gap-6 lg:grid lg:grid-cols-4">
          <span className="absolute left-0 right-0 top-[34px] h-0.5 rounded-full bg-ink/10" aria-hidden />
          <span
            aria-hidden
            className="absolute left-0 top-[34px] h-0.5 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-coral transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {JOURNEY_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon]
            const on = i === active
            const done = i < active
            return (
              <li key={step.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={on ? 'step' : undefined}
                  className="group flex w-full flex-col items-start text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2"
                >
                  <span
                    className={`relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full ring-8 ring-white transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-out ${stepIconClasses(on, done)}`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={on ? 2 : 1.75} aria-hidden />
                    <span
                      className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] font-bold transition-colors duration-300 ${stepBadgeClasses(on)}`}
                    >
                      {i + 1}
                    </span>
                  </span>
                  <span
                    className={`mt-6 inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-bold transition-colors duration-300 ${stepTagClasses(on)}`}
                  >
                    {JOURNEY_STEP_TAGS[i]}
                  </span>
                  <h3 className="mt-3 font-display text-[17px] font-bold leading-snug text-ink">{step.title}</h3>
                  <p className="mt-2 max-w-[270px] text-[14px] leading-relaxed text-ink-soft">{step.description}</p>
                </button>
              </li>
            )
          })}
        </ol>

        <ol className="relative mt-12 space-y-8 lg:hidden">
          {JOURNEY_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon]
            const on = i === active
            const done = i < active
            return (
              <li key={step.id} className="relative">
                {i < JOURNEY_STEPS.length - 1 ? (
                  <span
                    className="absolute left-[33px] top-[76px] h-[calc(100%-3.5rem)] w-0.5 rounded-full bg-ink/10"
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={on ? 'step' : undefined}
                  className="flex w-full items-start gap-5 text-left"
                >
                  <span
                    className={`relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full ring-8 ring-white transition-colors duration-300 ${stepIconClasses(on, done)}`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={on ? 2 : 1.75} aria-hidden />
                    <span
                      className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] font-bold ${stepBadgeClasses(on)}`}
                    >
                      {i + 1}
                    </span>
                  </span>
                  <span className="pt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-bold ${stepTagClasses(on)}`}>
                      {JOURNEY_STEP_TAGS[i]}
                    </span>
                    <span className="mt-2 block font-display text-[18px] font-bold leading-snug text-ink">{step.title}</span>
                    <span className="mt-1.5 block max-w-md text-[14.5px] leading-relaxed text-ink-soft">{step.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-[26px] bg-mint px-8 py-7 sm:flex-row sm:items-center">
          <div className="text-center sm:text-left">
            <p className="font-display text-[20px] font-extrabold text-ink">Two minutes to book. Report within 6 hours.</p>
            <p className="mt-1 text-[14.5px] text-ink-soft">Free home collection and a free doctor call on every package.</p>
          </div>
          <a
            href="#packages"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-coral px-7 text-[15px] font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-coral-dark active:scale-[0.98]"
          >
            Book a test
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
