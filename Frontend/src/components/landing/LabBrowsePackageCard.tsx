import { Activity, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LandingPackagePreview } from '@/data/landing-nav-data'
import { serviceBrowsePath, type BrowseCategoryId } from '@/data/service-browse'
import { useCartActions } from '@/components/site/useCartActions'
import { useBookingCart } from '@/cart/BookingCartContext'
import { resolveCartPackageImage } from '@/lib/cart-package-image'

type Props = {
  pkg: LandingPackagePreview
  onNavigate?: () => void
  browseCategoryId?: BrowseCategoryId
  browseTabId?: string
}

/** Package tile — browse-by-need mega menu (Blood Test, ECG, etc.). */
export function LabBrowsePackageCard({ pkg, onNavigate, browseCategoryId, browseTabId }: Props) {
  const { addToCart, addAndBook } = useCartActions()
  const cartUi = useBookingCart()
  const cartItem = {
    id: pkg.id,
    name: pkg.name,
    memberPrice: pkg.price,
    mrp: pkg.mrp,
    testCount: pkg.tests,
    imageUrl: resolveCartPackageImage(pkg.id),
  }
  const browseTo =
    browseCategoryId && browseTabId ? serviceBrowsePath(browseCategoryId, browseTabId, pkg.id) : '/browse/health-checkups'
  const save = pkg.mrp > 0 ? Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100) : 0
  const comingSoon = pkg.price <= 0
  const isInstant = /instant/i.test(pkg.reportIn)
  const isService = !comingSoon && pkg.tests <= 1
  const reportValue = isInstant
    ? 'Same day'
    : pkg.reportIn.replace(/\s*(hrs?|hours?)\b/i, '').trim() || pkg.reportIn
  const stat1Value = isService ? '1' : String(pkg.tests)
  const stat1Label = isService ? 'Session' : 'Tests'
  const stat2Value = isService && isInstant ? 'Video' : reportValue
  const stat2Label = isService ? (isInstant ? 'Connect' : 'Plan in') : 'Report in'
  const knowMore =
    pkg.id.startsWith('doc-') || pkg.id.startsWith('ayu-')
      ? 'Know more — view all services'
      : 'Know more — view all tests'

  return (
    <article className="group/card flex h-full flex-col rounded-[22px] border border-ink/10 bg-white p-2.5 transition duration-200 ease-out hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <div className="relative flex min-h-[100px] flex-col rounded-[16px] bg-mint p-4">
        <div className="flex items-start justify-between gap-3">
          {pkg.tag ? (
            <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold text-white">{pkg.tag}</span>
          ) : (
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">Member rate</span>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
            <Activity className="h-4 w-4" aria-hidden />
          </span>
        </div>
        <h4 className="mt-3 font-display text-[15px] font-bold leading-snug text-ink">{pkg.name}</h4>
      </div>

      <div className="mt-3 flex flex-1 flex-col px-1 pb-1">
        {!comingSoon ? (
          <div className="grid grid-cols-3 gap-1 border-y border-ink/10 py-3 text-center">
            <div>
              <p className="text-[15px] font-bold leading-none text-ink">{stat1Value}</p>
              <p className="mt-1 text-[10px] font-medium text-ink-muted">{stat1Label}</p>
            </div>
            <div className="border-x border-ink/10 px-1">
              <p className="text-[15px] font-bold leading-none text-ink">{stat2Value}</p>
              <p className="mt-1 text-[10px] font-medium text-ink-muted">{stat2Label}</p>
            </div>
            <div>
              <p className="text-[15px] font-bold leading-none text-ink">{save}%</p>
              <p className="mt-1 text-[10px] font-medium text-ink-muted">You save</p>
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex items-baseline gap-2">
          {comingSoon ? (
            <span className="text-lg font-bold text-ink-soft">Coming soon</span>
          ) : (
            <>
              <span className="text-xl font-bold text-brand-600">₹{pkg.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-ink-muted line-through">₹{pkg.mrp.toLocaleString('en-IN')}</span>
            </>
          )}
        </div>

        {comingSoon ? (
          <span className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft">
            Notify me
          </span>
        ) : (
          <>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  addToCart(cartItem)
                  cartUi.openDrawer()
                  onNavigate?.()
                }}
                className="inline-flex h-10 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink hover:border-teal/40"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => {
                  addAndBook(cartItem)
                  onNavigate?.()
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Book now
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <Link
              to={browseTo}
              onClick={onNavigate}
              className="mt-3 text-center text-[12px] font-medium text-ink-muted transition hover:text-teal"
            >
              {knowMore}
            </Link>
          </>
        )}
      </div>
    </article>
  )
}
