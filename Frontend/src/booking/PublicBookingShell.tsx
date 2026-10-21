import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { cartSubtotal, type PublicBookingDraft } from '@/booking/booking-session'
import { useAccount } from '@/account/AccountContext'
import { LandingCartButton } from '@/components/site/LandingCartDrawer'
import { LandingProfileMenu } from '@/components/site/LandingProfileMenu'
import { resolveCartPackageImage } from '@/lib/cart-package-image'

function BookingProgressBar({
  completedSteps,
  totalSteps,
}: {
  completedSteps: number
  totalSteps: number
}) {
  return (
    <div className="hidden w-full max-w-[min(100%,420px)] flex-col items-center gap-2 md:flex">
      <div className="flex w-full items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        <span className="text-navy/70">Progress</span>
        <span className="rounded-full bg-mp-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-mp-teal-700">
          {completedSteps} / {totalSteps}
        </span>
      </div>
      <div className="flex w-full gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => {
          const done = i < completedSteps
          const current = i === completedSteps
          return (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                done ? 'bg-mp-teal shadow-[0_0_0_1px_rgba(23,90,118,0.08)]' : current ? 'bg-mp-teal/35' : 'bg-mp-teal-50'
              }`}
              aria-hidden
            />
          )
        })}
      </div>
    </div>
  )
}

export function PublicBookingShell({
  children,
  summary,
  progressPct: _progressPct = 0,
  completedSteps = 0,
  totalSteps = 6,
}: {
  children: ReactNode
  summary?: ReactNode
  progressPct?: number
  completedSteps?: number
  totalSteps?: number
}) {
  const acc = useAccount()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-canvas font-sans text-navy">
      <div className="shrink-0 border-b border-mp-coral-100 bg-mp-coral-50 px-4 py-2 text-center text-[13px] text-brick">
        <span className="font-semibold">Nashik</span>
        <span className="text-muted"> · Free home collection · Pay cash or UPI at sample collection</span>
      </div>

      <header className="sticky top-0 z-30 shrink-0 border-b border-line bg-white">
        <div className="mx-auto grid h-[64px] max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 lg:h-[68px] lg:gap-6 lg:px-5">
          <Link to="/" className="shrink-0 justify-self-start" aria-label="HealthID Card home">
            <Logo variant="compact" className="!h-11 !max-w-[200px] sm:!h-12 sm:!max-w-[240px]" />
          </Link>

          <div className="min-w-0 justify-self-center px-1">
            <BookingProgressBar completedSteps={completedSteps} totalSteps={totalSteps} />
            <p className="mt-1 text-center text-[11px] font-medium text-muted md:hidden">
              Step {Math.min(completedSteps + 1, totalSteps)} of {totalSteps}
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 justify-self-end">
            <LandingCartButton />
            {acc.authed ? <LandingProfileMenu /> : null}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col gap-4 px-4 py-4 md:px-5 lg:grid lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-4 lg:overflow-hidden lg:py-4">
        <div className="min-h-0 min-w-0 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1 [scrollbar-gutter:stable]">
          {children}
        </div>
        {summary ? (
          <aside className="min-w-0 shrink-0 lg:sticky lg:top-[4.25rem] lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
            {summary}
          </aside>
        ) : null}
      </div>
    </div>
  )
}

export function BookingCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[20px] bg-white p-3.5 sm:p-4 ${className}`}>{children}</div>
}

export function BookingPrimaryButton({
  children,
  type = 'button',
  disabled,
  onClick,
  accent = 'navy',
}: {
  children: ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  accent?: 'navy' | 'coral'
}) {
  const accentClass =
    accent === 'coral'
      ? 'bg-mp-coral hover:bg-mp-coral-600'
      : 'bg-navy hover:bg-navy-600'
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${accentClass}`}
    >
      {children}
    </button>
  )
}

export function BookingGhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors duration-150 hover:bg-canvas"
    >
      {children}
    </button>
  )
}

export function OrderSummaryPanel({ draft, memberRoute }: { draft: PublicBookingDraft; memberRoute: boolean }) {
  if (!draft.cart.length) return null
  const { mrp, subtotal, discount, total, lines } = cartSubtotal(draft, memberRoute)

  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-line/80">
      <div className="rounded-t-[20px] bg-navy px-4 py-4 text-white sm:px-5">
        <h3 className="text-lg font-bold tracking-tight">Summary</h3>
        <p className="mt-0.5 text-[13px] text-white/80">
          {draft.cart.length} {draft.cart.length === 1 ? 'test' : 'tests'} · Nashik
        </p>
      </div>
      <div className="p-3.5 sm:p-4">
        <ul className="space-y-3">
          {lines.map(({ item, lineTotal }) => {
            const img = resolveCartPackageImage(item.id, item.imageUrl)
            return (
              <li key={item.id} className="flex gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mp-teal-50 ring-1 ring-line/60">
                  <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-navy">{item.name}</p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {item.testCount} {item.testCount === 1 ? 'test' : 'tests'}
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-navy">₹{lineTotal.toLocaleString('en-IN')}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-3 text-[13px]">
          <div className="flex justify-between text-muted">
            <dt>MRP</dt>
            <dd className="line-through">₹{mrp.toLocaleString('en-IN')}</dd>
          </div>
          {memberRoute && draft.memberDiscountEligible ? (
            <div className="flex justify-between font-medium text-mp-teal-700">
              <dt>Member savings</dt>
              <dd>− ₹{discount.toLocaleString('en-IN')}</dd>
            </div>
          ) : (
            <div className="flex justify-between text-muted">
              <dt>Your rate</dt>
              <dd className="font-medium text-navy">₹{subtotal.toLocaleString('en-IN')}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-navy">
            <dt>Due at visit</dt>
            <dd>₹{total.toLocaleString('en-IN')}</dd>
          </div>
        </dl>
        <div className="mt-4 rounded-xl bg-mp-teal-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-navy">
          Pay with <span className="font-semibold">cash or UPI</span> when we collect your sample — no online payment
          during booking.
        </div>
        {!memberRoute ? (
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Have a HealthID Card? Choose member booking in step 2 for eligible discounts.
          </p>
        ) : null}
      </div>
    </div>
  )
}
