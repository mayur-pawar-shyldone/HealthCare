import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Receipt } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { UserBadge, UserEmptyRow, UserPage, UserPageHeader, UserPagination, UserTable, UserTd, UserTh, UserTHead, UserTr, } from '@/components/user/UserUi';
import { useState } from 'react';
function statusTone(status) {
    if (status === 'PAID')
        return 'success';
    if (status === 'PENDING')
        return 'warn';
    if (status === 'FAILED')
        return 'danger';
    return 'default';
}
export function TransactionsPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ['payment-transactions', page],
        queryFn: async () => unwrap((await api.get('/payments/transactions', { params: { page, limit: 15 } })).data),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading payment history" });
    const items = data?.items ?? [];
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "Payment history", subtitle: "Lab booking payments, discounts applied, and settlement status" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [_jsxs("div", { className: "glass-panel rounded-3xl p-5", children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-ink-soft", children: "Total transactions" }), _jsx("p", { className: "mt-2 font-display text-2xl text-ink", children: data?.total ?? 0 })] }), _jsxs("div", { className: "glass-panel rounded-3xl p-5", children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-ink-soft", children: "Paid" }), _jsx("p", { className: "mt-2 font-display text-2xl text-emerald-600", children: items.filter((t) => t.status === 'PAID').length })] }), _jsxs("div", { className: "glass-panel rounded-3xl p-5", children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-ink-soft", children: "Pending / COD" }), _jsx("p", { className: "mt-2 font-display text-2xl text-amber-700", children: items.filter((t) => t.status === 'PENDING').length })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx(Receipt, { className: "h-4 w-4 text-teal" }), _jsx("h2", { className: "font-display text-lg text-ink", children: "All payments" })] }), _jsx(UserTable, { children: _jsxs("table", { className: "w-full min-w-[720px] text-left text-sm", children: [_jsxs(UserTHead, { children: [_jsx(UserTh, { children: "Date" }), _jsx(UserTh, { children: "Booking" }), _jsx(UserTh, { children: "Test" }), _jsx(UserTh, { children: "Method" }), _jsx(UserTh, { children: "Status" }), _jsx(UserTh, { className: "text-right", children: "Amount" }), _jsx(UserTh, { className: "text-right", children: " " })] }), _jsx("tbody", { children: items.length === 0 ? (_jsx(UserEmptyRow, { colSpan: 7, message: "No payment transactions yet. Book a test to see your payment ledger here." })) : (items.map((t) => (_jsxs(UserTr, { children: [_jsx(UserTd, { className: "whitespace-nowrap text-ink-soft", children: new Date(t.createdAt).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }) }), _jsx(UserTd, { className: "font-mono text-xs", children: t.bookingCode }), _jsxs(UserTd, { children: [_jsx("p", { className: "font-medium text-ink", children: t.testName }), t.breakdown?.paymentDiscountPercent > 0 ? (_jsxs("p", { className: "text-[11px] text-[#e03a28]", children: [t.breakdown.paymentDiscountPercent, "% promo on special price"] })) : null] }), _jsx(UserTd, { children: _jsxs("span", { className: "inline-flex items-center gap-1 text-ink-soft", children: [_jsx(CreditCard, { className: "h-3.5 w-3.5" }), t.method] }) }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: statusTone(t.status), children: t.status }) }), _jsx(UserTd, { className: "text-right font-bold text-ink", children: formatMoney(t.amount) }), _jsx(UserTd, { className: "text-right", children: _jsxs("div", { className: "flex flex-col items-end gap-1", children: [_jsx(Link, { to: `/transactions/${t.id}`, className: "text-xs font-semibold text-teal hover:underline", children: "Details \u2192" }), _jsx(Link, { to: `/transactions/${t.id}/invoice`, className: "text-[11px] text-ink-soft hover:text-teal", children: "Invoice" })] }) })] }, t.id)))) })] }) }), _jsx(UserPagination, { page: data?.page ?? 1, pages: data?.pages ?? 1, onPage: setPage })] })] }));
}
