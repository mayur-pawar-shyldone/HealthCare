import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { BadgePercent, Sparkles } from 'lucide-react';
import { PLATFORM } from '@/data/platform-content';
import { cn, formatMoney } from '@/lib/utils';
import { usePlatformPricing } from '@/hooks/usePlatformPricing';
/** Fallback when API hasn't loaded — keeps SSR/build stable */
export const CHECKOUT_DISCOUNT_PCT = PLATFORM.membership.flatDiscount;
export function usePaymentDiscountCopy() {
    const { settings, activePercent, isPromoActive } = usePlatformPricing();
    const pct = isPromoActive ? activePercent : 0;
    const label = settings.promoLabel || `Extra ${pct}% off special price at payment`;
    return {
        pct,
        isPromoActive,
        short: pct > 0 ? `${pct}% off special price at payment` : label,
        long: pct > 0 ? `${label} (not on MRP)` : label,
        cardNote: pct > 0 ? `Extra ${pct}% off special price at checkout` : label,
    };
}
/** Large banner — tests page, home sections */
export function PaymentDiscountBanner({ className }) {
    const copy = usePaymentDiscountCopy();
    if (!copy.isPromoActive)
        return null;
    return (_jsxs("div", { className: cn('relative overflow-hidden rounded-2xl border-2 border-[#e03a28]/25 bg-gradient-to-r from-[#fff0ee] via-white to-teal-light/40 px-4 py-4 md:px-6 md:py-5', className), children: [_jsx("div", { className: "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#e03a28]/10 blur-2xl" }), _jsxs("div", { className: "relative flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#e03a28] to-[#c42e1e] text-white shadow-md", children: _jsx(BadgePercent, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-bold text-ink md:text-lg", children: copy.long }), _jsxs("p", { className: "mt-1 max-w-xl text-sm text-ink-soft", children: ["MRP is for reference. You get partner special rates first, then an automatic ", copy.pct, "% reduction on that special price at checkout."] })] })] }), _jsx(PaymentDiscountBadge, { size: "lg" })] })] }));
}
/** Compact strip — landing, header */
export function PaymentDiscountStrip({ className }) {
    const copy = usePaymentDiscountCopy();
    if (!copy.isPromoActive)
        return null;
    return (_jsxs("div", { className: cn('flex flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-[#e03a28] via-[#d43325] to-teal px-4 py-2.5 text-center text-sm font-semibold text-white', className), children: [_jsx(Sparkles, { className: "h-4 w-4 shrink-0" }), _jsxs("span", { children: ["Launch offer: ", _jsxs("strong", { children: [copy.pct, "% off special price at every payment"] }), " (not on MRP)"] }), _jsx(Sparkles, { className: "h-4 w-4 shrink-0" })] }));
}
/** Pill badge for cards, headers, checkout */
export function PaymentDiscountBadge({ size = 'md', className, }) {
    const copy = usePaymentDiscountCopy();
    if (!copy.isPromoActive)
        return null;
    const sizes = {
        sm: 'px-2 py-0.5 text-[9px]',
        md: 'px-2.5 py-1 text-[10px]',
        lg: 'px-4 py-2 text-xs',
    };
    return (_jsxs("span", { className: cn('inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e03a28] font-bold uppercase tracking-wide text-white shadow-sm', sizes[size], className), title: copy.long, children: [_jsx(BadgePercent, { className: size === 'lg' ? 'h-4 w-4' : 'h-3 w-3' }), copy.pct, "% on special price"] }));
}
/** On product cards under price */
export function PaymentDiscountCardNote({ specialPrice }) {
    const copy = usePaymentDiscountCopy();
    if (!copy.isPromoActive)
        return null;
    const after = specialPrice != null && specialPrice > 0
        ? Math.round(specialPrice * (1 - copy.pct / 100))
        : null;
    return (_jsx("div", { className: "mt-2 rounded-lg border border-[#e03a28]/20 bg-[#fff5f4] px-2.5 py-1.5", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(BadgePercent, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e03a28]" }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-semibold leading-snug text-[#9a2a1e]", children: copy.cardNote }), after != null ? (_jsxs("p", { className: "mt-0.5 text-[10px] font-bold text-teal", children: ["Pay ~", formatMoney(after), " at checkout (after ", copy.pct, "% on special price)"] })) : null] })] }) }));
}
/** Inline CTA for users without card (optional secondary link) */
export function PaymentDiscountActivateLink() {
    return (_jsx(Link, { to: "/home?edit=card", className: "text-xs font-semibold text-teal hover:underline", children: "Activate free HealthID Card \u2192" }));
}
// Back-compat re-exports
export const MembershipPricingBanner = PaymentDiscountBanner;
export const MembershipCheckoutNote = PaymentDiscountCardNote;
