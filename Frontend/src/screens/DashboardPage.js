import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api, { unwrap } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { AppointmentCard } from '@/components/ui/AppointmentCard';
import { Button } from '@/components/ui/Button';
export function DashboardPage() {
    const q = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => unwrap((await api.get('/dashboard')).data),
    });
    if (q.isLoading || !q.data)
        return _jsx(Loading, {});
    const { stats, recent } = q.data;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-end justify-between", children: [_jsx("h1", { className: "font-display text-4xl", children: "Dashboard" }), _jsx(Link, { to: "/appointments/book", children: _jsx(Button, { children: "Quick book" }) })] }), _jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [
                    ['Upcoming', stats.upcoming],
                    ['Completed', stats.completed],
                    ['Cancelled', stats.cancelled],
                    ['Membership', stats.membership],
                ].map(([l, v]) => (_jsxs(Card, { className: "p-5", children: [_jsx("p", { className: "text-sm text-ink-soft", children: l }), _jsx("p", { className: "mt-2 font-display text-3xl", children: v })] }, String(l)))) }), _jsx("h2", { className: "font-display text-2xl", children: "Recent history" }), _jsx("div", { className: "grid gap-4 md:grid-cols-2", children: recent.map((a) => _jsx(AppointmentCard, { appointment: a }, a.id)) })] }));
}
