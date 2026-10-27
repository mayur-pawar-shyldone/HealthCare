import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, FileText, FlaskConical, HelpCircle, UserPlus, } from 'lucide-react';
import { PLATFORM } from '@/data/platform-content';
import { cn } from '@/lib/utils';
function QuickActionRow({ label, sub, icon: Icon, onClick, to, primary }) {
    const inner = (_jsxs(_Fragment, { children: [_jsx("span", { className: cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', primary ? 'bg-teal text-white' : 'bg-teal-light/80 text-teal'), children: _jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 2 }) }), _jsxs("span", { className: "min-w-0 flex-1 text-left", children: [_jsx("span", { className: "block dash-body", children: _jsx("strong", { children: label }) }), _jsx("span", { className: "block dash-muted", children: sub })] }), _jsx(ChevronRight, { className: "h-4 w-4 shrink-0 opacity-40", "aria-hidden": true })] }));
    const className = 'flex h-full min-h-[68px] w-full items-center gap-3 rounded-2xl border border-line/60 bg-white p-3.5 text-left transition hover:border-teal/35';
    if (to) {
        return (_jsx(Link, { to: to, className: className, children: inner }));
    }
    return (_jsx("button", { type: "button", className: className, onClick: onClick, children: inner }));
}
export function AccountQuickActions({ onAddFamily }) {
    const items = [
        {
            label: 'Book a test',
            sub: `${PLATFORM.testCount}+ tests & packages`,
            icon: FlaskConical,
            to: '/account/catalogue',
            primary: true,
        },
        { label: 'My bookings', sub: 'Track collections', icon: CalendarDays, to: '/account/bookings' },
        { label: 'Reports & records', sub: 'Download PDFs', icon: FileText, to: '/account/reports' },
        { label: 'Add family member', sub: 'Up to 5 on one card', icon: UserPlus, onClick: onAddFamily },
        { label: 'Help & support', sub: '1800-123-4567', icon: HelpCircle, to: '/account/support' },
    ];
    return (_jsxs("section", { className: "dash-panel dash-panel-lg", "aria-labelledby": "account-quick-actions", children: [_jsx("p", { id: "account-quick-actions", className: "dash-section-eyebrow", children: "Quick actions" }), _jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-2", children: items.map((item) => (_jsx(QuickActionRow, { ...item }, item.label))) })] }));
}
