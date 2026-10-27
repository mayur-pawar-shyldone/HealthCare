import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Clock, Layers, Package } from 'lucide-react';
import { cn, formatMoney } from '@/lib/utils';
import { packageIncludedTests } from '@/lib/packages';
import { testMemberPrice } from '@/lib/catalog';
import { PaymentDiscountBadge, PaymentDiscountCardNote } from '@/components/brand/PaymentDiscountOffer';
const ACCENTS = [
    'from-[#1a4d6d] to-[#2d7aa8]',
    'from-[#e03a28] to-[#f06554]',
    'from-[#4338ca] to-[#6366f1]',
    'from-[#059669] to-[#10b981]',
    'from-[#d97706] to-[#f59e0b]',
    'from-[#7c3aed] to-[#8b5cf6]',
];
export function PackageCard({ pkg, accentIndex = 0, compact, showIncluded }) {
    const [expanded, setExpanded] = useState(false);
    const included = packageIncludedTests(pkg);
    const mrp = Number(pkg.price);
    const memberPrice = testMemberPrice(pkg);
    const savings = mrp - memberPrice;
    const accent = ACCENTS[accentIndex % ACCENTS.length];
    const preview = included.slice(0, 4);
    const rest = included.length - preview.length;
    return (_jsxs("article", { className: cn('group flex h-full flex-col overflow-hidden rounded-3xl border border-line/70 bg-white shadow-[0_8px_30px_rgba(12,25,41,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(12,25,41,0.1)]', compact ? 'min-w-[300px] max-w-[340px]' : 'w-full'), children: [_jsx("div", { className: cn('h-2 bg-gradient-to-r', accent) }), _jsxs("div", { className: "flex flex-1 flex-col p-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-teal-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal", children: [_jsx(Package, { className: "h-3 w-3" }), "Health package"] }), _jsxs("div", { className: "flex flex-wrap justify-end gap-1", children: [pkg.isPopular ? (_jsx("span", { className: "rounded-full bg-teal px-2.5 py-1 text-[10px] font-bold text-white", children: "Popular" })) : null, _jsx(PaymentDiscountBadge, { size: "sm" })] })] }), _jsx("h3", { className: "mt-3 font-display text-lg leading-snug text-ink group-hover:text-teal", children: pkg.name }), _jsx("p", { className: cn('mt-1.5 text-xs leading-relaxed text-ink-soft', compact ? 'line-clamp-2' : 'line-clamp-3'), children: pkg.shortDescription }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [_jsxs("span", { className: "inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-medium text-ink-soft", children: [_jsx(Layers, { className: "h-3 w-3 text-teal" }), included.length, " tests included"] }), _jsxs("span", { className: "inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-medium text-ink-soft", children: [_jsx(Clock, { className: "h-3 w-3 text-teal" }), "~", pkg.reportHours, "h report"] })] }), showIncluded && included.length > 0 ? (_jsxs("div", { className: "mt-3 rounded-xl border border-line/70 bg-cream/40 p-3", children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-ink-soft", children: "Included tests" }), _jsx("ul", { className: "mt-2 space-y-1 text-[11px] leading-relaxed text-ink-soft", children: (expanded ? included : preview).map((t) => (_jsxs("li", { className: "flex gap-1.5", children: [_jsx("span", { className: "text-teal", children: "\u2022" }), _jsx("span", { children: t })] }, t))) }), rest > 0 ? (_jsxs("button", { type: "button", onClick: () => setExpanded((v) => !v), className: "mt-2 flex items-center gap-1 text-[11px] font-semibold text-teal hover:underline", children: [expanded ? 'Show less' : `+ ${rest} more tests`, _jsx(ChevronDown, { className: cn('h-3 w-3 transition', expanded && 'rotate-180') })] })) : null] })) : null, _jsxs("div", { className: "mt-auto border-t border-line/60 pt-4", children: [_jsxs("div", { className: "flex items-end justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-ink-soft", children: "Special price" }), _jsxs("div", { className: "mt-0.5 flex items-baseline gap-2", children: [_jsx("span", { className: "text-2xl font-bold text-teal", children: formatMoney(memberPrice) }), savings > 0 ? _jsx("span", { className: "text-sm text-ink-soft line-through", children: formatMoney(mrp) }) : null] })] }), savings > 0 ? (_jsxs("span", { className: "rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700", children: ["Save ", formatMoney(savings)] })) : null] }), _jsx(PaymentDiscountCardNote, { specialPrice: memberPrice }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx(Link, { to: `/appointments/book?testId=${pkg.id}`, className: "flex-1 rounded-xl bg-gradient-to-r from-[#e03a28] to-[#c42e1e] py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:brightness-105", children: "Book package" }), _jsx(Link, { to: `/tests/${pkg.slug}`, className: "rounded-xl border border-line px-3 py-2.5 text-xs font-semibold text-ink-soft transition hover:border-teal hover:text-teal", children: "Details" })] })] })] })] }));
}
