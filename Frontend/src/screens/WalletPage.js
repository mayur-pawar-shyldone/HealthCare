import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Copy, Gift, Receipt, Share2, Wallet } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { UserBadge, UserEmptyRow, UserPage, UserPageHeader, UserPanel, UserStatCard, UserTable, UserTd, UserTh, UserTHead, UserTr, } from '@/components/user/UserUi';
import { Button } from '@/components/ui/Button';
export function WalletPage() {
    const wallet = useQuery({
        queryKey: ['wallet'],
        queryFn: async () => unwrap((await api.get('/wallet')).data),
    });
    if (wallet.isLoading || !wallet.data)
        return _jsx(Loading, { label: "Loading wallet" });
    const w = wallet.data;
    async function copyCode() {
        await navigator.clipboard.writeText(w.referralCode);
    }
    async function shareReferral() {
        const text = `Join HealthID Card with my code ${w.referralCode} — free 1-year membership, ₹250 joining bonus & special lab rates. Sign up at HealthID Card!`;
        if (navigator.share) {
            await navigator.share({ title: 'HealthID Card referral', text }).catch(() => undefined);
        }
        else {
            await navigator.clipboard.writeText(text);
        }
    }
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "HealthID Wallet", subtitle: "Use credits at checkout \u00B7 Refer friends to earn more", actions: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Link, { to: "/transactions", children: _jsxs(Button, { variant: "secondary", className: "rounded-xl", children: [_jsx(Receipt, { className: "mr-2 h-4 w-4" }), "Payment history"] }) }), _jsx(Link, { to: "/home?edit=card", children: _jsxs(Button, { variant: "secondary", className: "rounded-xl", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Back to card"] }) })] }) }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [_jsx(UserStatCard, { label: "Total spendable", value: formatMoney(w.totalSpendable), hint: "Available at checkout" }), _jsx(UserStatCard, { label: "Wallet balance", value: formatMoney(w.balance), hint: "Joining bonus & credits" }), _jsx(UserStatCard, { label: "Referral credits", value: formatMoney(w.referralBalance), hint: `${w.referralTestsRemaining} uses left` })] }), _jsxs(UserPanel, { title: "Refer & earn", subtitle: `₹${w.rules.REFERRAL_BONUS} when your friend activates their card`, children: [_jsxs("div", { className: "rounded-2xl border border-dashed border-teal/30 bg-teal-light/30 p-4", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-teal", children: "Your referral code" }), _jsx("p", { className: "mt-2 font-mono text-2xl font-bold tracking-widest text-ink", children: w.referralCode }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsxs(Button, { variant: "secondary", size: "sm", className: "rounded-xl", onClick: copyCode, children: [_jsx(Copy, { className: "mr-1.5 h-4 w-4" }), " Copy"] }), _jsxs(Button, { size: "sm", className: "rounded-xl", onClick: shareReferral, children: [_jsx(Share2, { className: "mr-1.5 h-4 w-4" }), " Share"] })] })] }), _jsx("ul", { className: "mt-4 space-y-2 text-sm text-ink-soft", children: _jsxs("li", { className: "flex gap-2", children: [_jsx(Gift, { className: "mt-0.5 h-4 w-4 shrink-0 text-teal" }), "Redeem ", formatMoney(w.referralPerTest), " per test booking (max 5 tests)"] }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx(Wallet, { className: "h-4 w-4 text-teal" }), _jsx("h2", { className: "font-display text-lg text-ink", children: "Transaction history" })] }), _jsx(UserTable, { children: _jsxs("table", { className: "w-full min-w-[640px] text-left text-sm", children: [_jsxs(UserTHead, { children: [_jsx(UserTh, { children: "Date" }), _jsx(UserTh, { children: "Description" }), _jsx(UserTh, { children: "Type" }), _jsx(UserTh, { className: "text-right", children: "Amount" })] }), _jsx("tbody", { children: w.transactions.length === 0 ? (_jsx(UserEmptyRow, { colSpan: 4, message: `No wallet activity yet. Activate your card to receive ₹${w.rules.JOINING_BONUS} joining bonus.` })) : (w.transactions.map((t) => (_jsxs(UserTr, { children: [_jsx(UserTd, { className: "whitespace-nowrap text-ink-soft", children: new Date(t.createdAt).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }) }), _jsx(UserTd, { children: _jsx("p", { className: "font-medium text-ink", children: t.description }) }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: t.amount >= 0 ? 'success' : 'default', children: t.amount >= 0 ? 'Credit' : 'Debit' }) }), _jsxs(UserTd, { className: `text-right font-bold ${t.amount >= 0 ? 'text-emerald-600' : 'text-ink'}`, children: [t.amount >= 0 ? '+' : '', formatMoney(t.amount)] })] }, t.id)))) })] }) })] })] }));
}
