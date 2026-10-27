import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminPage, AdminPageHeader, AdminPanel, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, Badge, } from '@/components/admin/AdminUi';
export function AdminCategoriesPage() {
    const qc = useQueryClient();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: async () => unwrap((await api.get('/admin/categories')).data),
    });
    const create = useMutation({
        mutationFn: () => api.post('/admin/categories', { name, description }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-categories'] });
            setName('');
            setDescription('');
        },
    });
    const toggle = useMutation({
        mutationFn: ({ id, isActive }) => api.patch(`/admin/categories/${id}`, { isActive }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
    });
    if (isLoading)
        return _jsx(Loading, { label: "Loading categories" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Categories", subtitle: "Organize tests by clinical area" }), _jsxs(AdminPanel, { title: "Add category", subtitle: "Create a new test grouping", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsx(Input, { label: "Name", value: name, onChange: (e) => setName(e.target.value) }), _jsx(Input, { label: "Description", value: description, onChange: (e) => setDescription(e.target.value) })] }), _jsx(Button, { size: "sm", className: "mt-4 rounded-xl", disabled: !name.trim(), onClick: () => create.mutate(), children: "Create" })] }), _jsx(AdminTable, { children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Name" }), _jsx(AdminTh, { children: "Tests" }), _jsx(AdminTh, { children: "Status" }), _jsx(AdminTh, { className: "text-right", children: "Actions" })] }), _jsx("tbody", { children: (data ?? []).map((c) => (_jsxs(AdminTr, { children: [_jsxs(AdminTd, { children: [_jsx("p", { className: "font-semibold", children: c.name }), c.description ? _jsx("p", { className: "text-xs text-ink-soft", children: c.description }) : null] }), _jsx(AdminTd, { children: c._count.tests }), _jsx(AdminTd, { children: _jsx(Badge, { tone: c.isActive ? 'success' : 'danger', children: c.isActive ? 'Active' : 'Off' }) }), _jsx(AdminTd, { className: "text-right", children: _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", onClick: () => toggle.mutate({ id: c.id, isActive: !c.isActive }), children: c.isActive ? 'Disable' : 'Enable' }) })] }, c.id))) })] }) })] }));
}
