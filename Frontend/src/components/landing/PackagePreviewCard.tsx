import { Activity, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LandingPackagePreview } from '@/data/landing-nav-data'
import { bookStartUrl } from '@/booking/booking-url'
import { formatMoney } from '@/lib/utils'

type Props = {
  pkg: LandingPackagePreview
  onAction?: () => void
}

export function PackagePreviewCard({ pkg, onAction }: Props) {
  const save = pkg.mrp > 0 ? Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100) : 0
  const comingSoon = pkg.price <= 0

  return (
    <article className="group flex h-full flex-col rounded-[22px] border border-ink/10 bg-white p-2.5 transition duration-200 ease-out hover:-translate-y-1 hover:border-teal/30 hover:shadow-[0_12px_32px_rgba(16,52,74,0.12)]">
      <div className="relative flex min-h-[112px] flex-col rounded-[16px] bg-[#f4f8fb] p-4">
        <div className="flex items-start justify-between gap-3">
          {pkg.tag ? (
            <span className="rounded-full bg-teal px-2.5 py-1 text-[11px] font-semibold text-white">{pkg.tag}</span>
          ) : (
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">Member rate</span>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal shadow-sm">
            <Activity className="h-4 w-4" aria-hidden />
          </span>
        </div>
        <h4 className="mt-3 font-display text-[15px] font-bold leading-snug text-ink">{pkg.name}</h4>
        <p className="mt-1 text-[12px] text-ink-soft">
          {pkg.tests > 0 ? `${pkg.tests} tests · ${pkg.reportIn}` : pkg.reportIn}
        </p>
      </div>
      <div className="mt-3 flex flex-1 flex-col px-1 pb-1">
        <div className="flex items-baseline gap-2">
          {comingSoon ? (
            <span className="text-lg font-bold text-ink-soft">Coming soon</span>
          ) : (
            <>
              <span className="text-xl font-bold text-brand-red">{formatMoney(pkg.price)}</span>
              <span className="text-sm text-ink-soft line-through">{formatMoney(pkg.mrp)}</span>
            </>
          )}
        </div>
        {!comingSoon && save > 0 ? (
          <p className="mt-1 text-[11px] font-semibold text-success">Save {save}% vs MRP</p>
        ) : null}
        {comingSoon ? (
          <span className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft">
            Notify me
          </span>
        ) : (
          <Link
            to={bookStartUrl({
              id: pkg.id,
              name: pkg.name,
              memberPrice: pkg.price,
              mrp: pkg.mrp,
              testCount: pkg.tests,
            })}
            onClick={onAction}
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-teal-dark"
          >
            Book
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  )
}
