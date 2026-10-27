import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { ArrowRight, Check, Home, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bookStartUrl } from '@/booking/booking-url';
const PREVIEW_COUNT = 3;
function savePct(price, mrp) {
    return Math.round(((mrp - price) / mrp) * 100);
}
export function HealthIdFvPackageCard({ pkg, tint }) {
    const save = savePct(pkg.price, pkg.mrp);
    const preview = pkg.includes.slice(0, PREVIEW_COUNT);
    return (_jsxs("article", { className: "group flex h-full flex-col rounded-[24px] border border-ink/10 bg-white p-2.5 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift", children: [_jsxs("div", { className: `flex flex-1 flex-col rounded-[17px] p-5 ${tint}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("span", { className: "rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-ink", children: [pkg.tests, " tests"] }), pkg.badge ? (_jsx("span", { className: "rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white", children: pkg.badge })) : null] }), _jsx("h3", { className: "mt-5 font-display text-[19px] font-extrabold leading-snug text-ink", children: pkg.name }), _jsx("p", { className: "mt-2 text-[13.5px] leading-relaxed text-ink-soft", children: pkg.summary }), preview.length > 0 ? (_jsx("ul", { className: "mt-4 space-y-2", children: preview.map((item) => (_jsxs("li", { className: "flex gap-2 text-[13px] leading-snug text-ink-soft", children: [_jsx(Check, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600", "aria-hidden": true }), item] }, item))) })) : null, _jsxs("ul", { className: "mt-auto space-y-2 pt-5", children: [_jsxs("li", { className: "flex items-center gap-2.5 text-[12.5px] text-ink-soft", children: [_jsx(Timer, { className: "h-3.5 w-3.5 shrink-0 text-ink-muted", "aria-hidden": true }), "Report in ", pkg.reportTime] }), _jsxs("li", { className: "flex items-center gap-2.5 text-[12.5px] text-ink-soft", children: [_jsx(Home, { className: "h-3.5 w-3.5 shrink-0 text-ink-muted", "aria-hidden": true }), "Free home collection"] })] })] }), _jsx("div", { className: "px-3 pb-1 pt-5", children: _jsxs("div", { className: "flex items-end justify-between gap-3 border-t border-ink/10 pt-4", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-display text-[24px] font-extrabold leading-none text-ink", children: ["\u20B9", pkg.price.toLocaleString('en-IN')] }), _jsxs("p", { className: "mt-1.5 text-[12px] text-ink-muted", children: [_jsxs("span", { className: "line-through", children: ["\u20B9", pkg.mrp.toLocaleString('en-IN')] }), save > 0 ? _jsxs("span", { className: "ml-1.5 font-bold text-coral", children: [save, "% off"] }) : null] }), _jsx("p", { className: "mt-1 text-[11.5px] text-ink-muted", children: "per person" })] }), _jsxs(Link, { to: bookStartUrl({
                                id: pkg.id,
                                name: pkg.name,
                                memberPrice: pkg.price,
                                mrp: pkg.mrp,
                                testCount: pkg.tests,
                            }), className: "inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-brand-600 active:scale-[0.98]", children: ["Book now", _jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": true })] })] }) })] }));
}
