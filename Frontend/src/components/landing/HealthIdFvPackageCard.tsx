import { ArrowRight, Check, Home, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FvPackage } from '@/data/landing-healthid-content'
import { bookStartUrl } from '@/booking/booking-url'

const PREVIEW_COUNT = 3

function savePct(price: number, mrp: number) {
  return Math.round(((mrp - price) / mrp) * 100)
}

type Props = {
  pkg: FvPackage
  tint: string
}

export function HealthIdFvPackageCard({ pkg, tint }: Props) {
  const save = savePct(pkg.price, pkg.mrp)
  const preview = pkg.includes.slice(0, PREVIEW_COUNT)

  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-ink/10 bg-white p-2.5 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <div className={`flex flex-1 flex-col rounded-[17px] p-5 ${tint}`}>
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-ink">{pkg.tests} tests</span>
          {pkg.badge ? (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">{pkg.badge}</span>
          ) : null}
        </div>
        <h3 className="mt-5 font-display text-[19px] font-extrabold leading-snug text-ink">{pkg.name}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{pkg.summary}</p>
        {preview.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {preview.map((item) => (
              <li key={item} className="flex gap-2 text-[13px] leading-snug text-ink-soft">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="mt-auto space-y-2 pt-5">
          <li className="flex items-center gap-2.5 text-[12.5px] text-ink-soft">
            <Timer className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
            Report in {pkg.reportTime}
          </li>
          <li className="flex items-center gap-2.5 text-[12.5px] text-ink-soft">
            <Home className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
            Free home collection
          </li>
        </ul>
      </div>
      <div className="px-3 pb-1 pt-5">
        <div className="flex items-end justify-between gap-3 border-t border-ink/10 pt-4">
          <div>
            <p className="font-display text-[24px] font-extrabold leading-none text-ink">₹{pkg.price.toLocaleString('en-IN')}</p>
            <p className="mt-1.5 text-[12px] text-ink-muted">
              <span className="line-through">₹{pkg.mrp.toLocaleString('en-IN')}</span>
              {save > 0 ? <span className="ml-1.5 font-bold text-coral">{save}% off</span> : null}
            </p>
            <p className="mt-1 text-[11.5px] text-ink-muted">per person</p>
          </div>
          <Link
            to={bookStartUrl({
              id: pkg.id,
              name: pkg.name,
              memberPrice: pkg.price,
              mrp: pkg.mrp,
              testCount: pkg.tests,
            })}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-brand-600 active:scale-[0.98]"
          >
            Book now
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
