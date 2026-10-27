import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CalendarCheck, FileText, Gift } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { mapAccountNotifications, unreadNotificationCount, } from '@/account/mp/account-mp-notifications';
const KIND_ICON = {
    report: FileText,
    visit: CalendarCheck,
    offer: Gift,
};
export function AccountMpNotifications() {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const qc = useQueryClient();
    const query = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => unwrap((await api.get('/notifications')).data),
    });
    const items = mapAccountNotifications(query.data ?? []);
    const unread = unreadNotificationCount(items);
    useEffect(() => {
        if (!open)
            return;
        const onDoc = (e) => {
            if (!rootRef.current?.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);
    function markAllRead() {
        void api.patch('/notifications/read-all').then(() => qc.invalidateQueries({ queryKey: ['notifications'] }));
    }
    function markRead(id) {
        void api.patch(`/notifications/${id}/read`).then(() => qc.invalidateQueries({ queryKey: ['notifications'] }));
    }
    return (_jsxs("div", { ref: rootRef, className: "relative", children: [_jsxs("button", { type: "button", "aria-expanded": open, "aria-haspopup": "true", "aria-label": unread ? `Notifications, ${unread} unread` : 'Notifications', onClick: () => setOpen((v) => !v), className: `relative grid h-11 w-11 place-items-center rounded-full transition-colors duration-150 ${open ? 'bg-navy text-white' : 'bg-mp-teal-50 text-mp-teal-700 hover:bg-[#d3ecea]'}`, children: [_jsx(Bell, { className: "h-5 w-5" }), unread > 0 ? (_jsx("span", { className: "absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-mp-coral px-1 text-[11px] font-bold text-white ring-2 ring-white", children: unread > 9 ? '9+' : unread })) : null] }), open ? (_jsxs("div", { className: "absolute right-0 z-[60] mt-2 w-[min(100vw-2rem,360px)] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_-24px_rgba(16,52,74,0.45)]", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-line px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[15px] font-bold text-navy", children: "Notifications" }), _jsx("p", { className: "text-[12px] text-muted", children: unread > 0 ? `${unread} unread` : 'You’re all caught up' })] }), unread > 0 ? (_jsx("button", { type: "button", onClick: markAllRead, className: "text-[12px] font-semibold text-mp-teal-700 hover:underline", children: "Mark all read" })) : null] }), _jsx("ul", { className: "max-h-[min(60vh,320px)] overflow-y-auto py-1", children: query.isLoading ? (_jsx("li", { className: "px-4 py-6 text-center text-[13px] text-muted", children: "Loading\u2026" })) : items.length ? (items.map((n) => {
                            const Icon = KIND_ICON[n.kind];
                            return (_jsx("li", { children: _jsxs("button", { type: "button", onClick: () => markRead(n.id), className: `flex w-full gap-3 px-4 py-3 text-left transition hover:bg-canvas ${n.unread ? 'bg-mp-teal-50/40' : ''}`, children: [_jsx("span", { className: `mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${n.unread ? 'bg-mp-teal text-white' : 'bg-mp-teal-50 text-mp-teal-700'}`, children: _jsx(Icon, { className: "h-4 w-4", "aria-hidden": true }) }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[13.5px] font-semibold text-navy", children: n.title }), n.unread ? (_jsx("span", { className: "h-2 w-2 shrink-0 rounded-full bg-mp-coral", "aria-label": "Unread" })) : null] }), _jsx("span", { className: "mt-0.5 block text-[12.5px] leading-snug text-muted", children: n.body }), _jsx("span", { className: "mt-1 block text-[11px] font-medium text-mp-teal-700", children: n.time })] })] }) }, n.id));
                        })) : (_jsx("li", { className: "px-4 py-6 text-center text-[13px] text-muted", children: "No notifications yet." })) }), _jsx("div", { className: "border-t border-line bg-canvas/50 px-4 py-2.5", children: _jsx(Link, { to: "/account/bookings", onClick: () => setOpen(false), className: "block text-center text-[13px] font-semibold text-mp-teal-700 hover:underline", children: "View bookings & reports" }) })] })) : null] }));
}
