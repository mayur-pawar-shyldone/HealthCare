import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api, { unwrap } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { AdminPage, AdminPageHeader, AdminPagination, AdminSearch, AdminSelect, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, AdminToolbar, Badge, EmptyRow, } from '@/components/admin/AdminUi';
export function AdminCustomersPage() {
    const qc = useQueryClient();
    const actor = useSelector((s) => s.auth.user);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['admin-users', q, page, roleFilter],
        queryFn: async () => unwrap((await api.get('/admin/users', { params: { q: q || undefined, page, role: roleFilter || undefined } })).data),
    });
    const toggle = useMutation({
        mutationFn: ({ id, isActive }) => api.patch(`/admin/users/${id}/active`, { isActive }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
    });
    const setRole = useMutation({
        mutationFn: ({ id, role }) => api.patch(`/admin/users/${id}`, { role }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading customers" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Customers", subtitle: `${data?.total ?? 0} registered users` }), _jsxs(AdminToolbar, { children: [_jsx(AdminSearch, { value: q, onChange: (v) => { setQ(v); setPage(1); }, placeholder: "Search name, email, mobile\u2026" }), _jsxs(AdminSelect, { value: roleFilter, onChange: (v) => { setRoleFilter(v); setPage(1); }, children: [_jsx("option", { value: "", children: "All roles" }), _jsx("option", { value: "USER", children: "Customers" }), _jsx("option", { value: "ADMIN", children: "Admin" }), _jsx("option", { value: "SUPER_ADMIN", children: "Super Admin" })] })] }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[800px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Customer" }), _jsx(AdminTh, { children: "Mobile" }), _jsx(AdminTh, { children: "Role" }), _jsx(AdminTh, { children: "Bookings" }), _jsx(AdminTh, { children: "Joined" }), _jsx(AdminTh, { children: "Status" }), _jsx(AdminTh, { className: "text-right", children: "Actions" })] }), _jsx("tbody", { children: !data?.items.length ? (_jsx(EmptyRow, { colSpan: 7, message: "No customers found" })) : (data.items.map((u) => (_jsxs(AdminTr, { children: [_jsxs(AdminTd, { children: [_jsx(Link, { to: `/admin/customers/${u.id}`, className: "font-semibold text-teal hover:underline", children: u.fullName }), _jsx("p", { className: "text-xs text-ink-soft", children: u.email })] }), _jsx(AdminTd, { children: u.mobile }), _jsx(AdminTd, { children: actor?.role === 'SUPER_ADMIN' && u.role !== 'SUPER_ADMIN' ? (_jsxs(AdminSelect, { value: u.role, onChange: (role) => setRole.mutate({ id: u.id, role }), className: "text-xs py-1.5", children: [_jsx("option", { value: "USER", children: "USER" }), _jsx("option", { value: "ADMIN", children: "ADMIN" }), _jsx("option", { value: "SUPER_ADMIN", children: "SUPER_ADMIN" })] })) : (_jsx(Badge, { tone: u.role === 'USER' ? 'default' : 'teal', children: u.role.replace('_', ' ') })) }), _jsx(AdminTd, { children: u._count.appointments }), _jsx(AdminTd, { className: "text-ink-soft", children: formatDate(u.createdAt) }), _jsx(AdminTd, { children: _jsx(Badge, { tone: u.isActive ? 'success' : 'danger', children: u.isActive ? 'Active' : 'Inactive' }) }), _jsx(AdminTd, { className: "text-right", children: _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", disabled: u.id === actor?.id, onClick: () => toggle.mutate({ id: u.id, isActive: !u.isActive }), children: u.isActive ? 'Deactivate' : 'Activate' }) })] }, u.id)))) })] }) }), data ? _jsx(AdminPagination, { page: page, pages: data.pages, onPage: setPage }) : null] }));
}
