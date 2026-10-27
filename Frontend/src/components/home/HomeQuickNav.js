import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, FlaskConical, UserRound } from 'lucide-react';
const items = [
    { to: '/tests', label: 'Tests', icon: FlaskConical, bg: 'bg-teal-light', color: 'text-teal' },
    { to: '/appointments', label: 'Bookings', icon: CalendarDays, bg: 'bg-red-50', color: 'text-[#e03a28]' },
    { to: '/history', label: 'Reports', icon: FileText, bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { to: '/profile', label: 'Profile', icon: UserRound, bg: 'bg-emerald-50', color: 'text-emerald-600' },
];
export function HomeQuickNav() {
    return (_jsx("nav", { "aria-label": "Quick navigation", className: "grid grid-cols-4 gap-2 sm:gap-3", children: items.map((item) => {
            const Icon = item.icon;
            return (_jsxs(Link, { to: item.to, className: "flex flex-col items-center gap-2.5 rounded-2xl border border-line/70 bg-white px-2 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-teal/25 hover:shadow-md", children: [_jsx("span", { className: `grid h-11 w-11 place-items-center rounded-xl ${item.bg} ${item.color}`, children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx("span", { className: "text-xs font-semibold text-ink", children: item.label })] }, item.to));
        }) }));
}
