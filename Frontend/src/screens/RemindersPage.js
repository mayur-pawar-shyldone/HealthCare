import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { UserPage, UserPageHeader, UserPanel, UserTable, UserTd, UserTh, UserTHead, UserTr, } from '@/components/user/UserUi';
export function RemindersPage() {
    const qc = useQueryClient();
    const [label, setLabel] = useState('');
    const [remindAt, setRemindAt] = useState('');
    const q = useQuery({
        queryKey: ['reminders'],
        queryFn: async () => unwrap((await api.get('/reminders')).data),
    });
    const create = useMutation({
        mutationFn: async () => api.post('/reminders', { label, remindAt }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['reminders'] });
            setLabel('');
            setRemindAt('');
        },
    });
    const remove = useMutation({
        mutationFn: async (id) => api.delete(`/reminders/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
    });
    if (q.isLoading)
        return _jsx(Loading, { label: "Loading reminders" });
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "Test reminders", subtitle: "Get reminded before your tests \u2014 in-app and on WhatsApp" }), _jsxs(UserPanel, { title: "Set a reminder", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsx(Input, { label: "Reminder label", placeholder: "Annual health checkup", value: label, onChange: (e) => setLabel(e.target.value) }), _jsx(Input, { label: "Remind me on", type: "datetime-local", value: remindAt, onChange: (e) => setRemindAt(e.target.value) })] }), _jsx(Button, { className: "mt-4 rounded-xl", disabled: !label || !remindAt || create.isPending, onClick: () => create.mutate(), children: "Add reminder" })] }), !q.data?.length ? (_jsx(EmptyState, { title: "No reminders yet", body: "Bookings automatically create reminders. You can add custom ones too." })) : (_jsx(UserTable, { children: _jsxs("table", { className: "w-full min-w-[640px] text-left text-sm", children: [_jsxs(UserTHead, { children: [_jsx(UserTh, { children: "Label" }), _jsx(UserTh, { children: "Remind at" }), _jsx(UserTh, { children: "Linked test" }), _jsx(UserTh, { children: "Actions" })] }), _jsx("tbody", { children: q.data.map((r) => (_jsxs(UserTr, { children: [_jsx(UserTd, { className: "font-semibold", children: r.label }), _jsxs(UserTd, { className: "text-ink-soft", children: [formatDate(r.remindAt), " \u00B7", ' ', new Date(r.remindAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })] }), _jsx(UserTd, { className: "text-ink-soft", children: r.appointment?.test?.name ?? '—' }), _jsx(UserTd, { children: _jsx(Button, { variant: "ghost", size: "sm", className: "rounded-lg text-xs", onClick: () => remove.mutate(r.id), children: "Remove" }) })] }, r.id))) })] }) }))] }));
}
