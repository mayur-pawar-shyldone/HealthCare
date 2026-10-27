import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, CreditCard, FileText, Hash, User } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { formatDate, formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { PaymentBreakdown, PaymentBreakdownSummary } from '@/components/payments/PaymentBreakdown';
import { UserBadge, UserPage, UserPageHeader, UserPanel } from '@/components/user/UserUi';
export function TransactionDetailPage() {
    const { id } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['payment-transaction', id],
        enabled: Boolean(id),
        queryFn: async () => unwrap((await api.get(`/payments/transactions/${id}`)).data),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading payment details" });
    if (isError || !data) {
        return (_jsxs(UserPage, { children: [_jsx("p", { className: "text-sm text-ink-soft", children: "Payment not found." }), _jsx(Link, { to: "/transactions", className: "mt-4 inline-block text-teal hover:underline", children: "\u2190 Back to payments" })] }));
    }
    const appt = data.appointment;
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "Payment receipt", subtitle: `${data.bookingCode} · ${data.testName}`, actions: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Link, { to: `/transactions/${id}/invoice`, children: _jsxs(Button, { className: "rounded-xl", children: [_jsx(FileText, { className: "mr-2 h-4 w-4" }), "View invoice"] }) }), _jsx(Link, { to: "/transactions", children: _jsxs(Button, { variant: "secondary", className: "rounded-xl", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "All payments"] }) })] }) }), data.breakdown ? _jsx(PaymentBreakdownSummary, { breakdown: data.breakdown }) : null, _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(UserPanel, { title: "Transaction", children: _jsxs("dl", { className: "space-y-4 text-sm", children: [data.invoiceNumber ? (_jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-ink-soft", children: "Invoice no." }), _jsx("dd", { className: "font-mono text-xs font-semibold text-ink", children: data.invoiceNumber })] })) : null, _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-ink-soft", children: "Transaction ID" }), _jsxs("dd", { className: "font-mono text-xs text-ink", children: [data.id.slice(0, 12), "\u2026"] })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-ink-soft", children: "Status" }), _jsx("dd", { children: _jsx(UserBadge, { tone: data.status === 'PAID' ? 'success' : data.status === 'PENDING' ? 'warn' : 'default', children: data.status }) })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsxs("dt", { className: "flex items-center gap-1.5 text-ink-soft", children: [_jsx(CreditCard, { className: "h-3.5 w-3.5" }), " Method"] }), _jsx("dd", { className: "font-semibold text-ink", children: data.method })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-ink-soft", children: "Amount" }), _jsx("dd", { className: "font-display text-xl text-ink", children: formatMoney(data.amount) })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-ink-soft", children: "Recorded" }), _jsx("dd", { className: "text-ink", children: new Date(data.createdAt).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }) })] })] }) }), appt ? (_jsx(UserPanel, { title: "Booking", children: _jsxs("dl", { className: "space-y-4 text-sm", children: [_jsxs("div", { className: "flex justify-between gap-4", children: [_jsxs("dt", { className: "flex items-center gap-1.5 text-ink-soft", children: [_jsx(Hash, { className: "h-3.5 w-3.5" }), " Code"] }), _jsx("dd", { className: "font-mono font-semibold text-ink", children: appt.code })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsxs("dt", { className: "flex items-center gap-1.5 text-ink-soft", children: [_jsx(CalendarDays, { className: "h-3.5 w-3.5" }), " Schedule"] }), _jsxs("dd", { className: "text-ink", children: [formatDate(appt.date), appt.timeSlot ? ` · ${appt.timeSlot}` : ''] })] }), appt.patientName ? (_jsxs("div", { className: "flex justify-between gap-4", children: [_jsxs("dt", { className: "flex items-center gap-1.5 text-ink-soft", children: [_jsx(User, { className: "h-3.5 w-3.5" }), " Patient"] }), _jsx("dd", { className: "text-ink", children: appt.patientName })] })) : null, _jsx("div", { className: "pt-2", children: _jsx(Link, { to: `/appointments/${appt.id}`, className: "text-sm font-semibold text-teal hover:underline", children: "View booking \u2192" }) })] }) })) : null] }), data.breakdown ? _jsx(PaymentBreakdown, { breakdown: data.breakdown }) : null] }));
}
