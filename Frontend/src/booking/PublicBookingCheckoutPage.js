import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useBookingCart } from '@/cart/BookingCartContext';
import { Calendar, ClipboardCheck, CreditCard, FlaskConical, Home, MapPin, Trash2, UserRound, Banknote, } from 'lucide-react';
import { isCollectionStepComplete, resolveHomeAddress } from '@/booking/booking-address';
import { resolveCartPackageImage } from '@/lib/cart-package-image';
import { AccountLoginPage } from '@/account/AccountLoginPage';
import { useAccount } from '@/account/AccountContext';
import { BOOKING_RETURN_PATH, rememberLoginReturn } from '@/lib/auth-return';
import { isBookingDateIso, upcomingCollectionDates } from '@/lib/booking-dates';
import { useQuery } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { authErrorMessage, channelNotice } from '@/services/otp';
import { BookingAccordionSection } from '@/booking/BookingAccordionSection';
import { cartSubtotal, loadBookingDraft, patchBookingDraft, } from '@/booking/booking-session';
import { BookingSuccessModal } from '@/booking/BookingSuccessModal';
import { BookingPrimaryButton, OrderSummaryPanel, PublicBookingShell } from '@/booking/PublicBookingShell';
import { navigateToPopularPlans, POPULAR_PLANS_SECTION_ID } from '@/lib/landing-nav-scroll';
const LABS = [{ id: 'lab-nashik-1', name: 'HealthID Partner Lab — Nashik Road', line: 'Near CBS, Nashik 422001' }];
const SECTION_ORDER = ['test', 'route', 'identity', 'collection', 'schedule', 'review'];
const SECTION_ICONS = {
    test: FlaskConical,
    route: CreditCard,
    identity: UserRound,
    collection: MapPin,
    schedule: Calendar,
    review: ClipboardCheck,
};
function sectionComplete(id, draft, acc) {
    switch (id) {
        case 'test':
            return draft.cart.length > 0;
        case 'route':
            return draft.route !== null;
        case 'identity':
            if (draft.route === 'member')
                return Boolean(draft.memberId);
            if (draft.route === 'guest')
                return draft.patientName.trim().length >= 2;
            return false;
        case 'collection':
            return isCollectionStepComplete(draft);
        case 'schedule':
            return isBookingDateIso(draft.date) && Boolean(draft.slot);
        case 'review':
            return false;
        default:
            return false;
    }
}
function sectionSummary(id, draft, acc) {
    switch (id) {
        case 'test':
            return draft.cart.map((c) => c.name).join(', ');
        case 'route':
            return draft.route === 'member' ? 'HealthIDCard member' : 'Guest booking';
        case 'identity': {
            if (draft.route === 'member')
                return acc.member(draft.memberId || '')?.name ?? draft.patientName;
            return `${draft.patientName}${draft.bookerMobile ? ` · ${draft.bookerMobile}` : ''}`;
        }
        case 'collection': {
            const list = acc.authed ? acc.addresses : [];
            const home = resolveHomeAddress(draft, list);
            return draft.collection === 'home' ? `Home · ${home?.label ?? ''}` : `Lab · ${LABS[0].name}`;
        }
        case 'schedule': {
            const d = upcomingCollectionDates(7).find((x) => x.id === draft.date);
            return `${d?.label ?? draft.date} · ${draft.slot}`;
        }
        default:
            return '';
    }
}
function sectionState(id, open, draft, acc) {
    if (open !== null && id === open)
        return 'open';
    if (sectionComplete(id, draft, acc))
        return 'done';
    const idx = SECTION_ORDER.indexOf(id);
    const firstIncomplete = SECTION_ORDER.findIndex((s) => !sectionComplete(s, draft, acc));
    if (firstIncomplete !== -1 && idx > firstIncomplete)
        return 'locked';
    return 'idle';
}
export function PublicBookingCheckoutPage() {
    const navigate = useNavigate();
    const acc = useAccount();
    const bookingCart = useBookingCart();
    const [draft, setDraft] = useState(() => loadBookingDraft());
    const [open, setOpen] = useState('test');
    const stepHeaderRefs = useRef([]);
    const [guestMobile, setGuestMobile] = useState(draft.bookerMobile || '');
    const [cardVerifyOpen, setCardVerifyOpen] = useState(false);
    const [successModal, setSuccessModal] = useState(null);
    useEffect(() => {
        bookingCart.refreshFromStorage();
    }, [bookingCart]);
    useEffect(() => {
        if (draft.date && !isBookingDateIso(draft.date)) {
            update({ date: '', slot: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- migrate leftover dummy dates once
    }, []);
    useEffect(() => {
        if (!acc.authed)
            return;
        update({
            route: draft.route ?? 'member',
            memberVerified: true,
            mobile: acc.mobile,
            ...(open === 'review' ? { memberId: '' } : {}),
        });
        if (open === 'review')
            setOpen('review');
        // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once when session becomes live
    }, [acc.authed]);
    useEffect(() => {
        if (!acc.authed && open === 'review' && draft.route !== 'member')
            rememberLoginReturn(BOOKING_RETURN_PATH);
    }, [acc.authed, open, draft.route]);
    useEffect(() => {
        const ctxIds = bookingCart.cart.map((c) => c.id).join('|');
        const draftIds = draft.cart.map((c) => c.id).join('|');
        if (ctxIds !== draftIds || bookingCart.cart.length !== draft.cart.length) {
            setDraft((d) => ({ ...d, cart: bookingCart.cart }));
        }
    }, [bookingCart.cart, draft.cart]);
    const update = (patch) => {
        const next = patchBookingDraft(patch);
        setDraft(next);
        return next;
    };
    const memberRoute = draft.route === 'member';
    const { total } = cartSubtotal(draft, memberRoute);
    const addresses = acc.authed ? acc.addresses : [];
    const guestAddressMode = !acc.authed || draft.route === 'guest';
    const dates = useMemo(() => upcomingCollectionDates(7), []);
    const activeDate = draft.date || dates[0]?.id || '';
    const slotsQuery = useQuery({
        queryKey: ['slots', activeDate],
        enabled: Boolean(activeDate),
        queryFn: async () => unwrap((await api.get('/appointments/slots', { params: { date: activeDate } })).data),
    });
    const slots = slotsQuery.data?.slots ?? [];
    const dateLabel = dates.find((d) => d.id === draft.date)?.label ?? draft.date;
    const homeAddr = resolveHomeAddress(draft, addresses);
    const lab = LABS.find((l) => l.id === draft.labId);
    const completedCount = SECTION_ORDER.filter((s) => sectionComplete(s, draft, acc)).length;
    const progressPct = Math.round((completedCount / (SECTION_ORDER.length - 1)) * 100);
    function advance(from) {
        const idx = SECTION_ORDER.indexOf(from);
        const next = SECTION_ORDER[idx + 1];
        if (next)
            setOpen(next);
    }
    function confirmBooking(e) {
        e.preventDefault();
        if (!acc.authed) {
            acc.setError('Log in or create an account so this booking is saved on the server.');
            return;
        }
        if (!isBookingDateIso(draft.date) || !draft.slot) {
            acc.setError('Pick a collection date and time slot again, then confirm.');
            setOpen('schedule');
            return;
        }
        acc.setDraftPartial({
            memberId: draft.memberId || acc.family[0]?.id,
            addressId: draft.addressId,
            date: draft.date,
            slot: draft.slot,
        });
        void acc
            .confirmCartBookings(draft.cart.map((c) => ({ id: c.id, name: c.name, memberPrice: c.memberPrice })), {
            memberId: draft.memberId || acc.family[0]?.id || '',
            addressId: draft.addressId,
            addressLine: draft.collection === 'home' ? homeAddr?.line : undefined,
            collection: draft.collection,
            dateLabel,
            dateIso: draft.date,
            slot: draft.slot,
            patientName: draft.patientName,
        })
            .then((bookingId) => {
            if (!bookingId)
                return;
            update({ confirmedBookingId: bookingId });
            setSuccessModal({
                bookingId,
                total,
                patientName: draft.patientName || acc.member(draft.memberId || '')?.name || 'Guest',
                scheduleLabel: `${dateLabel} · ${draft.slot}`,
                testCount: draft.cart.length,
                whatsappMobile: draft.bookerMobile || draft.mobile || acc.mobile,
            });
        });
    }
    function finishAfterSuccess(toDashboard) {
        setSuccessModal(null);
        bookingCart.clearCart();
        if (toDashboard) {
            window.location.assign('/account/dashboard');
            return;
        }
        window.location.assign(`/#${POPULAR_PLANS_SECTION_ID}`);
    }
    function focusStepHeader(index) {
        const el = stepHeaderRefs.current[index];
        if (el && !el.disabled)
            el.focus();
    }
    function toggleSection(id) {
        if (sectionState(id, open, draft, acc) === 'locked')
            return;
        setOpen((prev) => (prev === id ? null : id));
    }
    function handleStepHeaderKeyDown(e, index, id) {
        if (sectionState(id, open, draft, acc) === 'locked')
            return;
        const last = SECTION_ORDER.length - 1;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (open === id)
                    setOpen(null);
                focusStepHeader(Math.min(index + 1, last));
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (open === id)
                    setOpen(null);
                focusStepHeader(Math.max(index - 1, 0));
                break;
            case 'Home':
                e.preventDefault();
                if (open === id)
                    setOpen(null);
                focusStepHeader(0);
                break;
            case 'End':
                e.preventDefault();
                if (open === id)
                    setOpen(null);
                focusStepHeader(last);
                break;
            case 'Escape':
                if (open === id) {
                    e.preventDefault();
                    setOpen(null);
                }
                break;
            default:
                break;
        }
    }
    const sectionProps = (id, index, _step, category, title) => ({
        icon: SECTION_ICONS[id],
        category,
        title,
        panelId: `booking-step-${id}`,
        state: sectionState(id, open, draft, acc),
        summary: sectionComplete(id, draft, acc) ? sectionSummary(id, draft, acc) : undefined,
        headerRef: (el) => {
            stepHeaderRefs.current[index] = el;
        },
        onToggle: () => toggleSection(id),
        onHeaderKeyDown: (e) => handleStepHeaderKeyDown(e, index, id),
    });
    const mobileBar = (_jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(26,54,93,0.12)] lg:hidden", children: _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-muted", children: "Due at visit" }), _jsxs("p", { className: "text-xl font-bold text-navy", children: ["\u20B9", total.toLocaleString('en-IN')] })] }), _jsx("p", { className: "max-w-[150px] text-right text-[11px] leading-snug text-muted", children: "Cash or UPI at sample collection" })] }) }));
    return (_jsxs(_Fragment, { children: [_jsxs(PublicBookingShell, { progressPct: progressPct, completedSteps: completedCount, totalSteps: SECTION_ORDER.length - 1, summary: _jsx(OrderSummaryPanel, { draft: draft, memberRoute: memberRoute }), children: [_jsxs("div", { className: "space-y-6 pb-28 lg:space-y-8 lg:pb-4", children: [_jsx("h1", { className: "text-xl font-bold tracking-tight text-brick sm:text-2xl", children: "Complete your booking" }), _jsxs("div", { className: "flex flex-col gap-5 sm:gap-6", role: "presentation", children: [_jsxs(BookingAccordionSection, { ...sectionProps('test', 0, 1, 'Tests', 'Selected tests'), children: [_jsx("ul", { className: "space-y-3", children: draft.cart.map((item) => {
                                                    const img = resolveCartPackageImage(item.id, item.imageUrl);
                                                    return (_jsxs("li", { className: "flex gap-3 rounded-xl border border-line p-3 sm:p-4", children: [_jsx("div", { className: "h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mp-teal-50 ring-1 ring-line/60", children: _jsx("img", { src: img, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("p", { className: "text-base font-semibold leading-snug text-navy", children: item.name }), _jsx("button", { type: "button", "aria-label": `Remove ${item.name}`, onClick: () => bookingCart.removeItem(item.id), className: "grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-mp-coral-50 hover:text-mp-coral", children: _jsx(Trash2, { className: "h-4 w-4", "aria-hidden": true }) })] }), _jsxs("p", { className: "mt-1 text-[15px] text-muted", children: [item.testCount, " ", item.testCount === 1 ? 'test' : 'tests', " \u00B7 \u20B9", item.memberPrice.toLocaleString('en-IN')] })] })] }, item.id));
                                                }) }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [_jsx("button", { type: "button", onClick: () => navigateToPopularPlans(navigate), className: "inline-flex min-h-12 items-center rounded-full border border-line px-6 text-[15px] font-semibold text-navy hover:bg-canvas", children: "Add or change tests" }), _jsx(BookingPrimaryButton, { onClick: () => advance('test'), children: "Continue" })] })] }), _jsx(BookingAccordionSection, { ...sectionProps('route', 1, 2, 'Account', 'How would you like to continue?'), children: _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("button", { type: "button", onClick: () => {
                                                        if (acc.authed) {
                                                            update({
                                                                route: 'member',
                                                                memberVerified: true,
                                                                guestOtpVerified: false,
                                                            });
                                                            advance('route');
                                                            return;
                                                        }
                                                        setCardVerifyOpen(true);
                                                    }, className: `flex flex-col rounded-xl border p-5 text-left transition ${draft.route === 'member' ? 'border-mp-teal bg-mp-teal-50' : 'border-line hover:border-mp-teal/40'}`, children: [_jsx(CreditCard, { className: "h-6 w-6 text-mp-teal-700", "aria-hidden": true }), _jsx("span", { className: "mt-3 text-base font-semibold text-navy", children: "I have a HealthIDCard" }), _jsx("span", { className: "mt-1.5 text-[15px] text-muted", children: "Member pricing for eligible tests" })] }), _jsxs("button", { type: "button", onClick: () => {
                                                        update({ route: 'guest', memberVerified: false, guestOtpVerified: false });
                                                        advance('route');
                                                    }, className: `flex flex-col rounded-xl border p-5 text-left transition ${draft.route === 'guest' ? 'border-mp-teal bg-mp-teal-50' : 'border-line hover:border-mp-teal/40'}`, children: [_jsx(UserRound, { className: "h-6 w-6 text-navy", "aria-hidden": true }), _jsx("span", { className: "mt-3 text-base font-semibold text-navy", children: "Continue without membership" }), _jsx("span", { className: "mt-1.5 text-[15px] text-muted", children: "No card or password required" })] })] }) }), _jsx(BookingAccordionSection, { ...sectionProps('identity', 2, 3, 'Patient', draft.route === 'member' ? 'Membership & patient' : 'Patient & mobile verification'), children: draft.route === 'member' ? (_jsx(MemberIdentityBlock, { acc: acc, draft: draft, update: update, onDone: () => advance('identity'), onVerify: () => setCardVerifyOpen(true) })) : draft.route === 'guest' ? (_jsx(GuestIdentityBlock, { draft: draft, update: update, guestMobile: guestMobile, setGuestMobile: setGuestMobile, onDone: () => advance('identity') })) : (_jsx("p", { className: "text-[15px] text-muted", children: "Choose member or guest in step 2 first." })) }), _jsx(BookingAccordionSection, { ...sectionProps('collection', 3, 4, 'Location', 'Collection method'), children: _jsx(CollectionLocationStep, { draft: draft, addresses: addresses, guestMode: guestAddressMode, update: update, onDone: () => advance('collection') }) }), _jsx(BookingAccordionSection, { ...sectionProps('schedule', 4, 5, 'Schedule', 'Date & time'), children: _jsxs("form", { onSubmit: (e) => {
                                                e.preventDefault();
                                                if (draft.date && draft.slot)
                                                    advance('schedule');
                                            }, children: [_jsxs("p", { className: "mb-4 flex items-center gap-2 text-[15px] font-medium text-navy", children: [_jsx(Calendar, { className: "h-5 w-5", "aria-hidden": true }), " Available slots in Nashik"] }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: dates.map((d) => (_jsx("button", { type: "button", onClick: () => update({ date: d.id, slot: '' }), className: `rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${activeDate === d.id ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'}`, children: d.label }, d.id))) }), _jsx("div", { className: "mt-5 flex flex-wrap gap-2.5", children: slots.map((s) => (_jsx("button", { type: "button", onClick: () => update({ slot: s }), className: `rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors ${draft.slot === s ? 'bg-mp-teal text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'}`, children: s }, s))) }), _jsx("div", { className: "mt-5", children: _jsx(BookingPrimaryButton, { type: "submit", disabled: !draft.date || !draft.slot, children: "Save & continue" }) })] }) }), _jsx(BookingAccordionSection, { ...sectionProps('review', 5, 6, 'Confirm', 'Review & confirm'), children: draft.route === 'member' && !acc.authed ? (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-[15px] leading-relaxed text-muted", children: "Verify the mobile saved on your HealthID Card, then pick the member this test is for." }), _jsx(BookingPrimaryButton, { type: "button", onClick: () => setCardVerifyOpen(true), children: "Verify HealthID Card" })] })) : !acc.authed ? (_jsx("p", { className: "text-[15px] leading-relaxed text-muted", children: "Log in to verify your HealthID Card, pick the member this test is for, then confirm." })) : !draft.memberId ? (_jsx(MemberIdentityBlock, { acc: acc, draft: draft, update: update, onDone: () => setOpen('review'), onVerify: () => setCardVerifyOpen(true) })) : (_jsxs("form", { onSubmit: confirmBooking, className: "space-y-4", children: [_jsx("dl", { className: "divide-y divide-line rounded-xl border border-line text-[15px]", children: [
                                                        ['Patient', draft.patientName || acc.member(draft.memberId || '')?.name],
                                                        ['Tests', draft.cart.map((c) => c.name).join(', ')],
                                                        [
                                                            'Collection',
                                                            draft.collection === 'home'
                                                                ? `Home · ${homeAddr?.line ?? '—'}`
                                                                : lab?.name,
                                                        ],
                                                        ['Schedule', `${dateLabel} · ${draft.slot}`],
                                                    ].map(([k, v]) => (_jsxs("div", { className: "flex justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4", children: [_jsx("dt", { className: "text-muted", children: k }), _jsx("dd", { className: "max-w-[58%] text-right font-semibold text-navy", children: v })] }, k))) }), _jsxs("div", { className: "flex gap-3 rounded-xl bg-mp-teal-50 p-4", children: [_jsx(Banknote, { className: "h-6 w-6 shrink-0 text-mp-teal-700", "aria-hidden": true }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-navy", children: "Pay at sample collection" }), _jsxs("p", { className: "mt-1.5 text-[15px] leading-relaxed text-muted", children: ["No online payment now. Pay ", _jsxs("strong", { className: "text-navy", children: ["\u20B9", total.toLocaleString('en-IN')] }), " in", ' ', _jsx("strong", { className: "text-navy", children: "cash or UPI" }), " when the phlebotomist arrives \u2014 totals are in your summary."] })] })] }), draft.cart.some((c) => c.prep) ? (_jsx("div", { className: "space-y-2", children: draft.cart
                                                        .filter((c) => c.prep)
                                                        .map((c) => (_jsxs("p", { className: "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-[15px] text-amber-950", children: [_jsxs("strong", { children: [c.name, ":"] }), " ", c.prep] }, c.id))) })) : null, acc.error ? _jsx("p", { className: "text-[14px] font-semibold text-coral", children: acc.error }) : null, _jsx(BookingPrimaryButton, { type: "submit", accent: "coral", disabled: acc.busy, children: acc.busy ? 'Saving…' : 'Confirm booking' })] })) })] })] }), mobileBar, _jsx(BookingSuccessModal, { open: Boolean(successModal), bookingId: successModal?.bookingId ?? '', patientName: successModal?.patientName ?? '', scheduleLabel: successModal?.scheduleLabel ?? '', total: successModal?.total ?? 0, testCount: successModal?.testCount ?? 0, whatsappMobile: successModal?.whatsappMobile, onDashboard: () => finishAfterSuccess(true), onExplore: () => finishAfterSuccess(false) })] }), !acc.authed && open === 'review' && draft.route !== 'member' ? (_jsx("div", { className: "fixed inset-0 z-[80]", children: _jsx(AccountLoginPage, { onClose: () => setOpen('schedule') }) })) : null, _jsx(MembershipVerifyModal, { open: cardVerifyOpen, onClose: () => setCardVerifyOpen(false), onMemberSelected: (member) => {
                    update({
                        route: 'member',
                        memberVerified: true,
                        guestOtpVerified: false,
                        memberId: member.id,
                        patientName: member.name,
                        memberDiscountEligible: true,
                        mobile: member.mobile,
                        cardId: member.cardId,
                    });
                    setCardVerifyOpen(false);
                    setOpen('collection');
                } })] }));
}
function CollectionLocationStep({ draft, addresses, guestMode, update, onDone, }) {
    const [collection, setCollection] = useState(draft.collection || 'home');
    const defaultAddressMode = draft.addressId === 'custom' || guestMode || addresses.length === 0 ? 'custom' : 'saved';
    const [addressMode, setAddressMode] = useState(defaultAddressMode);
    const [customLabel, setCustomLabel] = useState(draft.customAddressLabel);
    const [customLine, setCustomLine] = useState(draft.customAddressLine);
    const [savedId, setSavedId] = useState(draft.addressId === 'custom' ? addresses[0]?.id ?? 'home' : draft.addressId || addresses[0]?.id || 'home');
    function submit(e) {
        e.preventDefault();
        if (collection === 'lab') {
            update({
                collection: 'lab',
                labId: LABS[0].id,
                addressId: savedId,
                customAddressLabel: '',
                customAddressLine: '',
            });
            onDone();
            return;
        }
        if (addressMode === 'custom' || addresses.length === 0) {
            update({
                collection: 'home',
                addressId: 'custom',
                customAddressLabel: customLabel.trim(),
                customAddressLine: customLine.trim(),
                labId: LABS[0].id,
            });
        }
        else {
            update({
                collection: 'home',
                addressId: savedId,
                customAddressLabel: '',
                customAddressLine: '',
                labId: LABS[0].id,
            });
        }
        onDone();
    }
    const customValid = customLine.trim().length >= 8;
    return (_jsxs("form", { className: "space-y-5", onSubmit: submit, children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs("label", { className: "flex cursor-pointer gap-4 rounded-xl border border-line p-5 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50", children: [_jsx("input", { type: "radio", name: "collection", value: "home", checked: collection === 'home', onChange: () => setCollection('home'), className: "mt-1 scale-125" }), _jsxs("span", { children: [_jsxs("span", { className: "flex items-center gap-2 text-base font-semibold text-navy", children: [_jsx(Home, { className: "h-5 w-5" }), " Home collection"] }), _jsx("span", { className: "mt-1.5 block text-[15px] text-muted", children: "Free in Nashik \u00B7 phlebotomist at your door" })] })] }), _jsxs("label", { className: "flex cursor-pointer gap-4 rounded-xl border border-line p-5 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50", children: [_jsx("input", { type: "radio", name: "collection", value: "lab", checked: collection === 'lab', onChange: () => setCollection('lab'), className: "mt-1 scale-125" }), _jsxs("span", { children: [_jsxs("span", { className: "flex items-center gap-2 text-base font-semibold text-navy", children: [_jsx(MapPin, { className: "h-5 w-5" }), " Visit lab"] }), _jsx("span", { className: "mt-1.5 block text-[15px] text-muted", children: "Partner centre in Nashik" })] })] })] }), collection === 'home' ? (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-[15px] font-semibold text-navy", children: "Where should we collect the sample?" }), guestMode ? (_jsx("p", { className: "text-[14px] text-muted", children: "Add your Nashik address for home collection \u2014 you can save addresses later with a HealthID Card." })) : null, addresses.length > 0 ? (_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { type: "button", onClick: () => setAddressMode('saved'), className: `rounded-full px-4 py-2 text-[13px] font-semibold transition ${addressMode === 'saved' ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'}`, children: "Saved addresses" }), _jsx("button", { type: "button", onClick: () => setAddressMode('custom'), className: `rounded-full px-4 py-2 text-[13px] font-semibold transition ${addressMode === 'custom' ? 'bg-navy text-white' : 'bg-mp-teal-50 text-muted hover:text-navy'}`, children: "Enter another address" })] })) : null, addressMode === 'saved' && addresses.length > 0 ? (_jsx("div", { className: "space-y-3", children: addresses.map((a) => (_jsxs("label", { className: "flex gap-4 rounded-xl border border-line p-4 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50/60", children: [_jsx("input", { type: "radio", name: "savedAddress", value: a.id, checked: savedId === a.id, onChange: () => setSavedId(a.id), className: "mt-1 scale-125" }), _jsxs("span", { className: "text-[15px]", children: [_jsx("strong", { className: "text-base text-navy", children: a.label }), _jsx("br", {}), _jsx("span", { className: "text-muted", children: a.line })] })] }, a.id))) })) : (_jsxs("div", { className: "space-y-3 rounded-xl border border-dashed border-mp-teal/40 bg-mp-teal-50/30 p-4", children: [_jsxs("label", { className: "block text-[14px] font-semibold text-navy", children: ["Address label ", _jsx("span", { className: "font-normal text-muted", children: "(optional)" }), _jsx("input", { value: customLabel, onChange: (e) => setCustomLabel(e.target.value), placeholder: "e.g. Parents' home, Office", className: "mt-2 h-11 w-full rounded-xl border border-line bg-white px-4 text-[15px]" })] }), _jsxs("label", { className: "block text-[14px] font-semibold text-navy", children: ["Full address", _jsx("textarea", { value: customLine, onChange: (e) => setCustomLine(e.target.value), required: true, rows: 3, placeholder: "Flat, building, street, landmark, Nashik PIN", className: "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] leading-snug" })] }), !customValid && customLine.length > 0 ? (_jsx("p", { className: "text-[13px] text-brick", children: "Please enter at least 8 characters for the full address." })) : null] }))] })) : (_jsxs("div", { className: "rounded-xl border border-line bg-canvas px-4 py-3 text-[15px] text-muted", children: [_jsx("strong", { className: "text-navy", children: LABS[0].name }), _jsx("br", {}), LABS[0].line] })), _jsx(BookingPrimaryButton, { type: "submit", disabled: collection === 'home' && addressMode === 'custom' && !customValid, children: "Save & continue" })] }));
}
function MemberIdentityBlock({ acc, draft, update, onDone, onVerify, }) {
    if (!acc.authed) {
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-[15px] leading-relaxed text-muted", children: "Verify the mobile saved on your HealthID Card. We\u2019ll send an OTP, then you can choose who this test is for." }), _jsx(BookingPrimaryButton, { type: "button", onClick: onVerify, children: "Verify HealthID Card" })] }));
    }
    if (!acc.hydrated) {
        return _jsx("p", { className: "text-[15px] font-semibold text-muted", children: "Loading members on this card\u2026" });
    }
    return (_jsxs("form", { className: "space-y-4", onSubmit: (e) => {
            e.preventDefault();
            const memberId = String(new FormData(e.currentTarget).get('member') || '');
            const member = acc.member(memberId);
            if (!member)
                return;
            update({
                memberId,
                patientName: member.name,
                memberDiscountEligible: member.status === 'Active',
            });
            onDone();
        }, children: [_jsxs("div", { children: [_jsx("p", { className: "text-[16px] font-semibold text-navy", children: "Who is this booking for?" }), _jsx("p", { className: "mt-1 text-[14px] leading-relaxed text-muted", children: draft.cart.length
                            ? `These tests will be booked for the member you select: ${draft.cart.map((c) => c.name).join(', ')}.`
                            : 'Select a member on your HealthID Card.' })] }), acc.family.map((m) => (_jsxs("label", { className: "flex gap-4 rounded-xl border border-line p-4 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50", children: [_jsx("input", { type: "radio", name: "member", value: m.id, defaultChecked: draft.memberId === m.id || (!draft.memberId && m.id === acc.family[0]?.id), className: "mt-1 scale-125" }), _jsxs("span", { className: "text-[15px]", children: [_jsx("strong", { className: "text-base text-navy", children: m.name }), _jsx("br", {}), _jsxs("span", { className: "text-muted", children: [m.relation, m.status === 'Active' ? ' · Member rate' : ''] })] })] }, m.id))), _jsx(BookingPrimaryButton, { type: "submit", children: "Continue with this member" })] }));
}
function GuestIdentityBlock({ draft, update, guestMobile, setGuestMobile, onDone, }) {
    const [err, setErr] = useState('');
    return (_jsxs("form", { className: "max-w-md space-y-4", onSubmit: (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const patientName = String(fd.get('patientName') || '').trim();
            const patientAge = String(fd.get('patientAge') || '');
            const bookerIsPatient = fd.get('bookerIsPatient') === 'on';
            if (patientName.length < 2) {
                setErr('Enter the patient full name.');
                return;
            }
            update({
                patientName,
                patientAge,
                bookerIsPatient,
                bookerMobile: guestMobile,
                mobile: guestMobile,
                guestOtpVerified: true,
            });
            onDone();
        }, children: [_jsx("p", { className: "text-[14px] text-muted", children: "Patient details for this visit. Sign-in stays on the last step so the booking can be saved." }), _jsxs("label", { className: "block text-[15px] font-semibold text-navy", children: ["Patient full name", _jsx("input", { name: "patientName", required: true, defaultValue: draft.patientName, className: "mt-2 h-12 w-full rounded-xl border border-line px-4 text-base" })] }), _jsxs("label", { className: "block text-[15px] font-semibold text-navy", children: ["Age (optional)", _jsx("input", { name: "patientAge", defaultValue: draft.patientAge, className: "mt-2 h-12 w-full rounded-xl border border-line px-4 text-base" })] }), _jsxs("label", { className: "flex items-center gap-2 text-[15px] font-semibold text-navy", children: [_jsx("input", { type: "checkbox", name: "bookerIsPatient", defaultChecked: draft.bookerIsPatient }), "I am the patient"] }), _jsxs("label", { className: "block text-[15px] font-semibold text-navy", children: ["Mobile for booking updates", _jsx("input", { value: guestMobile, onChange: (e) => setGuestMobile(e.target.value.replace(/\D/g, '').slice(0, 10)), className: "mt-2 h-12 w-full rounded-xl border border-line px-4 text-base" })] }), err ? _jsx("p", { className: "text-[15px] text-coral", children: err }) : null, _jsx(BookingPrimaryButton, { type: "submit", children: "Continue" })] }));
}
function MembershipVerifyModal({ open, onClose, onMemberSelected, }) {
    const acc = useAccount();
    const [step, setStep] = useState('ask');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [masked, setMasked] = useState('');
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [members, setMembers] = useState([]);
    const [memberId, setMemberId] = useState('');
    const [mobile, setMobile] = useState('');
    useEffect(() => {
        if (!open)
            return;
        setStep('ask');
        setOtp('');
        setError('');
        setNotice('');
        setBusy(false);
        setMembers([]);
        setMemberId('');
    }, [open]);
    useEffect(() => {
        if (!open)
            return;
        function onKey(e) {
            if (e.key === 'Escape')
                onClose();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    if (!open)
        return null;
    async function sendCode() {
        const value = identifier.trim();
        if (value.length < 4) {
            setError('Enter the HealthID Card number or the mobile saved on that card.');
            return;
        }
        setBusy(true);
        setError('');
        setNotice('');
        try {
            const result = unwrap((await api.post('/membership/card-otp', { identifier: value })).data);
            setMasked(result.maskedMobile);
            setNotice(channelNotice(result.channel, result.delivered, result.devCode));
            setStep('otp');
        }
        catch (e) {
            setError(authErrorMessage(e));
        }
        finally {
            setBusy(false);
        }
    }
    async function confirmOtp() {
        if (!/^\d{6}$/.test(otp)) {
            setError('Enter the 6-digit OTP.');
            return;
        }
        setBusy(true);
        setError('');
        try {
            const result = unwrap((await api.post('/membership/card-otp/verify', { identifier: identifier.trim(), otp })).data);
            if (!acc.finishOtpLogin(result)) {
                setError('Could not verify this OTP. Please try again.');
                return;
            }
            const list = result.members?.length
                ? result.members
                : [{ id: 'self', name: result.user?.fullName || 'Member', relation: 'Self', isPrimary: true }];
            setMembers(list);
            setMemberId(list[0]?.id || '');
            setMobile(result.user?.mobile || '');
            setMasked(result.maskedMobile || masked);
            setStep('members');
            setNotice('');
        }
        catch (e) {
            setError(authErrorMessage(e));
        }
        finally {
            setBusy(false);
        }
    }
    const selected = members.find((m) => m.id === memberId) ?? members[0];
    return (_jsx("div", { className: "fixed inset-0 z-[90] grid place-items-center bg-navy/45 px-4 py-8", role: "presentation", onMouseDown: onClose, children: _jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "card-verify-title", className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl", onMouseDown: (e) => e.stopPropagation(), children: [_jsx("h2", { id: "card-verify-title", className: "text-xl font-bold text-navy", children: step === 'members' ? 'Who is this booking for?' : 'Verify HealthID Card' }), step === 'ask' ? (_jsx("p", { className: "mt-2 text-[15px] leading-relaxed text-muted", children: "We\u2019ll send an OTP to the mobile number saved on this card. You don\u2019t need the login screen." })) : null, step === 'otp' ? (_jsxs("p", { className: "mt-2 text-[15px] leading-relaxed text-muted", children: ["Enter the OTP sent to ", _jsx("strong", { className: "text-navy", children: masked || 'the mobile on this card' }), "."] })) : null, step === 'members' ? (_jsx("p", { className: "mt-2 text-[15px] leading-relaxed text-muted", children: "These members are on this HealthID Card. Pick one, then continue." })) : null, step === 'ask' ? (_jsxs("label", { className: "mt-5 block text-[15px] font-semibold text-navy", children: ["Card number or registered mobile", _jsx("input", { value: identifier, onChange: (e) => setIdentifier(e.target.value), autoFocus: true, placeholder: "HIC-\u2026 or 10-digit mobile", className: "mt-2 h-12 w-full rounded-xl border border-line px-4 text-base font-normal" })] })) : null, step === 'otp' ? (_jsxs("label", { className: "mt-5 block text-[15px] font-semibold text-navy", children: ["OTP", _jsx("input", { value: otp, onChange: (e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)), inputMode: "numeric", autoFocus: true, placeholder: "6-digit OTP", className: "mt-2 h-12 w-full rounded-xl border border-line px-4 text-base font-normal tracking-[0.3em]" })] })) : null, step === 'members' ? (_jsx("div", { className: "mt-5 max-h-72 space-y-3 overflow-y-auto", children: members.map((m) => (_jsxs("label", { className: "flex gap-4 rounded-xl border border-line p-4 has-[:checked]:border-mp-teal has-[:checked]:bg-mp-teal-50", children: [_jsx("input", { type: "radio", name: "card-member", value: m.id, checked: memberId === m.id, onChange: () => setMemberId(m.id), className: "mt-1 scale-125" }), _jsxs("span", { className: "text-[15px]", children: [_jsx("strong", { className: "text-base text-navy", children: m.name }), _jsx("br", {}), _jsx("span", { className: "text-muted", children: m.relation })] })] }, m.id))) })) : null, notice ? _jsx("p", { className: "mt-4 text-[14px] font-semibold text-mp-teal-700", children: notice }) : null, error ? _jsx("p", { className: "mt-4 text-[14px] font-semibold text-coral", children: error }) : null, _jsxs("div", { className: "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", children: [_jsx("button", { type: "button", onClick: onClose, className: "inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 text-base font-semibold text-navy hover:bg-canvas", children: "Cancel" }), step === 'ask' ? (_jsx(BookingPrimaryButton, { type: "button", disabled: busy, onClick: () => void sendCode(), children: busy ? 'Sending…' : 'Verify' })) : null, step === 'otp' ? (_jsx(BookingPrimaryButton, { type: "button", disabled: busy, onClick: () => void confirmOtp(), children: busy ? 'Checking…' : 'Confirm OTP' })) : null, step === 'members' ? (_jsx(BookingPrimaryButton, { type: "button", disabled: !selected, onClick: () => {
                                if (!selected)
                                    return;
                                onMemberSelected({
                                    id: selected.id,
                                    name: selected.name,
                                    mobile,
                                    cardId: identifier.trim(),
                                });
                            }, children: "Continue" })) : null] }), step === 'otp' ? (_jsx("button", { type: "button", disabled: busy, onClick: () => void sendCode(), className: "mt-4 text-[14px] font-semibold text-mp-teal-700 underline-offset-2 hover:underline disabled:opacity-60", children: "Resend OTP" })) : null] }) }));
}
export function PublicBookingConfirmedPage() {
    const draft = loadBookingDraft();
    const acc = useAccount();
    const id = draft.confirmedBookingId;
    const dateLabel = upcomingCollectionDates(14).find((d) => d.id === draft.date)?.label ?? draft.date;
    const memberRoute = draft.route === 'member';
    const total = draft.cart.length ? cartSubtotal(draft, memberRoute).total : 0;
    if (!id)
        return _jsx(Navigate, { to: "/book", replace: true });
    return (_jsx(PublicBookingShell, { progressPct: 100, completedSteps: 6, totalSteps: 6, children: _jsxs("div", { className: "mx-auto max-w-lg rounded-2xl border border-line bg-white p-8 text-center shadow-sm", children: [_jsx("span", { className: "inline-flex rounded-full bg-success/15 px-3 py-1 text-[12px] font-bold uppercase text-success", children: "Confirmed" }), _jsx("h1", { className: "mt-4 font-display text-[28px] font-extrabold text-ink", children: id }), _jsxs("p", { className: "mt-2 text-[15px] text-ink-soft", children: [draft.patientName, " \u00B7 ", dateLabel, " \u00B7 ", draft.slot] }), total > 0 ? (_jsxs("p", { className: "mt-4 text-[14px] text-ink-soft", children: ["Pay in cash or UPI when we collect the sample. Amount due: \u20B9", total.toLocaleString('en-IN')] })) : null, _jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center", children: [draft.route === 'member' && acc.authed ? (_jsx(Link, { to: "/account/bookings", className: "inline-flex h-12 items-center justify-center rounded-xl bg-teal px-6 font-bold text-white", children: "View booking" })) : (_jsx(Link, { to: "/book/lookup", className: "inline-flex h-12 items-center justify-center rounded-xl bg-teal px-6 font-bold text-white", children: "Find my booking" })), _jsx(Link, { to: "/", className: "inline-flex h-12 items-center justify-center rounded-xl border border-line px-6 font-bold text-ink-soft", children: "Book another" })] })] }) }));
}
