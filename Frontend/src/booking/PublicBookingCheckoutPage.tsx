import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useBookingCart } from '@/cart/BookingCartContext'
import {
  Calendar,
  ClipboardCheck,
  CreditCard,
  FlaskConical,
  Home,
  MapPin,
  Trash2,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Address } from '@/account/account-data'
import { isCollectionStepComplete, resolveHomeAddress } from '@/booking/booking-address'
import { resolveCartPackageImage } from '@/lib/cart-package-image'
import { BOOKING_DATES } from '@/account/account-data'
import { useAccount, validMobile } from '@/account/AccountContext'
import { BookingAccordionSection, type AccordionSectionState } from '@/booking/BookingAccordionSection'
import {
  cartSubtotal,
  loadBookingDraft,
  patchBookingDraft,
  saveGuestBooking,
  type PublicBookingDraft,
} from '@/booking/booking-session'
import { BookingSuccessModal } from '@/booking/BookingSuccessModal'
import { BookingPrimaryButton, OrderSummaryPanel, PublicBookingShell } from '@/booking/PublicBookingShell'
import { navigateToPopularPlans, POPULAR_PLANS_SECTION_ID } from '@/lib/landing-nav-scroll'

const LABS = [{ id: 'lab-nashik-1', name: 'HealthID Partner Lab — Nashik Road', line: 'Near CBS, Nashik 422001' }]

type SectionId = 'test' | 'route' | 'identity' | 'collection' | 'schedule' | 'review'

const SECTION_ORDER: SectionId[] = ['test', 'route', 'identity', 'collection', 'schedule', 'review']

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  test: FlaskConical,
  route: CreditCard,
  identity: UserRound,
  collection: MapPin,
  schedule: Calendar,
  review: ClipboardCheck,
}

function mapPackageId(cartId?: string) {
  if (!cartId) return 'full-body'
  if (['full-body', 'heart', 'diabetes', 'women'].includes(cartId)) return cartId
  return 'full-body'
}

function sectionComplete(id: SectionId, draft: PublicBookingDraft): boolean {
  switch (id) {
    case 'test':
      return draft.cart.length > 0
    case 'route':
      return draft.route !== null
    case 'identity':
      if (draft.route === 'member') return draft.memberVerified && Boolean(draft.memberId)
      if (draft.route === 'guest') return draft.guestOtpVerified && draft.patientName.trim().length >= 2
      return false
    case 'collection':
      return isCollectionStepComplete(draft)
    case 'schedule':
      return Boolean(draft.date && draft.slot)
    case 'review':
      return false
    default:
      return false
  }
}

function sectionSummary(id: SectionId, draft: PublicBookingDraft, acc: ReturnType<typeof useAccount>): string {
  switch (id) {
    case 'test':
      return draft.cart.map((c) => c.name).join(', ')
    case 'route':
      return draft.route === 'member' ? 'HealthIDCard member' : 'Guest booking'
    case 'identity': {
      if (draft.route === 'member') return acc.member(draft.memberId || '')?.name ?? draft.patientName
      return `${draft.patientName}${draft.bookerMobile ? ` · ${draft.bookerMobile}` : ''}`
    }
    case 'collection': {
      const list = acc.authed ? acc.addresses : []
      const home = resolveHomeAddress(draft, list)
      return draft.collection === 'home' ? `Home · ${home?.label ?? ''}` : `Lab · ${LABS[0].name}`
    }
    case 'schedule': {
      const d = BOOKING_DATES.find((x) => x.id === draft.date)
      return `${d?.label ?? ''} · ${draft.slot}`
    }
    default:
      return ''
  }
}

function sectionState(id: SectionId, open: SectionId | null, draft: PublicBookingDraft): AccordionSectionState {
  if (open !== null && id === open) return 'open'
  if (sectionComplete(id, draft)) return 'done'
  const idx = SECTION_ORDER.indexOf(id)
  const firstIncomplete = SECTION_ORDER.findIndex((s) => !sectionComplete(s, draft))
  if (firstIncomplete !== -1 && idx > firstIncomplete) return 'locked'
  return 'idle'
}

export function PublicBookingCheckoutPage() {
  const navigate = useNavigate()
  const acc = useAccount()
  const bookingCart = useBookingCart()
  const [draft, setDraft] = useState(() => loadBookingDraft())
  const [open, setOpen] = useState<SectionId | null>(() => {
    const d = loadBookingDraft()
    return SECTION_ORDER.find((s) => !sectionComplete(s, d)) ?? 'review'
  })
  const stepHeaderRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [guestMobile, setGuestMobile] = useState(draft.bookerMobile || '')
  const [guestOtpSent, setGuestOtpSent] = useState(false)
  const [guestOtp, setGuestOtp] = useState('')
  const [successModal, setSuccessModal] = useState<{
    bookingId: string
    total: number
    patientName: string
    scheduleLabel: string
    testCount: number
  } | null>(null)

  useEffect(() => {
    bookingCart.refreshFromStorage()
  }, [bookingCart])

  useEffect(() => {
    const ctxIds = bookingCart.cart.map((c) => c.id).join('|')
    const draftIds = draft.cart.map((c) => c.id).join('|')
    if (ctxIds !== draftIds || bookingCart.cart.length !== draft.cart.length) {
      setDraft((d) => ({ ...d, cart: bookingCart.cart }))
    }
  }, [bookingCart.cart, draft.cart])

  const update = (patch: Partial<PublicBookingDraft>) => {
    const next = patchBookingDraft(patch)
    setDraft(next)
    return next
  }

  const memberRoute = draft.route === 'member'
  const { total } = cartSubtotal(draft, memberRoute)
  const addresses = acc.authed ? acc.addresses : []
  const guestAddressMode = !acc.authed || draft.route === 'guest'
  const dates = BOOKING_DATES
  const activeDate = draft.date || dates.find((d) => d.slots.length)?.id || ''
  const slots = dates.find((d) => d.id === activeDate)?.slots ?? []
  const dateLabel = dates.find((d) => d.id === draft.date)?.label ?? ''
  const homeAddr = resolveHomeAddress(draft, addresses)
  const lab = LABS.find((l) => l.id === draft.labId)

  const completedCount = SECTION_ORDER.filter((s) => sectionComplete(s, draft)).length
  const progressPct = Math.round((completedCount / (SECTION_ORDER.length - 1)) * 100)

  function advance(from: SectionId) {
    const idx = SECTION_ORDER.indexOf(from)
    const next = SECTION_ORDER[idx + 1]
    if (next) setOpen(next)
  }

  function confirmBooking(e: FormEvent) {
    e.preventDefault()
    const bookingId = `HID-${String(Date.now()).slice(-5)}`
    const { lines } = cartSubtotal(draft, memberRoute)
    if (memberRoute && acc.authed) {
      acc.setDraftPartial({
        memberId: draft.memberId || acc.family[0]?.id,
        addressId: draft.addressId,
        date: draft.date,
        slot: draft.slot,
      })
      acc.confirmCartBookings(
        draft.cart.map((c) => ({ id: mapPackageId(c.id), name: c.name, memberPrice: c.memberPrice })),
        {
          memberId: draft.memberId || acc.family[0]?.id || '',
          addressId: draft.addressId,
          addressLine: draft.collection === 'home' ? homeAddr?.line : undefined,
          dateLabel,
          slot: draft.slot,
        },
      )
    } else {
      lines.forEach((line, i) => {
        saveGuestBooking({
          id: i === 0 ? bookingId : `${bookingId}-${i + 1}`,
          patientName: draft.patientName,
          bookerMobile: draft.bookerMobile || draft.mobile,
          packageName: line.item.name,
          amount: line.lineTotal,
          date: dateLabel,
          slot: draft.slot,
          collection: draft.collection,
          locationLabel: draft.collection === 'home' ? homeAddr?.line || '' : lab?.name || '',
          status: 'Upcoming',
          reportStatus: 'processing',
        })
      })
    }
    update({ confirmedBookingId: bookingId })
    setSuccessModal({
      bookingId,
      total,
      patientName: draft.patientName || acc.member(draft.memberId || '')?.name || 'Guest',
      scheduleLabel: `${dateLabel} · ${draft.slot}`,
      testCount: draft.cart.length,
    })
  }

  function finishAfterSuccess(toDashboard: boolean) {
    setSuccessModal(null)
    bookingCart.clearCart()

    if (toDashboard) {
      window.location.assign('/account/dashboard')
      return
    }
    window.location.assign(`/#${POPULAR_PLANS_SECTION_ID}`)
  }

  function focusStepHeader(index: number) {
    const el = stepHeaderRefs.current[index]
    if (el && !el.disabled) el.focus()
  }

  function toggleSection(id: SectionId) {
    if (sectionState(id, open, draft) === 'locked') return
    setOpen((prev) => (prev === id ? null : id))
  }

  function handleStepHeaderKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number, id: SectionId) {
    if (sectionState(id, open, draft) === 'locked') return

    const last = SECTION_ORDER.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (open === id) setOpen(null)
        focusStepHeader(Math.min(index + 1, last))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (open === id) setOpen(null)
        focusStepHeader(Math.max(index - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        if (open === id) setOpen(null)
        focusStepHeader(0)
        break
      case 'End':
        e.preventDefault()
        if (open === id) setOpen(null)
        focusStepHeader(last)
        break
      case 'Escape':
        if (open === id) {
          e.preventDefault()
          setOpen(null)
        }
        break
      default:
        break
    }
  }

  const sectionProps = (id: SectionId, index: number, _step: number, category: string, title: string) => ({
    icon: SECTION_ICONS[id],
    category,
    title,
    panelId: `booking-step-${id}`,
    state: sectionState(id, open, draft),
    summary: sectionComplete(id, draft) ? sectionSummary(id, draft, acc) : undefined,
    headerRef: (el: HTMLButtonElement | null) => {
      stepHeaderRefs.current[index] = el
    },
    onToggle: () => toggleSection(id),
    onHeaderKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => handleStepHeaderKeyDown(e, index, id),
  })

  const mobileBar = (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(26,54,93,0.12)] lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-muted">Due at visit</p>
          <p className="text-xl font-bold text-navy">₹{total.toLocaleString('en-IN')}</p>
        </div>
        <p className="max-w-[150px] text-right text-[11px] leading-snug text-muted">Cash or UPI at sample collection</p>
      </div>
    </div>
  )

  return (
    <PublicBookingShell
      progressPct={progressPct}
      completedSteps={completedCount}
      totalSteps={SECTION_ORDER.length - 1}
      summary={<OrderSummaryPanel draft={draft} memberRoute={memberRoute} />}
    >
      <div className="space-y-6 pb-28 lg:space-y-8 lg:pb-4">
        <h1 className="text-xl font-bold tracking-tight text-brick sm:text-2xl">Complete your booking</h1>

        <div className="flex flex-col gap-5 sm:gap-6" role="presentation">
        <BookingAccordionSection {...sectionProps('test', 0, 1, 'Tests', 'Selected tests')}>
          <ul className="space-y-3">
            {draft.cart.map((item) => {
              const img = resolveCartPackageImage(item.id, item.imageUrl)
              return (
                <li key={item.id} className="flex gap-3 rounded-xl border border-line p-3 sm:p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mp-teal-50 ring-1 ring-line/60">
                    <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-base font-semibold leading-snug text-navy">{item.name}</p>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => bookingCart.removeItem(item.id)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-mp-coral-50 hover:text-mp-coral"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <p className="mt-1 text-[15px] text-muted">
                      {item.testCount} {item.testCount === 1 ? 'test' : 'tests'} · ₹
                      {item.memberPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigateToPopularPlans(navigate)}
              className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-[15px] font-semibold text-navy hover:bg-canvas"
            >
              Add or change tests
            </button>
            <BookingPrimaryButton onClick={() => advance('test')}>Continue</BookingPrimaryButton>
          </div>
        </BookingAccordionSection>

        <BookingAccordionSection {...sectionProps('route', 1, 2, 'Account', 'How would you like to continue?')}>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                update({
                  route: 'member',
                  memberVerified: acc.authed,
                  guestOtpVerified: false,
                })
                advance('route')
              }}
              className={`flex flex-col rounded-xl border p-5 text-left transition ${
                draft.route === 'member' ? 'border-mp-teal bg-mp-teal-50' : 'border-line hover:border-mp-teal/40'
              }`}
            >
              <CreditCard className="h-6 w-6 text-mp-teal-700" aria-hidden />
              <span className="mt-3 text-base font-semibold text-navy">I have a HealthIDCard</span>
              <span className="mt-1.5 text-[15px] text-muted">Member pricing for eligible tests</span>
            </button>
            <button
              type="button"
              onClick={() => {
                update({ route: 'guest', memberVerified: false, guestOtpVerified: false })
                advance('route')
              }}
              className={`flex flex-col rounded-xl border p-5 text-left transition ${
                draft.route === 'guest' ? 'border-mp-teal bg-mp-teal-50' : 'border-line hover:border-mp-teal/40'
              }`}
            >
              <UserRound className="h-6 w-6 text-navy" aria-hidden />
              <span className="mt-3 text-base font-semibold text-navy">Continue without membership</span>
              <span className="mt-1.5 text-[15px] text-muted">No card or password required</span>
            </button>
          </div>
        </BookingAccordionSection>

        <BookingAccordionSection
          {...sectionProps(
            'identity',
            2,
            3,
            'Patient',
            draft.route === 'member' ? 'Membership & patient' : 'Patient & mobile verification',
          )}
        >
          {draft.route === 'member' ? (
            <MemberIdentityBlock acc={acc} draft={draft} update={update} onDone={() => advance('identity')} />
          ) : draft.route === 'guest' ? (
            <GuestIdentityBlock
              draft={draft}
              update={update}
              guestMobile={guestMobile}
              setGuestMobile={setGuestMobile}
              guestOtp={guestOtp}
              setGuestOtp={setGuestOtp}
              guestOtpSent={guestOtpSent}
              setGuestOtpSent={setGuestOtpSent}
              onDone={() => advance('identity')}
            />
          ) : (
            <p className="text-[15px] text-muted">Choose member or guest in step 2 first.</p>
          )}
        </BookingAccordionSection>

        <BookingAccordionSection {...sectionProps('collection', 3, 4, 'Location', 'Collection method')}>
          <CollectionLocationStep
            draft={draft}
            addresses={addresses}
            guestMode={guestAddressMode}
            update={update}
            onDone={() => advance('collection')}
          />
        </BookingAccordionSection>

        <BookingAccordionSection {...sectionProps('schedule', 4, 5, 'Schedule', 'Date & time')}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (draft.date && draft.slot) advance('schedule')
            }}
          >
            <p className="mb-4 flex items-center gap-2 text-[15px] font-medium text-navy">
              <Calendar className="h-5 w-5" aria-hidden /> Available slots in Nashik
            </p>
            <div className="flex flex-wrap gap-2.5">
              {dates.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  disabled={!d.slots.length}
                  onClick={() => update({ date: d.id, slot: '' })}
                  className={`rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                    activeDate === d.id ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ slot: s })}
                  className={`rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                    draft.slot === s ? 'bg-mp-teal text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <BookingPrimaryButton type="submit" disabled={!draft.date || !draft.slot}>
                Save & continue
              </BookingPrimaryButton>
            </div>
          </form>
        </BookingAccordionSection>

        <BookingAccordionSection {...sectionProps('review', 5, 6, 'Confirm', 'Review & confirm')}>
          <form onSubmit={confirmBooking} className="space-y-4">
            <dl className="divide-y divide-line rounded-xl border border-line text-[15px]">
              {[
                ['Patient', draft.patientName || acc.member(draft.memberId || '')?.name],
                ['Tests', draft.cart.map((c) => c.name).join(', ')],
                [
                  'Collection',
                  draft.collection === 'home'
                    ? `Home · ${homeAddr?.line ?? '—'}`
                    : lab?.name,
                ],
                ['Schedule', `${dateLabel} · ${draft.slot}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="max-w-[58%] text-right font-semibold text-navy">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex gap-3 rounded-xl bg-mp-teal-50 p-4">
              <Wallet className="h-6 w-6 shrink-0 text-mp-teal-700" aria-hidden />
              <div>
                <p className="text-base font-semibold text-navy">Pay at sample collection</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                  No online payment now. Pay <strong className="text-navy">₹{total.toLocaleString('en-IN')}</strong> in{' '}
                  <strong className="text-navy">cash or UPI</strong> when the phlebotomist arrives — totals are in your
                  summary.
                </p>
              </div>
            </div>

            {draft.cart.some((c) => c.prep) ? (
              <div className="space-y-2">
                {draft.cart
                  .filter((c) => c.prep)
                  .map((c) => (
                    <p key={c.id} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-[15px] text-amber-950">
                      <strong>{c.name}:</strong> {c.prep}
                    </p>
                  ))}
              </div>
            ) : null}

            <BookingPrimaryButton type="submit" accent="coral">
              Confirm booking
            </BookingPrimaryButton>
          </form>
        </BookingAccordionSection>
        </div>
      </div>
      {mobileBar}
      <BookingSuccessModal
        open={Boolean(successModal)}
        bookingId={successModal?.bookingId ?? ''}
        patientName={successModal?.patientName ?? ''}
        scheduleLabel={successModal?.scheduleLabel ?? ''}
        total={successModal?.total ?? 0}
        testCount={successModal?.testCount ?? 0}
        onDashboard={() => finishAfterSuccess(true)}
        onExplore={() => finishAfterSuccess(false)}
      />
    </PublicBookingShell>
  )
}

function CollectionLocationStep({
  draft,
  addresses,
  guestMode,
  update,
  onDone,
}: {
  draft: PublicBookingDraft
  addresses: Address[]
  guestMode?: boolean
  update: (p: Partial<PublicBookingDraft>) => PublicBookingDraft
  onDone: () => void
}) {
  const [collection, setCollection] = useState<'home' | 'lab'>(draft.collection || 'home')
  const defaultAddressMode =
    draft.addressId === 'custom' || guestMode || addresses.length === 0 ? 'custom' : 'saved'
  const [addressMode, setAddressMode] = useState<'saved' | 'custom'>(defaultAddressMode)
  const [customLabel, setCustomLabel] = useState(draft.customAddressLabel)
  const [customLine, setCustomLine] = useState(draft.customAddressLine)
  const [savedId, setSavedId] = useState(
    draft.addressId === 'custom' ? addresses[0]?.id ?? 'home' : draft.addressId || addresses[0]?.id || 'home',
  )

  function submit(e: FormEvent) {
    e.preventDefault()
    if (collection === 'lab') {
      update({
        collection: 'lab',
        labId: LABS[0].id,
        addressId: savedId,
        customAddressLabel: '',
        customAddressLine: '',
      })
      onDone()
      return
    }
    if (addressMode === 'custom' || addresses.length === 0) {
      update({
        collection: 'home',
        addressId: 'custom',
        customAddressLabel: customLabel.trim(),
        customAddressLine: customLine.trim(),
        labId: LABS[0].id,
      })
    } else {
      update({
        collection: 'home',
        addressId: savedId,
        customAddressLabel: '',
        customAddressLine: '',
        labId: LABS[0].id,
      })
    }
    onDone()
  }

  const customValid = customLine.trim().length >= 8

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer gap-4 rounded-xl border border-line p-5 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50">
          <input
            type="radio"
            name="collection"
            value="home"
            checked={collection === 'home'}
            onChange={() => setCollection('home')}
            className="mt-1 scale-125"
          />
          <span>
            <span className="flex items-center gap-2 text-base font-semibold text-navy">
              <Home className="h-5 w-5" /> Home collection
            </span>
            <span className="mt-1.5 block text-[15px] text-muted">Free in Nashik · phlebotomist at your door</span>
          </span>
        </label>
        <label className="flex cursor-pointer gap-4 rounded-xl border border-line p-5 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50">
          <input
            type="radio"
            name="collection"
            value="lab"
            checked={collection === 'lab'}
            onChange={() => setCollection('lab')}
            className="mt-1 scale-125"
          />
          <span>
            <span className="flex items-center gap-2 text-base font-semibold text-navy">
              <MapPin className="h-5 w-5" /> Visit lab
            </span>
            <span className="mt-1.5 block text-[15px] text-muted">Partner centre in Nashik</span>
          </span>
        </label>
      </div>

      {collection === 'home' ? (
        <div className="space-y-4">
          <p className="text-[15px] font-semibold text-navy">Where should we collect the sample?</p>
          {guestMode ? (
            <p className="text-[14px] text-muted">Add your Nashik address for home collection — you can save addresses later with a HealthID Card.</p>
          ) : null}
          {addresses.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAddressMode('saved')}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                  addressMode === 'saved' ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
                }`}
              >
                Saved addresses
              </button>
              <button
                type="button"
                onClick={() => setAddressMode('custom')}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                  addressMode === 'custom' ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'
                }`}
              >
                Enter another address
              </button>
            </div>
          ) : null}

          {addressMode === 'saved' && addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className="flex gap-4 rounded-xl border border-line p-4 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50/60"
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    value={a.id}
                    checked={savedId === a.id}
                    onChange={() => setSavedId(a.id)}
                    className="mt-1 scale-125"
                  />
                  <span className="text-[15px]">
                    <strong className="text-base text-navy">{a.label}</strong>
                    <br />
                    <span className="text-muted">{a.line}</span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-dashed border-mp-teal/40 bg-mp-teal-50/30 p-4">
              <label className="block text-[14px] font-semibold text-navy">
                Address label <span className="font-normal text-muted">(optional)</span>
                <input
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g. Parents' home, Office"
                  className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-4 text-[15px]"
                />
              </label>
              <label className="block text-[14px] font-semibold text-navy">
                Full address
                <textarea
                  value={customLine}
                  onChange={(e) => setCustomLine(e.target.value)}
                  required
                  rows={3}
                  placeholder="Flat, building, street, landmark, Nashik PIN"
                  className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] leading-snug"
                />
              </label>
              {!customValid && customLine.length > 0 ? (
                <p className="text-[13px] text-brick">Please enter at least 8 characters for the full address.</p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-canvas px-4 py-3 text-[15px] text-muted">
          <strong className="text-navy">{LABS[0].name}</strong>
          <br />
          {LABS[0].line}
        </div>
      )}

      <BookingPrimaryButton
        type="submit"
        disabled={collection === 'home' && addressMode === 'custom' && !customValid}
      >
        Save & continue
      </BookingPrimaryButton>
    </form>
  )
}

function MemberIdentityBlock({
  acc,
  draft,
  update,
  onDone,
}: {
  acc: ReturnType<typeof useAccount>
  draft: PublicBookingDraft
  update: (p: Partial<PublicBookingDraft>) => PublicBookingDraft
  onDone: () => void
}) {
  if (!draft.memberVerified) {
    return (
      <form
        className="max-w-md space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const mobile = String(fd.get('mobile') || '').trim()
          const otp = String(fd.get('otp') || '').trim()
          if (acc.submitLogin({ mobile, otp: otp || undefined })) {
            update({ memberVerified: true, mobile })
          }
        }}
      >
        <label className="block text-[15px] font-semibold text-navy">
          Registered mobile
          <input name="mobile" defaultValue={acc.mobile} maxLength={10} className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-base" />
        </label>
        {acc.otpSent ? (
          <label className="block text-[15px] font-semibold text-navy">
            OTP
            <input name="otp" maxLength={6} className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-base" />
          </label>
        ) : null}
        {acc.error ? <p className="text-[15px] font-semibold text-coral">{acc.error}</p> : null}
        <BookingPrimaryButton type="submit">{acc.otpSent ? 'Verify membership' : 'Send OTP'}</BookingPrimaryButton>
      </form>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        const memberId = String(new FormData(e.currentTarget).get('member') || '')
        const member = acc.member(memberId)
        if (!member) return
        update({
          memberId,
          patientName: member.name,
          memberDiscountEligible: member.status === 'Active',
        })
        onDone()
      }}
    >
      <p className="text-[15px] font-medium text-muted">Who is this test for?</p>
      {acc.family.map((m, i) => (
        <label key={m.id} className="flex gap-4 rounded-xl border border-line p-4 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50">
          <input type="radio" name="member" value={m.id} defaultChecked={i === 0} className="mt-1 scale-125" />
          <span className="text-[15px]">
            <strong className="text-base text-navy">{m.name}</strong>
            <br />
            <span className="text-muted">{m.relation}</span>
          </span>
        </label>
      ))}
      <BookingPrimaryButton type="submit">Select member</BookingPrimaryButton>
    </form>
  )
}

function GuestIdentityBlock({
  draft,
  update,
  guestMobile,
  setGuestMobile,
  guestOtp,
  setGuestOtp,
  guestOtpSent,
  setGuestOtpSent,
  onDone,
}: {
  draft: PublicBookingDraft
  update: (p: Partial<PublicBookingDraft>) => PublicBookingDraft
  guestMobile: string
  setGuestMobile: (v: string) => void
  guestOtp: string
  setGuestOtp: (v: string) => void
  guestOtpSent: boolean
  setGuestOtpSent: (v: boolean) => void
  onDone: () => void
}) {
  const [err, setErr] = useState('')

  if (!draft.guestOtpVerified) {
    return (
      <form
        className="max-w-md space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const patientName = String(fd.get('patientName') || '').trim()
          const patientAge = String(fd.get('patientAge') || '')
          const bookerIsPatient = fd.get('bookerIsPatient') === 'on'

          if (patientName.length < 2) {
            setErr('Enter the patient full name.')
            return
          }

          update({ patientName, patientAge, bookerIsPatient })

          if (!guestOtpSent) {
            if (!validMobile(guestMobile)) {
              setErr('Enter a valid 10-digit mobile number.')
              return
            }
            setErr('')
            setGuestOtpSent(true)
            return
          }

          if (!/^\d{6}$/.test(guestOtp)) {
            setErr('Enter the 6-digit OTP.')
            return
          }

          update({ guestOtpVerified: true, bookerMobile: guestMobile, mobile: guestMobile })
          setErr('')
          onDone()
        }}
      >
        <p className="text-[14px] text-muted">Patient details and mobile verification in one step.</p>
        <label className="block text-[15px] font-semibold text-navy">
          Patient full name
          <input name="patientName" required defaultValue={draft.patientName} className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-base" />
        </label>
        <label className="block text-[15px] font-semibold text-navy">
          Age (optional)
          <input name="patientAge" defaultValue={draft.patientAge} className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-base" />
        </label>
        <label className="flex items-center gap-2 text-[15px] font-semibold text-navy">
          <input type="checkbox" name="bookerIsPatient" defaultChecked={draft.bookerIsPatient} />
          I am the patient
        </label>
        <label className="block text-[15px] font-semibold text-navy">
          Mobile for booking updates
          <input
            value={guestMobile}
            onChange={(e) => setGuestMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            required
            className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-base"
          />
        </label>
        {guestOtpSent ? (
          <label className="block text-[15px] font-semibold text-navy">
            OTP
            <input
              value={guestOtp}
              onChange={(e) => setGuestOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              className="mt-2 h-12 w-full rounded-xl border border-line px-4 text-base"
            />
          </label>
        ) : null}
        {err ? <p className="text-[15px] text-coral">{err}</p> : null}
        <BookingPrimaryButton type="submit">{guestOtpSent ? 'Verify & continue' : 'Send OTP & continue'}</BookingPrimaryButton>
      </form>
    )
  }

  return <p className="text-[15px] font-semibold text-mp-teal-700">Verified · {draft.patientName} · {draft.bookerMobile}</p>
}

export function PublicBookingConfirmedPage() {
  const draft = loadBookingDraft()
  const acc = useAccount()
  const id = draft.confirmedBookingId
  const dateLabel = BOOKING_DATES.find((d) => d.id === draft.date)?.label ?? ''
  const memberRoute = draft.route === 'member'
  const total = draft.cart.length ? cartSubtotal(draft, memberRoute).total : 0

  if (!id) return <Navigate to="/book" replace />

  return (
    <PublicBookingShell progressPct={100} completedSteps={6} totalSteps={6}>
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
        <span className="inline-flex rounded-full bg-success/15 px-3 py-1 text-[12px] font-bold uppercase text-success">Confirmed</span>
        <h1 className="mt-4 font-display text-[28px] font-extrabold text-ink">{id}</h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          {draft.patientName} · {dateLabel} · {draft.slot}
        </p>
        {total > 0 ? (
          <p className="mt-4 text-[14px] text-ink-soft">
            Pay in cash or UPI when we collect the sample. Amount due: ₹{total.toLocaleString('en-IN')}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {draft.route === 'member' && acc.authed ? (
            <Link to="/account/bookings" className="inline-flex h-12 items-center justify-center rounded-xl bg-teal px-6 font-bold text-white">
              View booking
            </Link>
          ) : (
            <Link to="/book/lookup" className="inline-flex h-12 items-center justify-center rounded-xl bg-teal px-6 font-bold text-white">
              Find my booking
            </Link>
          )}
          <Link to="/" className="inline-flex h-12 items-center justify-center rounded-xl border border-line px-6 font-bold text-ink-soft">
            Book another
          </Link>
        </div>
      </div>
    </PublicBookingShell>
  )
}
