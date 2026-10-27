import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { Badge } from './Badge';
const tones = {
    CONFIRMED: 'teal',
    RESCHEDULED: 'sand',
    COMPLETED: 'success',
    CANCELLED: 'danger',
    PENDING: 'sand',
};
export function AppointmentCard({ appointment }) {
    return (_jsx(Link, { to: `/appointments/${appointment.id}`, className: "block", children: _jsxs("article", { className: "glass-panel rounded-3xl p-5 transition hover:border-teal/30", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-ink-soft", children: appointment.code }), _jsx("h3", { className: "mt-1 font-display text-lg", children: appointment.test.name })] }), _jsx(Badge, { tone: tones[appointment.status] ?? 'ink', children: appointment.status })] }), _jsxs("div", { className: "mt-4 flex items-center gap-2 text-sm text-ink-soft", children: [_jsx(CalendarClock, { className: "h-4 w-4 text-teal" }), formatDate(appointment.date), " \u00B7 ", appointment.timeSlot] }), _jsx("p", { className: "mt-2 text-sm text-ink-soft", children: appointment.location })] }) }));
}
