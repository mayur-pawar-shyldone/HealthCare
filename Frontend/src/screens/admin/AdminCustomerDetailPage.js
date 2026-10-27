import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api, { unwrap } from '@/services/api';
import { formatDate, formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminPage, AdminPageHeader, AdminPanel, AdminSection, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, Badge, } from '@/components/admin/AdminUi';
import { useState } from 'react';
export function AdminCustomerDetailPage() {
    const { id } = useParams();
    const qc = useQueryClient();
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', mobile: '' });
    const { data, isLoading } = useQuery({
        queryKey: ['admin-user', id],
        enabled: !!id,
        queryFn: async () => {
            const u = unwrap((await api.get(`/admin/users/${id}`)).data);
            setForm({ fullName: u.fullName, email: u.email, mobile: u.mobile });
            return u;
        },
    });
    const save = useMutation({
        mutationFn: () => api.patch(`/admin/users/${id}`, form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-user', id] });
            qc.invalidateQueries({ queryKey: ['admin-users'] });
            setEdit(false);
        },
    });
    if (isLoading || !data)
        return _jsx(Loading, { label: "Loading customer" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: data.fullName, subtitle: data.email, actions: _jsx(Link, { to: "/admin/customers", children: _jsx(Button, { variant: "secondary", size: "sm", className: "rounded-xl", children: "\u2190 Back" }) }) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [_jsxs(AdminPanel, { title: "Profile", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx(Badge, { tone: data.isActive ? 'success' : 'danger', children: data.isActive ? 'Active' : 'Inactive' }), _jsx(Badge, { tone: "teal", children: data.role.replace('_', ' ') })] }), edit ? (_jsxs("div", { className: "space-y-3", children: [_jsx(Input, { label: "Full name", value: form.fullName, onChange: (e) => setForm({ ...form, fullName: e.target.value }) }), _jsx(Input, { label: "Email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) }), _jsx(Input, { label: "Mobile", value: form.mobile, onChange: (e) => setForm({ ...form, mobile: e.target.value }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", className: "rounded-xl", onClick: () => save.mutate(), children: "Save" }), _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", onClick: () => setEdit(false), children: "Cancel" })] })] })) : (_jsxs("dl", { className: "space-y-3 text-sm", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Mobile" }), _jsx("dd", { className: "mt-0.5 font-semibold", children: data.mobile })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Joined" }), _jsx("dd", { className: "mt-0.5", children: formatDate(data.createdAt) })] }), _jsx(Button, { size: "sm", variant: "secondary", className: "mt-2 rounded-xl", onClick: () => setEdit(true), children: "Edit profile" })] })), _jsxs("div", { className: "mt-6 border-t border-line/60 pt-5", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Addresses" }), _jsxs("ul", { className: "mt-3 space-y-2 text-sm", children: [data.addresses.map((a) => (_jsxs("li", { className: "rounded-xl bg-teal-light/40 p-3", children: [a.label ? _jsx("p", { className: "text-xs font-bold text-teal", children: a.label }) : null, a.line1, ", ", a.city, ", ", a.state, " \u2013 ", a.pincode] }, a.id))), !data.addresses.length ? _jsx("p", { className: "text-ink-soft", children: "No addresses" }) : null] })] }), _jsxs("div", { className: "mt-6 border-t border-line/60 pt-5", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Family members" }), _jsxs("ul", { className: "mt-3 space-y-1.5 text-sm", children: [data.familyMembers.map((f) => (_jsxs("li", { className: "rounded-lg bg-white/60 px-3 py-2", children: [f.name, " \u00B7 ", f.relation, f.age ? ` · ${f.age}y` : ''] }, f.id))), !data.familyMembers.length ? _jsx("p", { className: "text-ink-soft", children: "None added" }) : null] })] })] }), _jsxs("div", { className: "space-y-6 lg:col-span-2", children: [_jsx(AdminSection, { title: "Memberships", children: _jsx(AdminTable, { children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Card" }), _jsx(AdminTh, { children: "Plan" }), _jsx(AdminTh, { children: "Expires" }), _jsx(AdminTh, { children: "Status" })] }), _jsxs("tbody", { children: [data.memberships.map((m) => (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "font-mono text-xs", children: m.number }), _jsx(AdminTd, { children: m.plan.name }), _jsx(AdminTd, { children: formatDate(m.expiresAt) }), _jsx(AdminTd, { children: _jsx(Badge, { tone: m.isActive ? 'success' : 'default', children: m.isActive ? 'Active' : 'Expired' }) })] }, m.id))), !data.memberships.length ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-5 py-8 text-center text-sm text-ink-soft", children: "No memberships" }) })) : null] })] }) }) }), _jsx(AdminSection, { title: "Appointments", children: _jsx(AdminTable, { children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Code" }), _jsx(AdminTh, { children: "Test" }), _jsx(AdminTh, { children: "Date" }), _jsx(AdminTh, { children: "Amount" }), _jsx(AdminTh, { children: "Status" })] }), _jsxs("tbody", { children: [data.appointments.map((a) => (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "font-mono text-xs", children: a.code }), _jsx(AdminTd, { children: a.test.name }), _jsx(AdminTd, { children: formatDate(a.date) }), _jsx(AdminTd, { children: a.finalPrice != null ? formatMoney(Number(a.finalPrice)) : '—' }), _jsx(AdminTd, { children: _jsx(Badge, { tone: "teal", children: a.status }) })] }, a.id))), !data.appointments.length ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-5 py-8 text-center text-sm text-ink-soft", children: "No appointments" }) })) : null] })] }) }) })] })] })] }));
}
