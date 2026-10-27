import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { formatMoney } from '@/lib/utils';
import { cn } from '@/lib/utils';
function Line({ label, value, tone = 'default', bold, strike, }) {
    const toneClass = {
        default: 'text-ink',
        muted: 'text-ink-soft',
        save: 'text-emerald-600',
        accent: 'text-[#e03a28]',
        wallet: 'text-teal',
        referral: 'text-violet-600',
    }[tone];
    return (_jsxs("div", { className: "flex items-center justify-between gap-4 py-1.5 text-sm", children: [_jsx("span", { className: cn('text-ink-soft', bold && 'font-semibold text-ink'), children: label }), _jsx("span", { className: cn(toneClass, bold && 'font-bold', strike && 'line-through opacity-60'), children: value })] }));
}
function SummaryCard({ label, value, hint, tone = 'default', }) {
    const tones = {
        default: 'border-line/60 bg-white/70',
        accent: 'border-[#e03a28]/25 bg-[#fff5f4]',
        save: 'border-emerald-200 bg-emerald-50/60',
        final: 'border-teal/30 bg-teal-light/40',
    };
    return (_jsxs("div", { className: cn('rounded-2xl border p-4', tones[tone]), children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-ink-soft", children: label }), _jsx("p", { className: "mt-1 font-display text-xl text-ink", children: value }), hint ? _jsx("p", { className: "mt-1 text-[11px] text-ink-soft", children: hint }) : null] }));
}
export function PaymentBreakdownSummary({ breakdown }) {
    const totalDiscount = breakdown.listDiscountFromMrp +
        breakdown.paymentDiscountAmount +
        breakdown.referralCreditApplied +
        breakdown.walletCreditApplied;
    return (_jsxs("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4", children: [_jsx(SummaryCard, { label: "MRP", value: formatMoney(breakdown.mrp), hint: "Reference rate", tone: "default" }), _jsx(SummaryCard, { label: "Special price", value: formatMoney(breakdown.specialPrice), hint: "Card / partner rate", tone: "accent" }), _jsx(SummaryCard, { label: "Total discount", value: breakdown.isFreeForMember ? 'FREE (member)' : `−${formatMoney(totalDiscount)}`, hint: breakdown.paymentDiscountPercent > 0
                    ? `Includes ${breakdown.paymentDiscountPercent}% payment promo on special price`
                    : 'Card + wallet + referral savings', tone: "save" }), _jsx(SummaryCard, { label: "Final paid", value: breakdown.isFreeForMember ? '₹0' : formatMoney(breakdown.amountDue), hint: "Amount settled at checkout", tone: "final" })] }));
}
export function PaymentBreakdown({ breakdown }) {
    const isFree = breakdown.isFreeForMember;
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(PaymentBreakdownSummary, { breakdown: breakdown }), _jsxs("div", { className: "rounded-2xl border border-line/60 bg-white/70 p-4 md:p-5", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Detailed calculation" }), _jsxs("div", { className: "mt-3 divide-y divide-line/40", children: [_jsx(Line, { label: "MRP (reference)", value: formatMoney(breakdown.mrp), tone: "muted", strike: true }), _jsx(Line, { label: "Special / card price", value: formatMoney(breakdown.specialPrice), bold: true }), breakdown.listDiscountFromMrp > 0 ? (_jsx(Line, { label: "Discount vs MRP", value: `−${formatMoney(breakdown.listDiscountFromMrp)}`, tone: "save" })) : null, !isFree && breakdown.paymentDiscountPercent > 0 ? (_jsxs(_Fragment, { children: [_jsx(Line, { label: `Payment promo (${breakdown.paymentDiscountPercent}% on special price)`, value: `−${formatMoney(breakdown.paymentDiscountAmount)}`, tone: "accent" }), _jsx(Line, { label: "After payment discount", value: formatMoney(breakdown.subtotalAfterPaymentDiscount) })] })) : null, breakdown.referralCreditApplied > 0 ? (_jsx(Line, { label: "Referral credit", value: `−${formatMoney(breakdown.referralCreditApplied)}`, tone: "referral" })) : null, breakdown.walletCreditApplied > 0 ? (_jsx(Line, { label: "Wallet credit", value: `−${formatMoney(breakdown.walletCreditApplied)}`, tone: "wallet" })) : null, _jsx(Line, { label: isFree ? 'Member benefit' : 'Final paid amount', value: isFree ? 'FREE' : formatMoney(breakdown.amountDue), bold: true })] })] })] }));
}
