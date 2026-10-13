import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SCAN_TESTS } from '@/data/landing-scans-data'
import { serviceBrowsePath } from '@/data/service-browse'

function ScanBottomSheetCard({ test }: { test: (typeof SCAN_TESTS)[0] }) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const togglePointer = (pointerType: string) => {
    if (pointerType !== 'mouse') setOpen((s) => !s)
  }

  const bookTo =
    test.id === 'ultrasound'
      ? serviceBrowsePath('radiology', 'usg')
      : test.id === 'digital-xray'
        ? serviceBrowsePath('radiology', 'xray')
        : serviceBrowsePath('ecg', 'heart')

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
                to={bookTo}
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
            Ultrasound, digital X-ray and ECG at member prices in Nashik — hover a card to see details and book.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
          {SCAN_TESTS.map((test) => (
            <ScanBottomSheetCard key={test.id} test={test} />
          ))}
        </div>
      </div>
    </section>
  )
}
