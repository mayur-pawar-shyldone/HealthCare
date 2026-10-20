import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown, RotateCw, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SCAN_LAYOUT_OPTIONS, SCAN_TESTS } from '@/data/landing-scans-data'

function ScanOptionHeader({ label, title, note }: { label: string; title: string; note: string }) {
  return (
    <header className="mx-auto mb-8 max-w-2xl text-center">
      <span className="rounded-full bg-coral px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white">{label}</span>
      <h3 className="mt-3 font-display text-[24px] font-extrabold tracking-tight text-ink sm:text-[28px]">{title}</h3>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{note}</p>
    </header>
  )
}

function ScanBottomSheetCard({ test }: { test: (typeof SCAN_TESTS)[0] }) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const togglePointer = (pointerType: string) => {
    if (pointerType !== 'mouse') setOpen((s) => !s)
  }

  return (
    <article
      className="group relative h-[420px] overflow-hidden rounded-[26px] bg-ink"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onPointerDown={(e) => togglePointer(e.pointerType)}
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${test.name}, starting at ₹${test.offerPrice}`}
    >
      <motion.img
        src={test.image}
        alt={test.name}
        className="absolute inset-0 h-full w-full object-cover"
        animate={reduceMotion ? undefined : { scale: open ? 1.05 : 1 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[26px] bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[19px] font-bold text-ink">{test.name}</h3>
            <p className="mt-0.5 text-[14px]">
              <span className="mr-2 text-ink-muted line-through">₹{test.originalPrice}</span>
              <span className="text-[19px] font-bold text-brand-600">₹{test.offerPrice}</span>
            </p>
          </div>
          <motion.span
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint text-ink-soft"
            animate={reduceMotion ? undefined : { rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-hidden
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </div>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="details"
              initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">{test.description}</p>
              <ul className="mt-3 space-y-1.5">
                {test.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] leading-snug text-ink-soft">
                    <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-coral-soft">
                      <Check className="h-2 w-2 text-coral-dark" aria-hidden />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="mt-4 block w-full rounded-xl bg-brand-600 py-2.5 text-center text-[14px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-700"
              >
                Book Now
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </article>
  )
}

function ScanFlipCard({ test }: { test: (typeof SCAN_TESTS)[0] }) {
  const [flipped, setFlipped] = useState(false)
  const reduceMotion = useReducedMotion()

  const togglePointer = (pointerType: string) => {
    if (pointerType !== 'mouse') setFlipped((s) => !s)
  }

  return (
    <div
      className="h-[420px] [perspective:1200px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      onPointerDown={(e) => togglePointer(e.pointerType)}
      tabIndex={0}
      role="group"
      aria-label={`${test.name}, starting at ₹${test.offerPrice}. Activate to see details.`}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={reduceMotion ? undefined : { rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <article
          className="absolute inset-0 overflow-hidden rounded-[26px] bg-ink [backface-visibility:hidden]"
          style={reduceMotion && flipped ? { visibility: 'hidden' } : undefined}
        >
          <img src={test.image} alt={test.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent" />
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink-soft backdrop-blur">
            <RotateCw className="h-3.5 w-3.5" aria-hidden />
            Hover to flip
          </span>
          <div className="absolute bottom-5 left-5 right-5">
            <h3 className="font-display text-[24px] font-extrabold text-white">{test.name}</h3>
            <p className="mt-1 text-[14px] text-white">
              Starting @{' '}
              <span className="text-white/70 line-through">₹{test.originalPrice}</span>{' '}
              <span className="text-[19px] font-bold text-coral-bright">₹{test.offerPrice}</span>
            </p>
          </div>
        </article>
        <article
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[26px] bg-brand-600 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={reduceMotion && !flipped ? { visibility: 'hidden' } : undefined}
        >
          <h3 className="font-display text-[20px] font-extrabold text-white">{test.name}</h3>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/90">{test.description}</p>
          <ul className="mt-4 space-y-2">
            {test.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13.5px] leading-snug text-white">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-coral">
                  <Check className="h-2.5 w-2.5 text-white" aria-hidden />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-white/15 pt-4">
            <p>
              <span className="mr-2 text-[14px] text-white/70 line-through">₹{test.originalPrice}</span>
              <span className="text-[24px] font-extrabold text-white">₹{test.offerPrice}</span>
            </p>
            <Link
              to="/signup"
              className="rounded-full bg-coral px-5 py-2 text-[14px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-coral-dark"
            >
              Book Now
            </Link>
          </div>
        </article>
      </motion.div>
    </div>
  )
}

export function LandingScansSection() {
  return (
    <section id="scans" className="relative overflow-hidden bg-mint py-20" aria-labelledby="scans-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-600">
            <ScanLine className="h-3.5 w-3.5" aria-hidden />
            Imaging &amp; scans
          </span>
          <h2 id="scans-heading" className="mt-4 font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink sm:text-[36px]">
            Health Scans &amp; Imaging Tests
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
            Ultrasound, digital X-ray and ECG at member prices — two card directions for the same three tests, so you can pick the one
            that fits the page.
          </p>
        </div>

        <div className="mt-14">
          <ScanOptionHeader {...SCAN_LAYOUT_OPTIONS[0]} />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {SCAN_TESTS.map((test) => (
              <ScanBottomSheetCard key={test.id} test={test} />
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-ink/10 pt-14">
          <ScanOptionHeader {...SCAN_LAYOUT_OPTIONS[1]} />
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {SCAN_TESTS.map((test) => (
              <ScanFlipCard key={`flip-${test.id}`} test={test} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
