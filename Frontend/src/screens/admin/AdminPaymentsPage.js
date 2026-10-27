import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { AdminPage, AdminPageHeader, AdminPagination, AdminSearch, AdminSelect, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, AdminToolbar, Badge, EmptyRow, StatCard, } from '@/components/admin/AdminUi';
function statusTone(status) {
    if (status === 'PAID')
        return 'success';
    if (status === 'PENDING')
        return 'warn';
    if (status === 'FAILED')
        return 'danger';
    return 'default';
}
export function AdminPaymentsPage() {
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [method, setMethod] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ['admin-payments', q, status, method, page],
        queryFn: async () => unwrap((await api.get('/admin/payments', {
            params: {
                q: q || undefined,
                status: status || undefined,
                method: method || undefined,
                page,
                limit: 25,
            },
        })).data),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading payments" });
    const paidStat = data?.stats?.find((s) => s.status === 'PAID');
    const pendingStat = data?.stats?.find((s) => s.status === 'PENDING');
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Payments ledger", subtitle: "All booking payments, promo discounts, and settlement status" }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatCard, { label: "Total transactions", value: data?.total ?? 0 }), _jsx(StatCard, { label: "Paid volume", value: formatMoney(paidStat?.amount ?? 0), hint: `${paidStat?.count ?? 0} paid`, tone: "accent" }), _jsx(StatCard, { label: "Pending / COD", value: pendingStat?.count ?? 0, hint: formatMoney(pendingStat?.amount ?? 0), tone: "warn" }), _jsx(StatCard, { label: "Failed / refunded", value: (data?.stats?.find((s) => s.status === 'FAILED')?.count ?? 0) + (data?.stats?.find((s) => s.status === 'REFUNDED')?.count ?? 0) })] }), _jsxs(AdminToolbar, { children: [_jsx(AdminSearch, { value: q, onChange: setQ, placeholder: "Search booking, test, customer\u2026" }), _jsxs(AdminSelect, { value: status, onChange: (v) => { setStatus(v); setPage(1); }, children: [_jsx("option", { value: "", children: "All statuses" }), ['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map((s) => (_jsx("option", { value: s, children: s }, s)))] }), _jsxs(AdminSelect, { value: method, onChange: (v) => { setMethod(v); setPage(1); }, children: [_jsx("option", { value: "", children: "All methods" }), ['UPI', 'CARD', 'COD', 'WALLET'].map((m) => (_jsx("option", { value: m, children: m }, m)))] })] }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[1100px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Date" }), _jsx(AdminTh, { children: "Booking" }), _jsx(AdminTh, { children: "Customer" }), _jsx(AdminTh, { children: "Test" }), _jsx(AdminTh, { children: "Method" }), _jsx(AdminTh, { children: "Status" }), _jsx(AdminTh, { children: "Amount" }), _jsx(AdminTh, { children: "Promo" }), _jsx(AdminTh, { children: " " })] }), _jsx("tbody", { children: !data?.items.length ? (_jsx(EmptyRow, { colSpan: 9, message: "No payment transactions" })) : (data.items.map((t) => (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "whitespace-nowrap text-xs text-ink-soft", children: new Date(t.createdAt).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }) }), _jsx(AdminTd, { className: "font-mono text-xs", children: t.bookingCode }), _jsxs(AdminTd, { children: [_jsx("p", { className: "font-semibold", children: t.user?.fullName ?? '—' }), _jsx("p", { className: "text-xs text-ink-soft", children: t.user?.mobile ?? t.user?.email })] }), _jsx(AdminTd, { children: t.testName }), _jsx(AdminTd, { children: t.method }), _jsx(AdminTd, { children: _jsx(Badge, { tone: statusTone(t.status), children: t.status }) }), _jsx(AdminTd, { className: "font-semibold", children: formatMoney(t.amount) }), _jsx(AdminTd, { className: "text-xs text-[#e03a28]", children: t.breakdown?.paymentDiscountPercent
                                            ? `${t.breakdown.paymentDiscountPercent}% (−${formatMoney(t.breakdown.paymentDiscountAmount)})`
                                            : '—' }), _jsx(AdminTd, { children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(Link, { to: `/admin/payments/${t.id}`, className: "text-xs font-semibold text-teal hover:underline", children: "Details \u2192" }), _jsx(Link, { to: `/admin/payments/${t.id}/invoice`, className: "text-[11px] text-ink-soft hover:text-teal", children: "Invoice" })] }) })] }, t.id)))) })] }) }), _jsx(AdminPagination, { page: data?.page ?? 1, pages: data?.pages ?? 1, onPage: setPage })] }));
}
