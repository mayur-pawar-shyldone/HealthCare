import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { formatDate, formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { AdminPage, AdminPageHeader, AdminSearch, AdminSelect, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, AdminToolbar, Badge, EmptyRow, } from '@/components/admin/AdminUi';
const STATUSES = ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED'];
export function AdminAppointmentsPage() {
    const qc = useQueryClient();
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['admin-appts', q, status],
        queryFn: async () => unwrap((await api.get('/admin/appointments', { params: { q: q || undefined, status: status || undefined } })).data),
    });
    const setStatusMut = useMutation({
        mutationFn: ({ id, value }) => api.patch(`/admin/appointments/${id}/status`, { status: value }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-appts'] }),
    });
    const setPayment = useMutation({
        mutationFn: ({ id, paymentStatus }) => api.patch(`/admin/appointments/${id}/payment`, { paymentStatus }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-appts'] }),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading appointments" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Appointments", subtitle: "Manage bookings, status and payments" }), _jsxs(AdminToolbar, { children: [_jsx(AdminSearch, { value: q, onChange: setQ, placeholder: "Search code, patient, email\u2026" }), _jsxs(AdminSelect, { value: status, onChange: setStatus, children: [_jsx("option", { value: "", children: "All statuses" }), STATUSES.map((s) => _jsx("option", { value: s, children: s }, s))] })] }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[1000px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Code" }), _jsx(AdminTh, { children: "Customer" }), _jsx(AdminTh, { children: "Test / Patient" }), _jsx(AdminTh, { children: "Schedule" }), _jsx(AdminTh, { children: "Amount" }), _jsx(AdminTh, { children: "Status" }), _jsx(AdminTh, { children: "Payment" }), _jsx(AdminTh, { children: "Actions" })] }), _jsx("tbody", { children: !data?.length ? (_jsx(EmptyRow, { colSpan: 8, message: "No appointments" })) : (data.map((a) => (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "font-mono text-xs", children: a.code }), _jsxs(AdminTd, { children: [_jsx("p", { className: "font-semibold", children: a.user.fullName }), _jsx("p", { className: "text-xs text-ink-soft", children: a.user.mobile })] }), _jsxs(AdminTd, { children: [_jsx("p", { children: a.test.name }), _jsx("p", { className: "text-xs text-ink-soft", children: a.patientName })] }), _jsxs(AdminTd, { className: "text-ink-soft", children: [formatDate(a.date), " \u00B7 ", a.timeSlot] }), _jsx(AdminTd, { children: a.finalPrice != null ? formatMoney(Number(a.finalPrice)) : '—' }), _jsx(AdminTd, { children: _jsx(Badge, { tone: "teal", children: a.status }) }), _jsx(AdminTd, { children: _jsx(Badge, { tone: a.paymentStatus === 'PAID' ? 'success' : 'warn', children: a.paymentStatus }) }), _jsxs(AdminTd, { children: [_jsx(AdminSelect, { value: a.status, onChange: (value) => setStatusMut.mutate({ id: a.id, value }), className: "mb-1.5 w-full text-xs py-1.5", children: STATUSES.map((s) => _jsx("option", { value: s, children: s }, s)) }), _jsx(AdminSelect, { value: a.paymentStatus, onChange: (paymentStatus) => setPayment.mutate({ id: a.id, paymentStatus }), className: "w-full text-xs py-1.5", children: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map((s) => _jsx("option", { value: s, children: s }, s)) })] })] }, a.id)))) })] }) })] }));
}
