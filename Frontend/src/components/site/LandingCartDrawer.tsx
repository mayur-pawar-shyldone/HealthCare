import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { cartSubtotal, loadBookingDraft } from '@/booking/booking-session'
import { useBookingCart } from '@/cart/BookingCartContext'
import { resolveCartPackageImage } from '@/lib/cart-package-image'
import { navigateToPopularPlans } from '@/lib/landing-nav-scroll'

type Props = {
  open: boolean
  onClose: () => void
}

export function LandingCartDrawer({ open, onClose }: Props) {
  const cart = useBookingCart()
  const acc = useAccount()
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)

  const draft = loadBookingDraft()
  const memberRoute = draft.route === 'member' && acc.authed
  const { total, lines, mrp, discount } = cartSubtotal({ ...draft, cart: cart.cart }, memberRoute)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button type="button" aria-label="Close cart" className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-labelledby="cart-drawer-title"
        className="relative flex h-full w-full max-w-[420px] flex-col border-l border-ink/10 bg-white shadow-[0_0_60px_-12px_rgba(16,52,74,0.35)]"
      >
        <div className="relative overflow-hidden border-b border-ink/10 bg-gradient-to-br from-mint via-white to-brand-50/40 px-5 pb-5 pt-5">
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-200/40 blur-2xl" aria-hidden />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Your booking cart
              </p>
              <h2 id="cart-drawer-title" className="mt-1 font-display text-[22px] font-bold leading-tight text-ink">
                Selected tests
              </h2>
              <p className="mt-1 text-[13.5px] text-ink-muted">
                {cart.count > 0
                  ? `${cart.count} ${cart.count === 1 ? 'package' : 'packages'} · book together in one visit`
                  : 'Add popular packages from the landing page'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-ink-muted shadow-sm transition hover:border-brand-200 hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 bg-cream/50 px-6 py-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand-600">
                <ShoppingBag className="h-7 w-7" aria-hidden />
              </span>
              <p className="mt-4 text-[16px] font-bold text-ink">No tests yet</p>
              <p className="mt-2 text-[14px] leading-snug text-ink-soft">
                Pick from popular health packages — member rates apply with your free card.
              </p>
              <button
                type="button"
                onClick={() => navigateToPopularPlans(navigate, onClose)}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-bold text-white transition hover:bg-brand-600"
              >
                Browse popular tests
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map(({ item, lineTotal }) => {
                const img = resolveCartPackageImage(item.id, item.imageUrl)
                return (
                  <li
                    key={item.id}
                    className="overflow-hidden rounded-[18px] border border-ink/10 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-mint ring-1 ring-ink/5">
                        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-display text-[15px] font-bold leading-snug text-ink">{item.name}</p>
                          <p className="mt-1 text-[12.5px] font-medium text-ink-muted">
                            {item.testCount} {item.testCount === 1 ? 'test' : 'tests'}
                          </p>
                          <p className="mt-2 text-[16px] font-extrabold text-ink">₹{lineTotal.toLocaleString('en-IN')}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.removeItem(item.id)}
                          className="shrink-0 rounded-full px-2 py-1 text-[12px] font-bold text-coral transition hover:bg-coral/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {cart.cart.length > 0 ? (
          <div className="border-t border-ink/10 bg-cream/30 px-5 py-4">
            <dl className="space-y-1.5 text-[14px]">
              <div className="flex justify-between text-ink-soft">
                <dt>MRP</dt>
                <dd className="line-through">₹{mrp.toLocaleString('en-IN')}</dd>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between font-semibold text-emerald-700">
                  <dt>Member savings</dt>
                  <dd>− ₹{discount.toLocaleString('en-IN')}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-ink/10 pt-2.5 text-[18px] font-extrabold text-ink">
                <dt>Total</dt>
                <dd>₹{total.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
            {cart.undoAvailable ? (
              <button
                type="button"
                onClick={() => cart.undoRemove()}
                className="mt-2 text-[13px] font-bold text-brand-600 hover:underline"
              >
                Undo remove
              </button>
            ) : null}
            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate('/book')
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-coral text-[14px] font-bold text-white shadow-sm transition hover:bg-coral-dark"
              >
                Continue booking
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => navigateToPopularPlans(navigate, onClose)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white text-[14px] font-bold text-ink transition hover:border-brand-300 hover:bg-brand-50/50"
              >
                <Plus className="h-4 w-4 text-brand-600" aria-hidden />
                Add more tests
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

type CartButtonProps = {
  /** Header chip (landing) vs compact icon (booking shell). */
  variant?: 'header' | 'compact'
}

export function LandingCartButton({ variant = 'compact' }: CartButtonProps) {
  const { count, openDrawer } = useBookingCart()

  if (variant === 'header') {
    return (
      <button
        type="button"
        aria-label={count ? `Cart, ${count} tests selected` : 'Cart, empty'}
        onClick={openDrawer}
        className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1.5 pl-1.5 pr-3.5 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/40 sm:pr-4"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm transition group-hover:scale-[1.03]">
          <ShoppingBag className="h-4 w-4" aria-hidden />
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white ring-2 ring-white">
              {count > 9 ? '9+' : count}
            </span>
          ) : null}
        </span>
        <span className="hidden flex-col items-start leading-none sm:flex">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">Cart</span>
          <span className="mt-0.5 text-[13px] font-bold text-ink group-hover:text-brand-600">
            {count > 0 ? `${count} selected` : 'Add tests'}
          </span>
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={count ? `Cart, ${count} tests selected` : 'Cart, empty'}
      onClick={openDrawer}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-sm transition hover:border-brand-200 hover:text-brand-600 sm:h-10 sm:w-10"
    >
      <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[11px] font-bold text-white ring-2 ring-white">
          {count > 9 ? '9+' : count}
        </span>
      ) : null}
    </button>
  )
}

export function CartToast() {
  const cart = useBookingCart()
  if (!cart.toast) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-lg">
      <span className="text-[14px] font-semibold text-ink">{cart.toast}</span>
      {cart.toast === 'Added to cart' ? (
        <button type="button" onClick={cart.clearToast} className="text-[13px] font-bold text-brand-600">
          Dismiss
        </button>
      ) : (
        <>
          {cart.undoAvailable ? (
            <button
              type="button"
              onClick={() => {
                cart.undoRemove()
                cart.clearToast()
              }}
              className="text-[13px] font-bold text-brand-600"
            >
              Undo
            </button>
          ) : null}
          <button type="button" onClick={cart.clearToast} className="text-[13px] font-bold text-ink-muted">
            OK
          </button>
        </>
      )}
    </div>
  )
}
