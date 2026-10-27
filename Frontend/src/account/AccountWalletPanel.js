import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Gift, Share2, Wallet } from 'lucide-react';
import { PLATFORM } from '@/data/platform-content';
import { useAccount } from '@/account/AccountContext';
import { formatMoney } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
export function AccountWalletPanel() {
    const acc = useAccount();
    const [copied, setCopied] = useState(false);
    const w = acc.wallet;
    const balance = w?.balance ?? 0;
    const referralBalance = w?.referralBalance ?? 0;
    const totalSpendable = w?.totalSpendable ?? balance + referralBalance;
    const referralPerTest = w?.referralPerTest ?? w?.rules.REFERRAL_PER_TEST ?? 0;
    const referralTestsRemaining = w?.referralTestsRemaining ?? 0;
    const referralBonus = w?.rules.REFERRAL_BONUS ?? 0;
    const referralPlain = w?.referralCode || '';
    const referralCode = referralPlain.split('').join(' ');
    async function copyCode() {
        const plain = referralPlain;
        await navigator.clipboard.writeText(plain);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    }
    async function shareReferral() {
        const plain = referralPlain;
        const text = `Join ${PLATFORM.brand} with code ${plain} — free membership & special lab rates!`;
        if (navigator.share) {
            await navigator.share({ title: `${PLATFORM.brand} referral`, text }).catch(() => undefined);
        }
        else {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    }
    return (_jsxs("div", { className: "flex flex-1 flex-col gap-4", children: [_jsxs("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal via-[#256d8f] to-[#1a4d6d] p-5 text-white shadow-[0_12px_32px_rgba(26,77,109,0.25)]", children: [_jsx("div", { className: "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" }), _jsx("div", { className: "relative flex items-start justify-between gap-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl bg-white/15", children: _jsx(Wallet, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-white/70", children: "Available to spend" }), _jsx("p", { className: "text-xs text-white/60", children: "Applied automatically at checkout" })] })] }) }), _jsx("p", { className: "relative mt-4 font-display text-[2.5rem] leading-none tracking-tight", children: formatMoney(totalSpendable) }), _jsxs("p", { className: "relative mt-2 text-sm text-white/75", children: [formatMoney(balance), " balance + ", formatMoney(referralBalance), " referral"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "rounded-xl border border-line/70 bg-cream/40 p-3.5", children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-ink-soft", children: "Wallet balance" }), _jsx("p", { className: "mt-1 font-display text-xl text-ink", children: formatMoney(balance) }), _jsx("p", { className: "mt-0.5 text-[11px] leading-snug text-ink-soft", children: "Joining bonus & credits" })] }), _jsxs("div", { className: "rounded-xl border border-[#e03a28]/20 bg-gradient-to-br from-red-50/80 to-white p-3.5", children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-[#e03a28]", children: "Referral credits" }), _jsx("p", { className: "mt-1 font-display text-xl text-[#e03a28]", children: formatMoney(referralBalance) }), _jsxs("p", { className: "mt-0.5 text-[11px] leading-snug text-ink-soft", children: [formatMoney(referralPerTest), "/test \u00B7 ", referralTestsRemaining, " uses left"] })] })] }), _jsxs("div", { className: "rounded-xl border border-teal/20 bg-teal-light/20 p-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("p", { className: "text-[10px] font-bold uppercase tracking-wider text-teal", children: ["Refer & earn \u20B9", referralBonus] }), _jsx(Gift, { className: "h-4 w-4 text-teal" })] }), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [_jsx("code", { className: "flex-1 rounded-lg bg-white px-3 py-2.5 font-mono text-base font-bold tracking-[0.2em] text-ink", children: referralCode }), _jsx("button", { type: "button", onClick: copyCode, className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line/70 bg-white text-teal transition hover:border-teal/40 hover:bg-teal-light/30", "aria-label": "Copy referral code", children: copied ? _jsx(Check, { className: "h-4 w-4 text-emerald-600" }) : _jsx(Copy, { className: "h-4 w-4" }) }), _jsx("button", { type: "button", onClick: shareReferral, className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line/70 bg-white text-teal transition hover:border-teal/40 hover:bg-teal-light/30", "aria-label": "Share referral", children: _jsx(Share2, { className: "h-4 w-4" }) })] }), _jsx("p", { className: "mt-2 text-xs text-ink-soft", children: "Friend activates their card \u2192 you earn referral wallet credits" })] }), _jsx(Link, { to: "/transactions", className: "mt-auto", children: _jsx(Button, { variant: "secondary", className: "h-11 w-full rounded-xl text-sm font-semibold", children: "View transaction history" }) })] }));
}
