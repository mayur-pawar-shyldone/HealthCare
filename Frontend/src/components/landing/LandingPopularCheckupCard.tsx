import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ArrowRight,
  Clock,
  FileText,
  Heart,
  TestTube2,
  Users,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  CHECKUP_TONE_CLASSES,
  CHECKUP_VISIBLE_TAGS,
  type CheckupPackage,
  type CheckupTone,
} from '@/data/landing-checkup-tabs'

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function packageTestIcon(name: string): LucideIcon {
  const n = name.toLowerCase()
  if (n.includes('diabetic') || n.includes('diabetes') || n.includes('glucose')) return TestTube2
  if (n.includes('thyroid')) return Activity
  if (n.includes('heart') || n.includes('cardiac') || n.includes('lipid')) return Heart
  if (n.includes('vitamin') || n.includes('nutrition')) return Activity
  if (n.includes('allergy')) return Activity
  return TestTube2
}

const META_ICONS = [Clock, Users, FileText] as const

type Props = {
  pkg: CheckupPackage
  tone: CheckupTone
}

/** HealthID `rk` — Popular packages card */
export function LandingPopularCheckupCard({ pkg, tone }: Props) {
  const [expandedTags, setExpandedTags] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const TestIcon = useMemo(() => packageTestIcon(pkg.name), [pkg.name])
  const extraCount = Math.max(0, pkg.includes.length - CHECKUP_VISIBLE_TAGS)
  const visibleTags = expandedTags ? pkg.includes : pkg.includes.slice(0, CHECKUP_VISIBLE_TAGS)
  const metaLines = [pkg.fasting, pkg.recommendedFor, pkg.reportTime]

  return (
    <>
      <article className="group flex h-full flex-col rounded-[24px] border border-ink/10 bg-white p-2.5 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
        <div className={`flex flex-1 flex-col rounded-[17px] p-5 ${CHECKUP_TONE_CLASSES[tone]}`}>
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-ink">{pkg.testCount}+ Tests</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
              <TestIcon className="h-6 w-6" aria-hidden />
            </span>
          </div>
          <h3 className="mt-4 font-display text-[20px] font-extrabold leading-snug text-ink">{pkg.name}</h3>
          <p className="mt-4 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Tests included</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {visibleTags.map((test) => (
              <li
                key={test}
                className="rounded-full border border-ink/15 px-2.5 py-1 text-[11.5px] font-medium leading-snug text-ink-soft"
              >
                {test}
              </li>
            ))}
            {extraCount > 0 ? (
              <li>
                <button
                  type="button"
                  onClick={() => setExpandedTags((v) => !v)}
                  aria-expanded={expandedTags}
                  className="rounded-full border border-ink/15 px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft transition-colors duration-150 ease-out hover:border-ink/40 hover:text-ink"
                >
                  {expandedTags ? 'Show less' : `+${extraCount} more`}
                </button>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="flex flex-col px-3 pb-1 pt-5">
          <ul className="space-y-2">
            {metaLines.map((line, d) => {
              const Icon = META_ICONS[d] ?? Clock
              return (
                <li key={line} className="flex items-start gap-2.5 text-[12.5px] text-ink-soft">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
                  {line}
                </li>
              )
            })}
          </ul>
          <div className="mt-auto pt-5">
            <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
              <div className="flex items-end justify-between gap-3">
                <p>
                  <span className="block font-display text-[26px] font-extrabold leading-none text-ink">{formatInr(pkg.price)}</span>
                  <span className="mt-1.5 block text-[12px] text-ink-muted">
                    per person · <span className="line-through">{formatInr(pkg.mrp)}</span>
                  </span>
                </p>
                <Link
                  to="/signup"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-brand-600 active:scale-[0.98]"
                >
                  Book now
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full rounded-full border border-ink/15 bg-white py-2 text-[13px] font-semibold text-ink-soft transition-colors duration-150 ease-out hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
              >
                Know more — view all tests
              </button>
            </div>
          </div>
        </div>
      </article>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
          role="presentation"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`checkup-modal-${pkg.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <TestIcon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 id={`checkup-modal-${pkg.id}`} className="font-display text-lg font-bold text-ink">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-ink-muted">{pkg.testCount} tests included</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-6 rounded-xl bg-mint p-4">
              <ul className="space-y-2">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="mt-6 space-y-3 rounded-xl border border-ink/10 p-4">
              {metaLines.map((line, d) => {
                const Icon = META_ICONS[d] ?? Clock
                return (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                    {line}
                  </li>
                )
              })}
            </ul>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-zinc-50 p-4">
              <div>
                <p className="text-sm text-ink-muted">Price per person</p>
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-extrabold text-ink">{formatInr(pkg.price)}</span>
                  <span className="text-sm text-ink-muted line-through">{formatInr(pkg.mrp)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Got it
              </button>
            </div>
            <Link
              to="/signup"
              onClick={() => setModalOpen(false)}
              className="mt-4 block w-full rounded-full bg-ink py-3 text-center text-sm font-semibold text-white hover:bg-brand-600"
            >
              Book now
            </Link>
          </div>
        </div>
      ) : null}
    </>
  )
}
