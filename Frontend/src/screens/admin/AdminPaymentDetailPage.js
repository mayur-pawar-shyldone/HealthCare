import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileText } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { formatDate, formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { PaymentBreakdown, PaymentBreakdownSummary } from '@/components/payments/PaymentBreakdown';
import { AdminPage, AdminPageHeader, AdminPanel, AdminSelect, Badge, } from '@/components/admin/AdminUi';
export function AdminPaymentDetailPage() {
    const { id } = useParams();
    const qc = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-payment', id],
        enabled: Boolean(id),
        queryFn: async () => unwrap((await api.get(`/admin/payments/${id}`)).data),
    });
    const updateStatus = useMutation({
        mutationFn: (status) => api.patch(`/admin/payments/${id}/status`, { status }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-payment', id] });
            qc.invalidateQueries({ queryKey: ['admin-payments'] });
        },
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading payment" });
    if (isError || !data) {
        return (_jsxs(AdminPage, { children: [_jsx("p", { className: "text-sm text-ink-soft", children: "Payment not found." }), _jsx(Link, { to: "/admin/payments", className: "mt-4 inline-block text-teal hover:underline", children: "\u2190 Back to ledger" })] }));
    }
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Payment detail", subtitle: `${data.bookingCode} · ${data.testName}`, actions: _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Link, { to: `/admin/payments/${id}/invoice`, children: _jsxs(Button, { className: "rounded-xl", children: [_jsx(FileText, { className: "mr-2 h-4 w-4" }), "View invoice"] }) }), _jsx(Link, { to: "/admin/payments", children: _jsxs(Button, { variant: "secondary", className: "rounded-xl", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Ledger"] }) })] }) }), data.breakdown ? _jsx(PaymentBreakdownSummary, { breakdown: data.breakdown }) : null, _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs(AdminPanel, { title: "Transaction", children: [_jsxs("dl", { className: "space-y-3 text-sm", children: [data.invoiceNumber ? (_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Invoice no." }), _jsx("dd", { className: "font-mono text-xs font-semibold", children: data.invoiceNumber })] })) : null, _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Transaction ID" }), _jsx("dd", { className: "font-mono text-xs", children: data.id })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Status" }), _jsx("dd", { children: _jsx(Badge, { tone: data.status === 'PAID' ? 'success' : 'warn', children: data.status }) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Method" }), _jsx("dd", { className: "font-semibold", children: data.method })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Amount" }), _jsx("dd", { className: "font-display text-xl", children: formatMoney(data.amount) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Recorded" }), _jsx("dd", { children: new Date(data.createdAt).toLocaleString('en-IN') })] })] }), _jsxs("div", { className: "mt-6 border-t border-line/50 pt-4", children: [_jsx("p", { className: "mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Update settlement status" }), _jsx(AdminSelect, { value: data.status, onChange: (v) => updateStatus.mutate(v), className: "w-full", children: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map((s) => (_jsx("option", { value: s, children: s }, s))) }), _jsx("p", { className: "mt-2 text-xs text-ink-soft", children: "Syncs linked appointment payment status." })] })] }), _jsx(AdminPanel, { title: "Customer & booking", children: _jsxs("dl", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Customer" }), _jsx("dd", { className: "text-right font-semibold", children: data.user?.fullName })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Contact" }), _jsx("dd", { className: "text-right text-ink-soft", children: data.user?.mobile ?? data.user?.email })] }), data.appointment ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Booking code" }), _jsx("dd", { className: "font-mono", children: data.appointment.code })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Schedule" }), _jsxs("dd", { children: [formatDate(data.appointment.date), data.appointment.timeSlot ? ` · ${data.appointment.timeSlot}` : ''] })] }), data.appointment.patientName ? (_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-ink-soft", children: "Patient" }), _jsx("dd", { children: data.appointment.patientName })] })) : null, _jsx("div", { className: "pt-2", children: _jsx(Link, { to: `/admin/appointments`, className: "text-sm font-semibold text-teal hover:underline", children: "View in appointments \u2192" }) })] })) : null] }) })] }), data.breakdown ? _jsx(PaymentBreakdown, { breakdown: data.breakdown }) : null] }));
}
