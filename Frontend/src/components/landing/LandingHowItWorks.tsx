import { useState } from 'react'
import { Calendar, Home, MessageCircle, TestTube2 } from 'lucide-react'

const STEPS = [
  {
    id: 'book',
    title: 'Book in minutes',
    description: 'Pick a test or package, choose home collection, and confirm your slot.',
    icon: Calendar,
    tag: 'Step 1',
  },
  {
    id: 'collect',
    title: 'We collect at home',
    description: 'Certified phlebotomists visit your doorstep — barcoded, temp-tracked samples.',
    icon: Home,
    tag: 'Step 2',
  },
  {
    id: 'lab',
    title: 'NABL partner processing',
    description: 'Your sample is processed at accredited labs with quality checks at every stage.',
    icon: TestTube2,
    tag: 'Step 3',
  },
  {
    id: 'report',
    title: 'Reports on WhatsApp',
    description: 'Digital reports in your account, with instant WhatsApp delivery when ready.',
    icon: MessageCircle,
    tag: 'Step 4',
  },
]

export function LandingHowItWorks() {
  const [active, setActive] = useState(0)
  const progress = ((active + 1) / STEPS.length) * 100

  return (
    <section id="how" className="bg-white py-20" aria-labelledby="how-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 id="how-heading" className="font-display text-[32px] font-extrabold leading-tight text-ink sm:text-[40px]">
            Your health checkup, in four steps
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            From booking to report — tap a step to see where you are in the journey.
          </p>
        </div>

        <ol className="relative mt-16 hidden gap-6 lg:grid lg:grid-cols-4">
          <span className="absolute left-0 right-0 top-[34px] h-0.5 rounded-full bg-ink/10" aria-hidden />
          <span
            className="absolute left-0 top-[34px] h-0.5 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-coral transition-[width] duration-500"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const on = i === active
            const done = i < active
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={on ? 'step' : undefined}
                  className="group flex w-full flex-col items-start text-left"
                >
                  <span
                    className={`relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full ring-8 ring-white transition ${
                      on
                        ? 'scale-105 bg-brand-500 text-white shadow-[0_10px_26px_-10px_rgba(29,108,140,0.85)]'
                        : done
                          ? 'bg-brand-200 text-brand-700'
                          : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100'
                    }`}
                  >
                    <Icon className="h-7 w-7" aria-hidden />
                    <span
                      className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] font-bold ${
                        on ? 'bg-coral text-white' : 'bg-ink text-white'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </span>
                  <span
                    className={`mt-6 inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                      on ? 'bg-coral-soft text-coral-dark' : 'bg-mint text-ink-muted'
                    }`}
                  >
                    {step.tag}
                  </span>
                  <h3 className={`mt-3 font-display text-[17px] font-bold ${on ? 'text-brand-600' : 'text-ink'}`}>
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[270px] text-[14px] leading-relaxed text-ink-soft">{step.description}</p>
                </button>
              </li>
            )
          })}
        </ol>

        <ol className="relative mt-12 space-y-8 lg:hidden">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const on = i === active
            return (
              <li key={step.id} className="relative">
                <button type="button" onClick={() => setActive(i)} className="flex w-full items-start gap-5 text-left">
                  <span
                    className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
                      on ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'
                    }`}
                  >
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <span>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">{step.tag}</span>
                    <h3 className="mt-1 font-display text-lg font-bold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
