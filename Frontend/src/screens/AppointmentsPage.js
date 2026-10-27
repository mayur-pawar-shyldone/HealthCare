import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { unwrap } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate, formatMoney } from '@/lib/utils';
import { UserBadge, UserEmptyRow, UserPage, UserPageHeader, UserPanel, UserSearch, UserSelect, UserTable, UserTd, UserTh, UserTHead, UserToolbar, UserTr, } from '@/components/user/UserUi';
const STATUS_FILTERS = ['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
function statusTone(status) {
    if (status === 'COMPLETED')
        return 'success';
    if (status === 'CANCELLED')
        return 'danger';
    if (status === 'CONFIRMED')
        return 'teal';
    if (status === 'PENDING' || status === 'RESCHEDULED')
        return 'warn';
    return 'default';
}
function paymentTone(status) {
    if (status === 'PAID')
        return 'success';
    if (status === 'FAILED' || status === 'REFUNDED')
        return 'danger';
    if (status === 'PENDING')
        return 'warn';
    return 'default';
}
export function AppointmentsPage() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('ALL');
    const [query, setQuery] = useState('');
    const q = useQuery({
        queryKey: ['appointments', status],
        queryFn: async () => unwrap((await api.get('/appointments', { params: { status } })).data),
    });
    const filtered = useMemo(() => {
        const list = q.data ?? [];
        const qLower = query.trim().toLowerCase();
        if (!qLower)
            return list;
        return list.filter((a) => a.code.toLowerCase().includes(qLower) ||
            a.test.name.toLowerCase().includes(qLower) ||
            a.patientName.toLowerCase().includes(qLower) ||
            a.location.toLowerCase().includes(qLower));
    }, [q.data, query]);
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "Bookings", subtitle: "Track home collection appointments", actions: _jsx(Link, { to: "/appointments/book", children: _jsx(Button, { className: "rounded-xl", children: "Book test" }) }) }), _jsxs(UserToolbar, { children: [_jsx(UserSearch, { value: query, onChange: setQuery, placeholder: "Search code, test, patient\u2026" }), _jsx(UserSelect, { value: status, onChange: setStatus, children: STATUS_FILTERS.map((f) => (_jsx("option", { value: f, children: f === 'CONFIRMED' ? 'Upcoming' : f === 'ALL' ? 'All statuses' : f.charAt(0) + f.slice(1).toLowerCase() }, f))) })] }), q.isLoading ? (_jsx(Loading, { label: "Loading bookings" })) : !q.data?.length ? (_jsx(EmptyState, { title: "No appointments", body: "Book a laboratory test to see it here.", action: { label: 'Book a test', onClick: () => navigate('/appointments/book') } })) : (_jsx(UserTable, { children: _jsxs("table", { className: "w-full min-w-[920px] text-left text-sm", children: [_jsxs(UserTHead, { children: [_jsx(UserTh, { children: "Code" }), _jsx(UserTh, { children: "Test / Patient" }), _jsx(UserTh, { children: "Schedule" }), _jsx(UserTh, { children: "Location" }), _jsx(UserTh, { children: "Amount" }), _jsx(UserTh, { children: "Status" }), _jsx(UserTh, { children: "Payment" }), _jsx(UserTh, { children: "Actions" })] }), _jsx("tbody", { children: !filtered.length ? (_jsx(UserEmptyRow, { colSpan: 8, message: "No bookings match your search" })) : (filtered.map((a) => (_jsxs(UserTr, { children: [_jsx(UserTd, { className: "font-mono text-xs", children: a.code }), _jsxs(UserTd, { children: [_jsx("p", { className: "font-semibold", children: a.test.name }), _jsx("p", { className: "text-xs text-ink-soft", children: a.patientName })] }), _jsxs(UserTd, { className: "text-ink-soft", children: [formatDate(a.date), " \u00B7 ", a.timeSlot] }), _jsx(UserTd, { className: "max-w-[140px] text-xs text-ink-soft", children: _jsx("span", { className: "block truncate", title: a.location, children: a.location }) }), _jsx(UserTd, { children: a.finalPrice != null ? formatMoney(Number(a.finalPrice)) : '—' }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: statusTone(a.status), children: a.status }) }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: paymentTone(a.paymentStatus), children: a.paymentStatus ?? 'PENDING' }) }), _jsx(UserTd, { children: _jsx(Link, { to: `/appointments/${a.id}`, children: _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-lg text-xs", children: "View" }) }) })] }, a.id)))) })] }) }))] }));
}
export function AppointmentDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('08:00 AM');
    const [initialized, setInitialized] = useState(false);
    const q = useQuery({
        queryKey: ['appointment', id],
        queryFn: async () => unwrap((await api.get(`/appointments/${id}`)).data),
    });
    useEffect(() => {
        if (!q.data || initialized)
            return;
        setDate(q.data.date.slice(0, 10));
        setTimeSlot(q.data.timeSlot);
        setInitialized(true);
    }, [q.data, initialized]);
    const cancel = useMutation({
        mutationFn: async () => api.delete(`/appointments/${id}`),
        onSuccess: () => {
            qc.invalidateQueries();
            navigate('/appointments');
        },
    });
    const slotsQuery = useQuery({
        queryKey: ['slots', date],
        enabled: Boolean(date),
        queryFn: async () => unwrap((await api.get('/appointments/slots', { params: { date } })).data),
    });
    const reschedule = useMutation({
        mutationFn: async () => api.patch(`/appointments/${id}`, { date, timeSlot }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['appointment', id] }),
    });
    if (q.isLoading || !q.data)
        return _jsx(Loading, { label: "Loading booking" });
    const a = q.data;
    return (_jsxs(UserPage, { className: "max-w-3xl", children: [_jsx(UserPageHeader, { title: a.test.name, subtitle: `${a.code} · ${formatDate(a.date)} · ${a.timeSlot}`, actions: _jsx(Link, { to: "/appointments", children: _jsx(Button, { variant: "secondary", size: "sm", className: "rounded-xl", children: "\u2190 Back" }) }) }), _jsx(UserTable, { children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsxs(UserTHead, { children: [_jsx(UserTh, { children: "Field" }), _jsx(UserTh, { children: "Details" })] }), _jsxs("tbody", { children: [_jsxs(UserTr, { children: [_jsx(UserTd, { className: "text-ink-soft", children: "Booking code" }), _jsx(UserTd, { className: "font-mono text-xs", children: a.code })] }), _jsxs(UserTr, { children: [_jsx(UserTd, { className: "text-ink-soft", children: "Patient" }), _jsx(UserTd, { className: "font-semibold", children: a.patientName })] }), _jsxs(UserTr, { children: [_jsx(UserTd, { className: "text-ink-soft", children: "Location" }), _jsx(UserTd, { children: a.location })] }), _jsxs(UserTr, { children: [_jsx(UserTd, { className: "text-ink-soft", children: "Status" }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: statusTone(a.status), children: a.status }) })] }), _jsxs(UserTr, { children: [_jsx(UserTd, { className: "text-ink-soft", children: "Payment" }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: paymentTone(a.paymentStatus), children: a.paymentStatus ?? 'PENDING' }) })] }), _jsxs(UserTr, { children: [_jsx(UserTd, { className: "text-ink-soft", children: "Amount paid" }), _jsx(UserTd, { children: a.finalPrice != null ? formatMoney(Number(a.finalPrice)) : '—' })] })] })] }) }), a.status !== 'CANCELLED' && a.status !== 'COMPLETED' ? (_jsxs(UserPanel, { title: "Reschedule or cancel", children: [_jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsx(Input, { type: "date", label: "New date", value: date, onChange: (e) => setDate(e.target.value) }), _jsxs("div", { children: [_jsx("label", { className: "mb-1.5 block text-sm font-medium text-ink", children: "Time slot" }), _jsx(UserSelect, { value: timeSlot, onChange: setTimeSlot, className: "w-full", children: (slotsQuery.data?.slots ?? [timeSlot]).map((slot) => (_jsx("option", { value: slot, children: slot }, slot))) })] })] }), _jsxs("div", { className: "mt-4 flex gap-3", children: [_jsx(Button, { variant: "secondary", className: "rounded-xl", disabled: !date || reschedule.isPending, onClick: () => reschedule.mutate(), children: "Reschedule" }), _jsx(Button, { variant: "danger", className: "rounded-xl", disabled: cancel.isPending, onClick: () => cancel.mutate(), children: "Cancel booking" })] })] })) : null] }));
}
