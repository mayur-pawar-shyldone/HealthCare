import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { UserBadge, UserPage, UserPageHeader, UserTable, UserTd, UserTh, UserTHead, UserTr, } from '@/components/user/UserUi';
export function NotificationsPage() {
    const qc = useQueryClient();
    const q = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => unwrap((await api.get('/notifications')).data),
    });
    const readOne = useMutation({
        mutationFn: (id) => api.patch(`/notifications/${id}/read`),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['notifications'] });
            void qc.invalidateQueries({ queryKey: ['notifications-unread'] });
        },
    });
    const readAll = useMutation({
        mutationFn: () => api.patch('/notifications/read-all'),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['notifications'] });
            void qc.invalidateQueries({ queryKey: ['notifications-unread'] });
        },
    });
    if (q.isLoading)
        return _jsx(Loading, { label: "Loading notifications" });
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "Notifications", subtitle: "Appointment and report alerts", actions: q.data?.length ? (_jsx(Button, { variant: "secondary", className: "rounded-xl", onClick: () => readAll.mutate(), children: "Mark all read" })) : null }), !q.data?.length ? (_jsx(EmptyState, { title: "You're all caught up", body: "Appointment and report alerts will appear here." })) : (_jsx(UserTable, { children: _jsxs("table", { className: "w-full min-w-[720px] text-left text-sm", children: [_jsxs(UserTHead, { children: [_jsx(UserTh, { children: "Type" }), _jsx(UserTh, { children: "Title" }), _jsx(UserTh, { children: "Message" }), _jsx(UserTh, { children: "Status" })] }), _jsx("tbody", { children: q.data.map((n) => (_jsxs(UserTr, { className: n.isRead ? undefined : 'bg-teal-light/20', children: [_jsx(UserTd, { children: _jsx(UserBadge, { tone: "teal", children: n.type.replaceAll('_', ' ') }) }), _jsx(UserTd, { children: _jsx("button", { type: "button", className: "text-left font-semibold text-ink hover:text-teal", onClick: () => readOne.mutate(n.id), children: n.title }) }), _jsx(UserTd, { className: "max-w-[280px] text-ink-soft", children: _jsx("p", { className: "line-clamp-2", children: n.body }) }), _jsx(UserTd, { children: _jsx(UserBadge, { tone: n.isRead ? 'default' : 'success', children: n.isRead ? 'Read' : 'New' }) })] }, n.id))) })] }) }))] }));
}
