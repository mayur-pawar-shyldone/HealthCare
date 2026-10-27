import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Check, Copy, Wallet } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
import { formatMoney } from '@/lib/utils';
export function AccountDashboardWalletPanel() {
    const acc = useAccount();
    const [copied, setCopied] = useState(false);
    const walletBalance = acc.wallet?.balance ?? 0;
    const referralCredits = acc.wallet?.referralBalance ?? 0;
    const referralCode = acc.wallet?.referralCode || '';
    function copy() {
        navigator.clipboard?.writeText(referralCode).catch(() => undefined);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    }
    return (_jsxs(AccountDashboardPanel, { title: "Wallet", action: _jsx(Wallet, { className: "mt-0.5 h-5 w-5 text-mp-teal-700", "aria-hidden": true }), className: "flex flex-col", children: [_jsx("p", { className: "text-[13px] text-muted", children: "Available to spend" }), _jsx("p", { className: "mt-0.5 text-[2rem] font-extrabold leading-none tracking-tight text-navy", children: formatMoney(walletBalance + referralCredits) }), _jsx("p", { className: "mt-1.5 text-[13px] text-muted", children: "Applied automatically at checkout" }), _jsxs("div", { className: "mt-4 grid grid-cols-2 divide-x divide-line", children: [_jsxs("div", { className: "px-4", children: [_jsx("p", { className: "text-sm text-muted", children: "Balance" }), _jsx("p", { className: "text-lg font-bold text-navy", children: formatMoney(walletBalance) })] }), _jsxs("div", { className: "px-4", children: [_jsx("p", { className: "text-sm text-muted", children: "Referral credits" }), _jsx("p", { className: "text-lg font-bold text-navy", children: formatMoney(referralCredits) })] })] }), _jsxs("div", { className: "mt-auto pt-6", children: [_jsx("p", { className: "text-sm text-muted", children: "Refer a friend, earn \u20B9200 per test" }), _jsxs("div", { className: "mt-2 flex items-center justify-between rounded-xl border border-dashed border-mp-teal bg-mp-teal-50 px-5 py-3.5", children: [_jsx("span", { className: "font-mono text-[15px] font-bold tracking-[0.4em] text-mp-teal-700", children: referralCode }), _jsx("button", { type: "button", onClick: copy, "aria-label": copied ? 'Copied' : 'Copy referral code', className: "flex items-center gap-1 text-sm font-medium text-mp-teal-700", children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "h-4 w-4" }), " Copied"] })) : (_jsx(Copy, { className: "h-5 w-5" })) })] })] })] }));
}
