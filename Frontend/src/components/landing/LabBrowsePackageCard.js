import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { serviceBrowsePath } from '@/data/service-browse';
import { useCartActions } from '@/components/site/useCartActions';
import { useBookingCart } from '@/cart/BookingCartContext';
import { resolveCartPackageImage } from '@/lib/cart-package-image';
/** Package tile — browse-by-need mega menu (Blood Test, ECG, etc.). */
export function LabBrowsePackageCard({ pkg, onNavigate, browseCategoryId, browseTabId }) {
    const { addToCart, addAndBook } = useCartActions();
    const cartUi = useBookingCart();
    const cartItem = {
        id: pkg.id,
        name: pkg.name,
        memberPrice: pkg.price,
        mrp: pkg.mrp,
        testCount: pkg.tests,
        imageUrl: resolveCartPackageImage(pkg.id),
    };
    const browseTo = browseCategoryId && browseTabId ? serviceBrowsePath(browseCategoryId, browseTabId, pkg.id) : '/browse/health-checkups';
    const save = pkg.mrp > 0 ? Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100) : 0;
    const comingSoon = pkg.price <= 0;
    const isInstant = /instant/i.test(pkg.reportIn);
    const isService = !comingSoon && pkg.tests <= 1;
    const reportValue = isInstant
        ? 'Same day'
        : pkg.reportIn.replace(/\s*(hrs?|hours?)\b/i, '').trim() || pkg.reportIn;
    const stat1Value = isService ? '1' : String(pkg.tests);
    const stat1Label = isService ? 'Session' : 'Tests';
    const stat2Value = isService && isInstant ? 'Video' : reportValue;
    const stat2Label = isService ? (isInstant ? 'Connect' : 'Plan in') : 'Report in';
    const knowMore = pkg.id.startsWith('doc-') || pkg.id.startsWith('ayu-')
        ? 'Know more — view all services'
        : 'Know more — view all tests';
    return (_jsxs("article", { className: "group/card flex h-full flex-col rounded-[22px] border border-ink/10 bg-white p-2.5 transition duration-200 ease-out hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift", children: [_jsxs("div", { className: "relative flex min-h-[100px] flex-col rounded-[16px] bg-mint p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [pkg.tag ? (_jsx("span", { className: "rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold text-white", children: pkg.tag })) : (_jsx("span", { className: "rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink-soft", children: "Member rate" })), _jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm", children: _jsx(Activity, { className: "h-4 w-4", "aria-hidden": true }) })] }), _jsx("h4", { className: "mt-3 font-display text-[15px] font-bold leading-snug text-ink", children: pkg.name })] }), _jsxs("div", { className: "mt-3 flex flex-1 flex-col px-1 pb-1", children: [!comingSoon ? (_jsxs("div", { className: "grid grid-cols-3 gap-1 border-y border-ink/10 py-3 text-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[15px] font-bold leading-none text-ink", children: stat1Value }), _jsx("p", { className: "mt-1 text-[10px] font-medium text-ink-muted", children: stat1Label })] }), _jsxs("div", { className: "border-x border-ink/10 px-1", children: [_jsx("p", { className: "text-[15px] font-bold leading-none text-ink", children: stat2Value }), _jsx("p", { className: "mt-1 text-[10px] font-medium text-ink-muted", children: stat2Label })] }), _jsxs("div", { children: [_jsxs("p", { className: "text-[15px] font-bold leading-none text-ink", children: [save, "%"] }), _jsx("p", { className: "mt-1 text-[10px] font-medium text-ink-muted", children: "You save" })] })] })) : null, _jsx("div", { className: "mt-3 flex items-baseline gap-2", children: comingSoon ? (_jsx("span", { className: "text-lg font-bold text-ink-soft", children: "Coming soon" })) : (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-xl font-bold text-brand-600", children: ["\u20B9", pkg.price.toLocaleString('en-IN')] }), _jsxs("span", { className: "text-sm text-ink-muted line-through", children: ["\u20B9", pkg.mrp.toLocaleString('en-IN')] })] })) }), comingSoon ? (_jsx("span", { className: "mt-4 inline-flex h-10 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft", children: "Notify me" })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                                            addToCart(cartItem);
                                            cartUi.openDrawer();
                                            onNavigate?.();
                                        }, className: "inline-flex h-10 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink hover:border-teal/40", children: "Add to cart" }), _jsxs("button", { type: "button", onClick: () => {
                                            addAndBook(cartItem);
                                            onNavigate?.();
                                        }, className: "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-brand-600", children: ["Book now", _jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": true })] })] }), _jsx(Link, { to: browseTo, onClick: onNavigate, className: "mt-3 text-center text-[12px] font-medium text-ink-muted transition hover:text-teal", children: knowMore })] }))] })] }));
}
