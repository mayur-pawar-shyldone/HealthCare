import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { cartSubtotal, loadBookingDraft } from '@/booking/booking-session';
import { useBookingCart } from '@/cart/BookingCartContext';
import { resolveCartPackageImage } from '@/lib/cart-package-image';
import { navigateToPopularPlans } from '@/lib/landing-nav-scroll';
export function LandingCartDrawer({ open, onClose }) {
    const cart = useBookingCart();
    const acc = useAccount();
    const navigate = useNavigate();
    const panelRef = useRef(null);
    const draft = loadBookingDraft();
    const memberRoute = draft.route === 'member' && acc.authed;
    const { total, lines, mrp, discount } = cartSubtotal({ ...draft, cart: cart.cart }, memberRoute);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-[70] flex justify-end", children: [_jsx("button", { type: "button", "aria-label": "Close cart", className: "absolute inset-0 bg-ink/45 backdrop-blur-[2px]", onClick: onClose }), _jsxs("div", { ref: panelRef, role: "dialog", "aria-labelledby": "cart-drawer-title", className: "relative flex h-full w-full max-w-[420px] flex-col border-l border-ink/10 bg-white shadow-[0_0_60px_-12px_rgba(16,52,74,0.35)]", children: [_jsxs("div", { className: "relative overflow-hidden border-b border-ink/10 bg-gradient-to-br from-mint via-white to-brand-50/40 px-5 pb-5 pt-5", children: [_jsx("span", { className: "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-200/40 blur-2xl", "aria-hidden": true }), _jsxs("div", { className: "relative flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("p", { className: "inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Your booking cart"] }), _jsx("h2", { id: "cart-drawer-title", className: "mt-1 font-display text-[22px] font-bold leading-tight text-ink", children: "Selected tests" }), _jsx("p", { className: "mt-1 text-[13.5px] text-ink-muted", children: cart.count > 0
                                                    ? `${cart.count} ${cart.count === 1 ? 'package' : 'packages'} · book together in one visit`
                                                    : 'Add popular packages from the landing page' })] }), _jsx("button", { type: "button", "aria-label": "Close", onClick: onClose, className: "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-ink-muted shadow-sm transition hover:border-brand-200 hover:text-ink", children: _jsx(X, { className: "h-5 w-5" }) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4", children: cart.cart.length === 0 ? (_jsxs("div", { className: "rounded-2xl border border-dashed border-ink/15 bg-cream/50 px-6 py-12 text-center", children: [_jsx("span", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand-600", children: _jsx(ShoppingBag, { className: "h-7 w-7", "aria-hidden": true }) }), _jsx("p", { className: "mt-4 text-[16px] font-bold text-ink", children: "No tests yet" }), _jsx("p", { className: "mt-2 text-[14px] leading-snug text-ink-soft", children: "Pick from popular health packages \u2014 member rates apply with your free card." }), _jsxs("button", { type: "button", onClick: () => navigateToPopularPlans(navigate, onClose), className: "mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-bold text-white transition hover:bg-brand-600", children: ["Browse popular tests", _jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": true })] })] })) : (_jsx("ul", { className: "space-y-3", children: lines.map(({ item, lineTotal }) => {
                                const img = resolveCartPackageImage(item.id, item.imageUrl);
                                return (_jsx("li", { className: "overflow-hidden rounded-[18px] border border-ink/10 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md", children: _jsxs("div", { className: "flex gap-3 p-3", children: [_jsx("div", { className: "h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-mint ring-1 ring-ink/5", children: _jsx("img", { src: img, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) }), _jsxs("div", { className: "flex min-w-0 flex-1 items-start justify-between gap-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-display text-[15px] font-bold leading-snug text-ink", children: item.name }), _jsxs("p", { className: "mt-1 text-[12.5px] font-medium text-ink-muted", children: [item.testCount, " ", item.testCount === 1 ? 'test' : 'tests'] }), _jsxs("p", { className: "mt-2 text-[16px] font-extrabold text-ink", children: ["\u20B9", lineTotal.toLocaleString('en-IN')] })] }), _jsx("button", { type: "button", onClick: () => cart.removeItem(item.id), className: "shrink-0 rounded-full px-2 py-1 text-[12px] font-bold text-coral transition hover:bg-coral/10", children: "Remove" })] })] }) }, item.id));
                            }) })) }), cart.cart.length > 0 ? (_jsxs("div", { className: "border-t border-ink/10 bg-cream/30 px-5 py-4", children: [_jsxs("dl", { className: "space-y-1.5 text-[14px]", children: [_jsxs("div", { className: "flex justify-between text-ink-soft", children: [_jsx("dt", { children: "MRP" }), _jsxs("dd", { className: "line-through", children: ["\u20B9", mrp.toLocaleString('en-IN')] })] }), discount > 0 ? (_jsxs("div", { className: "flex justify-between font-semibold text-emerald-700", children: [_jsx("dt", { children: "Member savings" }), _jsxs("dd", { children: ["\u2212 \u20B9", discount.toLocaleString('en-IN')] })] })) : null, _jsxs("div", { className: "flex justify-between border-t border-ink/10 pt-2.5 text-[18px] font-extrabold text-ink", children: [_jsx("dt", { children: "Total" }), _jsxs("dd", { children: ["\u20B9", total.toLocaleString('en-IN')] })] })] }), cart.undoAvailable ? (_jsx("button", { type: "button", onClick: () => cart.undoRemove(), className: "mt-2 text-[13px] font-bold text-brand-600 hover:underline", children: "Undo remove" })) : null, _jsxs("div", { className: "mt-4 flex flex-col gap-2.5", children: [_jsxs("button", { type: "button", onClick: () => {
                                            onClose();
                                            navigate('/book');
                                        }, className: "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-coral text-[14px] font-bold text-white shadow-sm transition hover:bg-coral-dark", children: ["Continue booking", _jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": true })] }), _jsxs("button", { type: "button", onClick: () => navigateToPopularPlans(navigate, onClose), className: "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white text-[14px] font-bold text-ink transition hover:border-brand-300 hover:bg-brand-50/50", children: [_jsx(Plus, { className: "h-4 w-4 text-brand-600", "aria-hidden": true }), "Add more tests"] })] })] })) : null] })] }));
}
export function LandingCartButton({ variant = 'compact' }) {
    const { count, openDrawer } = useBookingCart();
    if (variant === 'header') {
        return (_jsxs("button", { type: "button", "aria-label": count ? `Cart, ${count} tests selected` : 'Cart, empty', onClick: openDrawer, className: "group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1.5 pl-1.5 pr-3.5 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/40 sm:pr-4", children: [_jsxs("span", { className: "relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm transition group-hover:scale-[1.03]", children: [_jsx(ShoppingBag, { className: "h-4 w-4", "aria-hidden": true }), count > 0 ? (_jsx("span", { className: "absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white ring-2 ring-white", children: count > 9 ? '9+' : count })) : null] }), _jsxs("span", { className: "hidden flex-col items-start leading-none sm:flex", children: [_jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted", children: "Cart" }), _jsx("span", { className: "mt-0.5 text-[13px] font-bold text-ink group-hover:text-brand-600", children: count > 0 ? `${count} selected` : 'Add tests' })] })] }));
    }
    return (_jsxs("button", { type: "button", "aria-label": count ? `Cart, ${count} tests selected` : 'Cart, empty', onClick: openDrawer, className: "relative grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-sm transition hover:border-brand-200 hover:text-brand-600 sm:h-10 sm:w-10", children: [_jsx(ShoppingBag, { className: "h-[18px] w-[18px]", "aria-hidden": true }), count > 0 ? (_jsx("span", { className: "absolute -right-0.5 -top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[11px] font-bold text-white ring-2 ring-white", children: count > 9 ? '9+' : count })) : null] }));
}
export function CartToast() {
    const cart = useBookingCart();
    if (!cart.toast)
        return null;
    return (_jsxs("div", { className: "fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-lg", children: [_jsx("span", { className: "text-[14px] font-semibold text-ink", children: cart.toast }), cart.toast === 'Added to cart' ? (_jsx("button", { type: "button", onClick: cart.clearToast, className: "text-[13px] font-bold text-brand-600", children: "Dismiss" })) : (_jsxs(_Fragment, { children: [cart.undoAvailable ? (_jsx("button", { type: "button", onClick: () => {
                            cart.undoRemove();
                            cart.clearToast();
                        }, className: "text-[13px] font-bold text-brand-600", children: "Undo" })) : null, _jsx("button", { type: "button", onClick: cart.clearToast, className: "text-[13px] font-bold text-ink-muted", children: "OK" })] }))] }));
}
