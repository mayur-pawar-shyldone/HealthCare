import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { loadBookingDraft, patchBookingDraft } from '@/booking/booking-session';
import { resolveCartPackageImage } from '@/lib/cart-package-image';
import { PublicBookingConfirmedPage, PublicBookingCheckoutPage } from '@/booking/PublicBookingCheckoutPage';
import { BookingCard, BookingPrimaryButton, PublicBookingShell } from '@/booking/PublicBookingShell';
import { useAccount, validMobile } from '@/account/AccountContext';
import { authErrorMessage, sendOtp, verifyOtp } from '@/services/otp';
import api, { unwrap } from '@/services/api';
function RequireCart({ children }) {
    const draft = loadBookingDraft();
    if (!draft.cart.length && !draft.confirmedBookingId)
        return _jsx(Navigate, { to: "/", replace: true });
    return _jsx(_Fragment, { children: children });
}
export function PublicBookingStartPage() {
    const [params] = useSearchParams();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const id = params.get('id');
        const name = params.get('name');
        const price = Number(params.get('price'));
        const mrp = Number(params.get('mrp'));
        const tests = Number(params.get('tests') || '1');
        const prep = params.get('prep') || undefined;
        if (!id || !name || !price) {
            setReady(true);
            return;
        }
        const item = {
            id,
            name,
            memberPrice: price,
            mrp: mrp || Math.round(price * 2.2),
            testCount: tests,
            prep,
            imageUrl: resolveCartPackageImage(id),
        };
        const current = loadBookingDraft().cart;
        if (!current.some((c) => c.id === id)) {
            patchBookingDraft({ cart: [...current, item] });
        }
        setReady(true);
    }, [params]);
    if (!ready)
        return null;
    const id = params.get('id');
    if (!id)
        return _jsx(Navigate, { to: "/", replace: true });
    return _jsx(Navigate, { to: "/book", replace: true });
}
function LookupPage() {
    const acc = useAccount();
    const [mobile, setMobile] = useState('');
    const [bookingId, setBookingId] = useState('');
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [rows, setRows] = useState([]);
    return (_jsx(PublicBookingShell, { children: _jsxs(BookingCard, { children: [_jsx("h1", { className: "font-display text-[26px] font-extrabold text-ink", children: "Find my booking" }), _jsx("p", { className: "mt-2 text-[15px] text-ink-soft", children: "Booking ID and verified mobile must both match." }), _jsxs("div", { className: "mt-6 max-w-md space-y-3", children: [_jsx("input", { placeholder: "Booking ID e.g. HID-12345", value: bookingId, onChange: (e) => setBookingId(e.target.value.toUpperCase()), className: "h-12 w-full rounded-xl border border-line px-4" }), _jsx("input", { placeholder: "Mobile used when booking", value: mobile, onChange: (e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)), className: "h-12 w-full rounded-xl border border-line px-4" }), !verified && otpSent ? (_jsx("input", { placeholder: "OTP", value: otp, onChange: (e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)), className: "h-12 w-full rounded-xl border border-line px-4" })) : null, error ? _jsx("p", { className: "text-[14px] font-semibold text-coral", children: error }) : null, _jsx(BookingPrimaryButton, { disabled: busy || verified, onClick: () => {
                                if (verified || busy)
                                    return;
                                if (!validMobile(mobile)) {
                                    setError('Enter the 10-digit mobile used when booking.');
                                    return;
                                }
                                if (!otpSent) {
                                    setBusy(true);
                                    setError('');
                                    void sendOtp({ mobile, purpose: 'login' })
                                        .then((result) => {
                                        setOtpSent(true);
                                        setBusy(false);
                                        if (result.devCode) {
                                            setError(`SMS is not connected yet. Your OTP is ${result.devCode}.`);
                                        }
                                    })
                                        .catch((e) => {
                                        setBusy(false);
                                        setError(authErrorMessage(e));
                                    });
                                    return;
                                }
                                if (!/^\d{6}$/.test(otp)) {
                                    setError('Enter the 6-digit OTP.');
                                    return;
                                }
                                setBusy(true);
                                setError('');
                                void verifyOtp({ mobile, otp, purpose: 'login' })
                                    .then(async (result) => {
                                    if (!result.verified || !result.accessToken) {
                                        setBusy(false);
                                        setError('Could not verify OTP. Please try again.');
                                        return;
                                    }
                                    acc.finishOtpLogin(result);
                                    const list = unwrap((await api.get('/appointments')).data);
                                    const q = bookingId.trim().toUpperCase();
                                    setRows(q ? list.filter((a) => (a.code || a.id).toUpperCase().includes(q)) : list);
                                    setBusy(false);
                                    setVerified(true);
                                })
                                    .catch((e) => {
                                    setBusy(false);
                                    setError(authErrorMessage(e));
                                });
                            }, children: verified ? 'Verified' : busy ? 'Please wait…' : otpSent ? 'Verify & lookup' : 'Send OTP' })] }), verified ? (_jsx("ul", { className: "mt-8 space-y-3", children: rows.length ? (rows.map((b) => (_jsxs("li", { className: "rounded-xl border border-line p-4", children: [_jsx("p", { className: "font-bold text-ink", children: b.code }), _jsxs("p", { className: "text-[14px] text-ink-soft", children: [b.test?.name, " \u00B7 ", String(b.date).slice(0, 10), " \u00B7 ", b.status] })] }, b.id)))) : (_jsx("p", { className: "text-[14px] text-ink-soft", children: "No booking found." })) })) : null] }) }));
}
export function PublicBookingRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "start", element: _jsx(PublicBookingStartPage, {}) }), _jsx(Route, { path: "lookup", element: _jsx(LookupPage, {}) }), _jsx(Route, { path: "confirmed", element: _jsx(PublicBookingConfirmedPage, {}) }), _jsx(Route, { path: "", element: _jsx(RequireCart, { children: _jsx(PublicBookingCheckoutPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/book", replace: true }) })] }));
}
