import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import { loadBookingDraft, loadGuestBookings, patchBookingDraft, type BookingCartItem } from '@/booking/booking-session'
import { resolveCartPackageImage } from '@/lib/cart-package-image'
import { PublicBookingConfirmedPage, PublicBookingCheckoutPage } from '@/booking/PublicBookingCheckoutPage'
import { BookingCard, BookingPrimaryButton, PublicBookingShell } from '@/booking/PublicBookingShell'

function RequireCart({ children }: { children: React.ReactNode }) {
  const draft = loadBookingDraft()
  if (!draft.cart.length && !draft.confirmedBookingId) return <Navigate to="/" replace />
  return <>{children}</>
}

export function PublicBookingStartPage() {
  const [params] = useSearchParams()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = params.get('id')
    const name = params.get('name')
    const price = Number(params.get('price'))
    const mrp = Number(params.get('mrp'))
    const tests = Number(params.get('tests') || '1')
    const prep = params.get('prep') || undefined
    if (!id || !name || !price) {
      setReady(true)
      return
    }
    const item: BookingCartItem = {
      id,
      name,
      memberPrice: price,
      mrp: mrp || Math.round(price * 2.2),
      testCount: tests,
      prep,
      imageUrl: resolveCartPackageImage(id),
    }
    const current = loadBookingDraft().cart
    if (!current.some((c) => c.id === id)) {
      patchBookingDraft({ cart: [...current, item] })
    }
    setReady(true)
  }, [params])

  if (!ready) return null
  const id = params.get('id')
  if (!id) return <Navigate to="/" replace />
  return <Navigate to="/book" replace />
}

function LookupPage() {
  const [mobile, setMobile] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [verified, setVerified] = useState(false)
  const [otp, setOtp] = useState('')

  const rows = loadGuestBookings().filter(
    (b) => (!bookingId || b.id === bookingId) && (!mobile || b.bookerMobile === mobile),
  )

  return (
    <PublicBookingShell>
      <BookingCard>
        <h1 className="font-display text-[26px] font-extrabold text-ink">Find my booking</h1>
        <p className="mt-2 text-[15px] text-ink-soft">Booking ID and verified mobile must both match.</p>
        <div className="mt-6 max-w-md space-y-3">
          <input
            placeholder="Booking ID e.g. HID-12345"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value.toUpperCase())}
            className="h-12 w-full rounded-xl border border-line px-4"
          />
          <input
            placeholder="Mobile used when booking"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="h-12 w-full rounded-xl border border-line px-4"
          />
          {!verified ? (
            <input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-12 w-full rounded-xl border border-line px-4"
            />
          ) : null}
          <BookingPrimaryButton
            onClick={() => {
              if (!verified && /^\d{6}$/.test(otp)) setVerified(true)
            }}
          >
            {verified ? 'Verified' : 'Verify & lookup'}
          </BookingPrimaryButton>
        </div>
        {verified ? (
          <ul className="mt-8 space-y-3">
            {rows.length ? (
              rows.map((b) => (
                <li key={b.id} className="rounded-xl border border-line p-4">
                  <p className="font-bold text-ink">{b.id}</p>
                  <p className="text-[14px] text-ink-soft">
                    {b.packageName} · {b.date} · {b.status}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-[14px] text-ink-soft">No booking found.</p>
            )}
          </ul>
        ) : null}
      </BookingCard>
    </PublicBookingShell>
  )
}

export function PublicBookingRoutes() {
  return (
    <Routes>
      <Route path="start" element={<PublicBookingStartPage />} />
      <Route path="lookup" element={<LookupPage />} />
      <Route path="confirmed" element={<PublicBookingConfirmedPage />} />
      <Route
        path=""
        element={
          <RequireCart>
            <PublicBookingCheckoutPage />
          </RequireCart>
        }
      />
      <Route path="*" element={<Navigate to="/book" replace />} />
    </Routes>
  )
}
