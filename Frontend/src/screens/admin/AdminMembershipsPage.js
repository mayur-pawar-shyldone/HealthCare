import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { AdminPage, AdminPageHeader, AdminPanel, AdminSelect, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, Badge, } from '@/components/admin/AdminUi';
export function AdminMembershipsPage() {
    const qc = useQueryClient();
    const [userId, setUserId] = useState('');
    const [planId, setPlanId] = useState('');
    const memberships = useQuery({
        queryKey: ['admin-memberships'],
        queryFn: async () => unwrap((await api.get('/admin/memberships')).data),
    });
    const plans = useQuery({
        queryKey: ['admin-plans'],
        queryFn: async () => unwrap((await api.get('/admin/membership-plans')).data),
    });
    const users = useQuery({
        queryKey: ['admin-users-options'],
        queryFn: async () => unwrap((await api.get('/admin/users', { params: { role: 'USER', limit: 100 } })).data),
    });
    const grant = useMutation({
        mutationFn: () => api.post('/admin/memberships/grant', { userId, planId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-memberships'] });
            setUserId('');
        },
    });
    if (memberships.isLoading)
        return _jsx(Loading, { label: "Loading memberships" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Memberships", subtitle: "HealthID Card activations and family coverage" }), _jsxs(AdminPanel, { title: "Grant membership", subtitle: "Activate a HealthID Card for a customer", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs(AdminSelect, { label: "Customer", value: userId, onChange: setUserId, children: [_jsx("option", { value: "", children: "Select customer\u2026" }), (users.data?.items ?? []).map((u) => (_jsxs("option", { value: u.id, children: [u.fullName, " \u00B7 ", u.email] }, u.id)))] }), _jsxs(AdminSelect, { label: "Plan", value: planId, onChange: setPlanId, children: [_jsx("option", { value: "", children: "Select plan\u2026" }), (plans.data ?? []).map((p) => (_jsxs("option", { value: p.id, children: [p.name, " (", p.durationDays, " days)"] }, p.id)))] })] }), _jsx(Button, { size: "sm", className: "mt-4 rounded-xl", disabled: !userId || !planId, onClick: () => grant.mutate(), children: "Grant card" })] }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[800px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Card #" }), _jsx(AdminTh, { children: "Customer" }), _jsx(AdminTh, { children: "Plan" }), _jsx(AdminTh, { children: "Family" }), _jsx(AdminTh, { children: "Valid until" }), _jsx(AdminTh, { children: "Status" })] }), _jsx("tbody", { children: (memberships.data ?? []).map((m) => (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "font-mono text-xs", children: m.number }), _jsxs(AdminTd, { children: [_jsx("p", { className: "font-semibold", children: m.user.fullName }), _jsx("p", { className: "text-xs text-ink-soft", children: m.user.email })] }), _jsx(AdminTd, { children: m.plan.name }), _jsx(AdminTd, { className: "text-xs", children: m.members.map((x) => x.name).join(', ') }), _jsx(AdminTd, { children: formatDate(m.expiresAt) }), _jsx(AdminTd, { children: _jsx(Badge, { tone: m.isActive && new Date(m.expiresAt) > new Date() ? 'success' : 'default', children: m.isActive ? 'Active' : 'Inactive' }) })] }, m.id))) })] }) })] }));
}
