import { useState } from 'react'
import { ArrowRight, Clock, FileText, Users } from 'lucide-react'
import { useCartActions } from '@/components/site/useCartActions'
import { useBookingCart } from '@/cart/BookingCartContext'
import { resolveCartPackageImage } from '@/lib/cart-package-image'
import {
  SHOWCASE_VISIBLE_INCLUDES,
  showcaseMetaLines,
  type ShowcasePackage,
} from '@/data/landing-showcase'

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

const META_ICONS = [Clock, Users, FileText] as const

/** HealthID `uk` — showcase package card */
export function LandingShowcaseCard({ pkg, bookTo }: { pkg: ShowcasePackage; bookTo?: string }) {
  const { addToCart, addAndBook } = useCartActions()
  const cartUi = useBookingCart()
  const cartItem = {
    id: pkg.id,
    name: pkg.name,
    memberPrice: pkg.memberPrice,
    mrp: pkg.mrp,
    testCount: pkg.testCount,
    imageUrl: resolveCartPackageImage(pkg.id),
  }
  const [expandedIncludes, setExpandedIncludes] = useState(false)
  void bookTo // optional deep-link override from parent browse cards

  const savePct = Math.round(((pkg.mrp - pkg.memberPrice) / pkg.mrp) * 100)
  const extraIncludes = Math.max(0, pkg.includes.length - SHOWCASE_VISIBLE_INCLUDES)
  const visibleIncludes = expandedIncludes ? pkg.includes : pkg.includes.slice(0, SHOWCASE_VISIBLE_INCLUDES)
  const metaLines = showcaseMetaLines(pkg)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-white">
      <div className="flex flex-1 flex-col p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-editorial text-[19px] font-bold uppercase leading-tight tracking-[0.01em] text-ink">
            {pkg.name}
          </h3>
          <span className="shrink-0 rounded-full bg-teal px-3 py-1.5 text-[12.5px] font-bold text-white">
            {pkg.testCount} tests
          </span>
        </div>
        <p className="mt-4 text-[13px] font-bold text-ink-soft">Tests Included:</p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
          {visibleIncludes.join(', ')}
          {extraIncludes > 0 ? (
            <>
              {!expandedIncludes ? <span aria-hidden>, …</span> : null}{' '}
              <button
                type="button"
                onClick={() => setExpandedIncludes((v) => !v)}
                aria-expanded={expandedIncludes}
                className="font-bold text-ink underline decoration-line underline-offset-2 transition-colors duration-150 ease-out hover:text-teal"
              >
                {expandedIncludes ? 'less' : 'more'}
              </button>
            </>
          ) : null}
        </p>

        <div className="mt-5 border-t border-line pt-4">
          <button
            type="button"
            className="text-[14px] font-bold text-ink transition-colors duration-150 ease-out hover:text-teal"
          >
            + Know more
          </button>
        </div>

        <ul className="mt-5 space-y-2.5">
          {metaLines.map((line, y) => {
            const Icon = META_ICONS[y] ?? Clock
            return (
              <li key={line} className="flex items-start gap-2.5 text-[14px] text-ink-soft">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {line}
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-[12.5px] font-bold text-success">Saves {savePct}% with your HealthID Card</p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="text-[22px] font-extrabold leading-none text-ink">
              {formatInr(pkg.memberPrice)}
              <span className="ml-1 text-[13px] font-semibold text-ink-soft">per person</span>
            </p>
            <p className="mt-2 text-[13px] font-semibold text-ink-soft">
              <span className="line-through">{formatInr(pkg.mrp)}</span>
              <span className="ml-1.5">MRP</span>
            </p>
          </div>
          <div className="grid w-full min-w-[240px] grid-cols-2 gap-2 sm:w-[280px]">
            <button
              type="button"
              onClick={() => {
                addToCart(cartItem)
                cartUi.openDrawer()
              }}
              className="inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl border border-line px-3 text-[13px] font-bold leading-tight text-ink transition hover:border-teal/40 sm:text-[13.5px]"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => addAndBook(cartItem)}
              className="inline-flex h-12 w-full min-w-0 items-center justify-center gap-1.5 rounded-xl bg-teal px-3 text-[13px] font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-teal-dark active:scale-[0.98] sm:text-[13.5px]"
            >
              Book now
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
