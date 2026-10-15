export type BookingCartItem = {
  id: string
  name: string
  memberPrice: number
  mrp: number
  testCount: number
  prep?: string
  /** Cart-only thumbnail; set when adding from catalogue */
  imageUrl?: string
}

export type BookingRouteKind = 'member' | 'guest'

export type PublicBookingDraft = {
  route: BookingRouteKind | null
  cart: BookingCartItem[]
  memberVerified: boolean
  guestOtpVerified: boolean
  mobile: string
  cardId: string
  patientName: string
  patientAge: string
  bookerIsPatient: boolean
  bookerName: string
  bookerMobile: string
  memberId: string | null
  memberDiscountEligible: boolean
  ineligibilityReason: string
  collection: 'home' | 'lab'
  addressId: string
  /** When addressId is `custom`, label + full line for home collection */
  customAddressLabel: string
  customAddressLine: string
  labId: string
  date: string
  slot: string
  paymentMethod: 'cash' | 'online'
  confirmedBookingId: string | null
}

const STORAGE_KEY = 'hid_public_booking_v1'
const GUEST_BOOKINGS_KEY = 'hid_guest_bookings_v1'

export type GuestBookingRecord = {
  id: string
  patientName: string
  bookerMobile: string
  packageName: string
  amount: number
  date: string
  slot: string
  collection: 'home' | 'lab'
  locationLabel: string
  status: 'Upcoming' | 'Completed' | 'Cancelled'
  reportStatus: 'processing' | 'ready' | 'restricted'
}

function defaultDraft(): PublicBookingDraft {
  return {
    route: null,
    cart: [],
    memberVerified: false,
    guestOtpVerified: false,
    mobile: '',
    cardId: '',
    patientName: '',
    patientAge: '',
    bookerIsPatient: true,
    bookerName: '',
    bookerMobile: '',
    memberId: null,
    memberDiscountEligible: true,
    ineligibilityReason: '',
    collection: 'home',
    addressId: 'home',
    customAddressLabel: '',
    customAddressLine: '',
    labId: 'lab-nashik-1',
    date: '',
    slot: '',
    paymentMethod: 'cash',
    confirmedBookingId: null,
  }
}

export function loadBookingDraft(): PublicBookingDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultDraft()
    return { ...defaultDraft(), ...JSON.parse(raw) }
  } catch {
    return defaultDraft()
  }
}

function notifyCartUpdated() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('hid-cart-updated'))
}

export function saveBookingDraft(draft: PublicBookingDraft) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
}

export function patchBookingDraft(patch: Partial<PublicBookingDraft>) {
  const prev = loadBookingDraft()
  const next = { ...prev, ...patch }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  if (patch.cart !== undefined && JSON.stringify(patch.cart) !== JSON.stringify(prev.cart)) {
    notifyCartUpdated()
  }
  return next
}

export function setBookingCart(items: BookingCartItem[]) {
  return patchBookingDraft({ cart: items })
}

export function clearBookingFlow() {
  sessionStorage.removeItem(STORAGE_KEY)
}

function linePrice(item: BookingCartItem, memberRoute: boolean, memberDiscountEligible: boolean) {
  return memberRoute && memberDiscountEligible ? item.memberPrice : Math.round(item.mrp * 0.72)
}

export function cartSubtotal(draft: PublicBookingDraft, memberRoute: boolean) {
  if (!draft.cart.length) return { subtotal: 0, mrp: 0, discount: 0, total: 0, collectionFee: 0, lines: [] as { item: BookingCartItem; lineTotal: number }[] }
  const collectionFee = 0
  let mrp = 0
  let subtotal = 0
  const lines = draft.cart.map((item) => {
    const list = linePrice(item, memberRoute, draft.memberDiscountEligible)
    mrp += item.mrp
    subtotal += list
    return { item, lineTotal: list }
  })
  const discount = Math.max(0, mrp - subtotal)
  return { subtotal, mrp, discount, total: subtotal + collectionFee, collectionFee, lines }
}

export function loadGuestBookings(): GuestBookingRecord[] {
  try {
    const raw = sessionStorage.getItem(GUEST_BOOKINGS_KEY)
    return raw ? (JSON.parse(raw) as GuestBookingRecord[]) : []
  } catch {
    return []
  }
}

export function saveGuestBooking(record: GuestBookingRecord) {
  const list = loadGuestBookings()
  sessionStorage.setItem(GUEST_BOOKINGS_KEY, JSON.stringify([record, ...list]))
}
