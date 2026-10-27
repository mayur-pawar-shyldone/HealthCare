import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { cartSubtotal } from '@/booking/booking-session';
import { useAccount } from '@/account/AccountContext';
import { LandingCartButton } from '@/components/site/LandingCartDrawer';
import { LandingProfileMenu } from '@/components/site/LandingProfileMenu';
import { resolveCartPackageImage } from '@/lib/cart-package-image';
function BookingProgressBar({ completedSteps, totalSteps, }) {
    return (_jsxs("div", { className: "hidden w-full max-w-[min(100%,420px)] flex-col items-center gap-2 md:flex", children: [_jsxs("div", { className: "flex w-full items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted", children: [_jsx("span", { className: "text-navy/70", children: "Progress" }), _jsxs("span", { className: "rounded-full bg-mp-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-mp-teal-700", children: [completedSteps, " / ", totalSteps] })] }), _jsx("div", { className: "flex w-full gap-1.5", children: Array.from({ length: totalSteps }, (_, i) => {
                    const done = i < completedSteps;
                    const current = i === completedSteps;
                    return (_jsx("div", { className: `h-2 flex-1 rounded-full transition-all duration-500 ${done ? 'bg-mp-teal shadow-[0_0_0_1px_rgba(23,90,118,0.08)]' : current ? 'bg-mp-teal/35' : 'bg-mp-teal-50'}`, "aria-hidden": true }, i));
                }) })] }));
}
export function PublicBookingShell({ children, summary, progressPct: _progressPct = 0, completedSteps = 0, totalSteps = 6, }) {
    const acc = useAccount();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (_jsxs("div", { className: "flex min-h-dvh flex-col bg-canvas font-sans text-navy", children: [_jsxs("div", { className: "shrink-0 border-b border-mp-coral-100 bg-mp-coral-50 px-4 py-2 text-center text-[13px] text-brick", children: [_jsx("span", { className: "font-semibold", children: "Nashik" }), _jsx("span", { className: "text-muted", children: " \u00B7 Free home collection \u00B7 Pay cash or UPI at sample collection" })] }), _jsx("header", { className: "sticky top-0 z-30 shrink-0 border-b border-line bg-white", children: _jsxs("div", { className: "mx-auto grid h-[64px] max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 lg:h-[68px] lg:gap-6 lg:px-5", children: [_jsx(Link, { to: "/", className: "shrink-0 justify-self-start", "aria-label": "HealthID Card home", children: _jsx(Logo, { variant: "compact", className: "!h-11 !max-w-[200px] sm:!h-12 sm:!max-w-[240px]" }) }), _jsxs("div", { className: "min-w-0 justify-self-center px-1", children: [_jsx(BookingProgressBar, { completedSteps: completedSteps, totalSteps: totalSteps }), _jsxs("p", { className: "mt-1 text-center text-[11px] font-medium text-muted md:hidden", children: ["Step ", Math.min(completedSteps + 1, totalSteps), " of ", totalSteps] })] }), _jsxs("div", { className: "flex shrink-0 items-center justify-end gap-3 justify-self-end", children: [_jsx(LandingCartButton, {}), acc.authed ? _jsx(LandingProfileMenu, {}) : null] })] }) }), _jsxs("div", { className: "mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col gap-4 px-4 py-4 md:px-5 lg:grid lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-4 lg:overflow-hidden lg:py-4", children: [_jsx("div", { className: "min-h-0 min-w-0 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1 [scrollbar-gutter:stable]", children: children }), summary ? (_jsx("aside", { className: "min-w-0 shrink-0 lg:sticky lg:top-[4.25rem] lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto", children: summary })) : null] })] }));
}
export function BookingCard({ children, className = '' }) {
    return _jsx("div", { className: `rounded-[20px] bg-white p-3.5 sm:p-4 ${className}`, children: children });
}
export function BookingPrimaryButton({ children, type = 'button', disabled, onClick, accent = 'navy', }) {
    const accentClass = accent === 'coral'
        ? 'bg-mp-coral hover:bg-mp-coral-600'
        : 'bg-navy hover:bg-navy-600';
    return (_jsx("button", { type: type, disabled: disabled, onClick: onClick, className: `inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${accentClass}`, children: children }));
}
export function BookingGhostButton({ children, onClick }) {
    return (_jsx("button", { type: "button", onClick: onClick, className: "inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors duration-150 hover:bg-canvas", children: children }));
}
export function OrderSummaryPanel({ draft, memberRoute }) {
    if (!draft.cart.length)
        return null;
    const { mrp, subtotal, discount, total, lines } = cartSubtotal(draft, memberRoute);
    return (_jsxs("div", { className: "overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-line/80", children: [_jsxs("div", { className: "rounded-t-[20px] bg-navy px-4 py-4 text-white sm:px-5", children: [_jsx("h3", { className: "text-lg font-bold tracking-tight", children: "Summary" }), _jsxs("p", { className: "mt-0.5 text-[13px] text-white/80", children: [draft.cart.length, " ", draft.cart.length === 1 ? 'test' : 'tests', " \u00B7 Nashik"] })] }), _jsxs("div", { className: "p-3.5 sm:p-4", children: [_jsx("ul", { className: "space-y-3", children: lines.map(({ item, lineTotal }) => {
                            const img = resolveCartPackageImage(item.id, item.imageUrl);
                            return (_jsxs("li", { className: "flex gap-3 border-b border-line pb-3 last:border-0 last:pb-0", children: [_jsx("div", { className: "h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mp-teal-50 ring-1 ring-line/60", children: _jsx("img", { src: img, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-sm font-semibold leading-snug text-navy", children: item.name }), _jsxs("p", { className: "mt-0.5 text-[12px] text-muted", children: [item.testCount, " ", item.testCount === 1 ? 'test' : 'tests'] }), _jsxs("p", { className: "mt-1 text-[14px] font-bold text-navy", children: ["\u20B9", lineTotal.toLocaleString('en-IN')] })] })] }, item.id));
                        }) }), _jsxs("dl", { className: "mt-4 space-y-2 border-t border-line pt-3 text-[13px]", children: [_jsxs("div", { className: "flex justify-between text-muted", children: [_jsx("dt", { children: "MRP" }), _jsxs("dd", { className: "line-through", children: ["\u20B9", mrp.toLocaleString('en-IN')] })] }), memberRoute && draft.memberDiscountEligible ? (_jsxs("div", { className: "flex justify-between font-medium text-mp-teal-700", children: [_jsx("dt", { children: "Member savings" }), _jsxs("dd", { children: ["\u2212 \u20B9", discount.toLocaleString('en-IN')] })] })) : (_jsxs("div", { className: "flex justify-between text-muted", children: [_jsx("dt", { children: "Your rate" }), _jsxs("dd", { className: "font-medium text-navy", children: ["\u20B9", subtotal.toLocaleString('en-IN')] })] })), _jsxs("div", { className: "flex justify-between border-t border-line pt-3 text-base font-bold text-navy", children: [_jsx("dt", { children: "Due at visit" }), _jsxs("dd", { children: ["\u20B9", total.toLocaleString('en-IN')] })] })] }), _jsxs("div", { className: "mt-4 rounded-xl bg-mp-teal-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-navy", children: ["Pay with ", _jsx("span", { className: "font-semibold", children: "cash or UPI" }), " when we collect your sample \u2014 no online payment during booking."] }), !memberRoute ? (_jsx("p", { className: "mt-3 text-[12px] leading-relaxed text-muted", children: "Have a HealthID Card? Choose member booking in step 2 for eligible discounts." })) : null] })] }));
}
