const STORAGE_KEY = 'hid_public_booking_v1';
const GUEST_BOOKINGS_KEY = 'hid_guest_bookings_v1';
function defaultDraft() {
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
    };
}
export function loadBookingDraft() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw)
            return defaultDraft();
        return { ...defaultDraft(), ...JSON.parse(raw) };
    }
    catch {
        return defaultDraft();
    }
}
function notifyCartUpdated() {
    if (typeof window !== 'undefined')
        window.dispatchEvent(new Event('hid-cart-updated'));
}
export function saveBookingDraft(draft) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}
export function patchBookingDraft(patch) {
    const prev = loadBookingDraft();
    const next = { ...prev, ...patch };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (patch.cart !== undefined && JSON.stringify(patch.cart) !== JSON.stringify(prev.cart)) {
        notifyCartUpdated();
    }
    return next;
}
export function setBookingCart(items) {
    return patchBookingDraft({ cart: items });
}
export function clearBookingFlow() {
    sessionStorage.removeItem(STORAGE_KEY);
}
function linePrice(item, memberRoute, memberDiscountEligible) {
    return memberRoute && memberDiscountEligible ? item.memberPrice : Math.round(item.mrp * 0.72);
}
export function cartSubtotal(draft, memberRoute) {
    if (!draft.cart.length)
        return { subtotal: 0, mrp: 0, discount: 0, total: 0, collectionFee: 0, lines: [] };
    const collectionFee = 0;
    let mrp = 0;
    let subtotal = 0;
    const lines = draft.cart.map((item) => {
        const list = linePrice(item, memberRoute, draft.memberDiscountEligible);
        mrp += item.mrp;
        subtotal += list;
        return { item, lineTotal: list };
    });
    const discount = Math.max(0, mrp - subtotal);
    return { subtotal, mrp, discount, total: subtotal + collectionFee, collectionFee, lines };
}
export function loadGuestBookings() {
    try {
        const raw = sessionStorage.getItem(GUEST_BOOKINGS_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
export function saveGuestBooking(record) {
    const list = loadGuestBookings();
    sessionStorage.setItem(GUEST_BOOKINGS_KEY, JSON.stringify([record, ...list]));
}
