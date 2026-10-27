import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Clock, Layers } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { formatMoney } from '@/lib/utils';
import { PaymentDiscountCardNote } from '@/components/brand/PaymentDiscountOffer';
export function TestCard({ test }) {
    const memberPrice = test.memberPrice ?? test.discountedPrice ?? test.price;
    const mrp = Number(test.price);
    const showStrike = Number(memberPrice) < mrp;
    const testCount = test.packageTests?.length ?? test.parameters.length;
    return (_jsxs("article", { className: "glass-panel flex h-full flex-col overflow-hidden rounded-3xl", children: [_jsxs("div", { className: "border-b border-line/50 px-5 py-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx(Badge, { children: test.category?.name ?? 'Lab test' }), _jsxs("div", { className: "flex flex-wrap justify-end gap-1", children: [test.isPackage ? _jsx(Badge, { tone: "teal", children: "Package" }) : null, test.isPopular ? _jsx(Badge, { tone: "sand", children: "Popular" }) : null] })] }), _jsx("h3", { className: "mt-3 font-display text-lg leading-snug", children: test.name })] }), _jsxs("div", { className: "flex flex-1 flex-col p-5", children: [_jsx("p", { className: "line-clamp-2 text-sm leading-relaxed text-ink-soft", children: test.shortDescription }), _jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-soft", children: [test.isPackage ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Layers, { className: "h-3.5 w-3.5 text-teal" }), " ", testCount, " tests"] })) : null, _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), " ~", test.reportHours, "h report"] })] }), _jsxs("div", { className: "mt-4 flex items-end gap-2", children: [_jsx("span", { className: "text-2xl font-bold tracking-tight text-teal", children: formatMoney(Number(memberPrice)) }), showStrike ? (_jsx("span", { className: "pb-0.5 text-sm text-ink-soft line-through", children: formatMoney(mrp) })) : null] }), _jsx(PaymentDiscountCardNote, { specialPrice: Number(memberPrice) }), _jsxs("div", { className: "mt-5 flex gap-2", children: [_jsx(Link, { to: `/tests/${test.slug}`, className: "flex-1", children: _jsx(Button, { variant: "secondary", size: "sm", className: "w-full rounded-xl", children: "Details" }) }), _jsx(Link, { to: `/appointments/book?testId=${test.id}`, className: "flex-1", children: _jsx(Button, { size: "sm", className: "w-full rounded-xl", children: test.isPackage ? 'Book package' : 'Book' }) })] })] })] }));
}
