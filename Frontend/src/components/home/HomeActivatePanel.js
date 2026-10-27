import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldCheck, Sparkles, Truck, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
const perks = [
    { icon: Wallet, text: '63+ tests & 29 packages at member rates', tone: 'text-teal bg-teal-light' },
    { icon: Sparkles, text: '₹250 wallet bonus on activation', tone: 'text-amber-700 bg-amber-50' },
    { icon: Truck, text: 'Free home sample collection', tone: 'text-[#e03a28] bg-red-50' },
    { icon: Users, text: 'Up to 5 family members on one card', tone: 'text-indigo-600 bg-indigo-50' },
    { icon: ShieldCheck, text: 'WhatsApp reports & reminders', tone: 'text-emerald-600 bg-emerald-50' },
];
export function HomeActivatePanel({ onActivate, activatePending, compact }) {
    if (compact) {
        return (_jsxs("div", { className: "mx-auto w-full max-w-[400px] space-y-4 rounded-2xl border border-line/70 bg-white p-4 shadow-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-[#e03a28]", children: "Free activation" }), _jsx("p", { className: "mt-1 font-display text-lg text-ink", children: "Unlock your HealthID Card" })] }), _jsx("ul", { className: "grid gap-2 sm:grid-cols-2", children: perks.slice(0, 4).map((item) => (_jsxs("li", { className: "flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs text-ink-soft", children: [_jsx("span", { className: `grid h-7 w-7 shrink-0 place-items-center rounded-lg ${item.tone}`, children: _jsx(item.icon, { className: "h-3.5 w-3.5" }) }), item.text] }, item.text))) }), onActivate ? (_jsx(Button, { className: "h-11 w-full rounded-xl border-0 bg-gradient-to-r from-[#e03a28] to-[#c42e1e] text-sm font-bold shadow-sm hover:brightness-105", disabled: activatePending, onClick: onActivate, children: activatePending ? 'Activating…' : 'Activate free card — 1 year' })) : null] }));
    }
    return (_jsxs("div", { className: "flex h-full flex-col rounded-3xl border border-line/70 bg-white p-5 shadow-[0_8px_30px_rgba(12,25,41,0.06)] md:p-6", children: [_jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-[#e03a28]/10 to-teal-light p-4", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-[#e03a28]", children: "Free membership" }), _jsx("p", { className: "mt-1 font-display text-2xl text-ink", children: "Activate HealthID Card" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "1 year \u00B7 No cost \u00B7 \u20B9250 wallet bonus on activation" })] }), _jsx("ul", { className: "mt-5 space-y-3", children: perks.map((item) => (_jsxs("li", { className: "flex items-center gap-3 text-sm text-ink-soft", children: [_jsx("span", { className: `grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.tone}`, children: _jsx(item.icon, { className: "h-4 w-4" }) }), item.text] }, item.text))) }), onActivate ? (_jsx(Button, { className: "mt-auto w-full rounded-xl border-0 bg-gradient-to-r from-[#e03a28] to-[#c42e1e] shadow-sm hover:brightness-105", size: "lg", disabled: activatePending, onClick: onActivate, children: "Activate free card" })) : null] }));
}
