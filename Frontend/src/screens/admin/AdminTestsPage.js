import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { formatMoney } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminPage, AdminPageHeader, AdminPanel, AdminSearch, AdminSelect, AdminTHead, AdminTh, AdminTr, AdminTd, AdminTable, AdminToolbar, Badge, EmptyRow, } from '@/components/admin/AdminUi';
function specialPrice(mrp, discount) {
    return Math.round(mrp * (1 - discount / 100));
}
export function AdminTestsPage() {
    const qc = useQueryClient();
    const [q, setQ] = useState('');
    const [editing, setEditing] = useState(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({
        name: '',
        categoryId: '',
        shortDescription: '',
        description: '',
        preparation: 'Standard preparation.',
        sampleType: 'Blood',
        price: 0,
        specialPrice: 0,
        isPopular: false,
        isActive: true,
    });
    const tests = useQuery({
        queryKey: ['admin-tests', q],
        queryFn: async () => unwrap((await api.get('/admin/tests', { params: { q: q || undefined } })).data),
    });
    const categories = useQuery({
        queryKey: ['admin-categories'],
        queryFn: async () => unwrap((await api.get('/admin/categories')).data),
    });
    const save = useMutation({
        mutationFn: async () => {
            const payload = { ...form, description: form.description || form.shortDescription };
            if (editing)
                return api.patch(`/admin/tests/${editing.id}`, payload);
            return api.post('/admin/tests', payload);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-tests'] });
            setEditing(null);
            setCreating(false);
        },
    });
    const toggleActive = useMutation({
        mutationFn: ({ id, isActive }) => api.patch(`/admin/tests/${id}`, { isActive }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-tests'] }),
    });
    const filtered = useMemo(() => tests.data ?? [], [tests.data]);
    function openEdit(t) {
        setEditing(t);
        setCreating(false);
        setForm({
            name: t.name,
            categoryId: t.category.id,
            shortDescription: t.name,
            description: t.name,
            preparation: 'Standard preparation.',
            sampleType: 'Blood',
            price: Number(t.price),
            specialPrice: specialPrice(Number(t.price), Number(t.discountPercent)),
            isPopular: t.isPopular,
            isActive: t.isActive,
        });
    }
    if (tests.isLoading)
        return _jsx(Loading, { label: "Loading tests" });
    return (_jsxs(AdminPage, { children: [_jsx(AdminPageHeader, { title: "Tests & rates", subtitle: `${filtered.length} tests in catalog`, actions: _jsx(Button, { size: "sm", className: "rounded-xl", onClick: () => {
                        setCreating(true);
                        setEditing(null);
                        setForm({ ...form, name: '', price: 0, specialPrice: 0, categoryId: categories.data?.[0]?.id ?? '' });
                    }, children: "Add test" }) }), _jsx(AdminToolbar, { children: _jsx(AdminSearch, { value: q, onChange: setQ, placeholder: "Search tests\u2026" }) }), (creating || editing) ? (_jsxs(AdminPanel, { title: editing ? 'Edit test' : 'New test', subtitle: "Update MRP and HealthID Card special price", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsx(Input, { label: "Test name", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }), _jsx(AdminSelect, { label: "Category", value: form.categoryId, onChange: (categoryId) => setForm({ ...form, categoryId }), children: (categories.data ?? []).map((c) => _jsx("option", { value: c.id, children: c.name }, c.id)) }), _jsx(Input, { label: "MRP (\u20B9)", type: "number", value: form.price, onChange: (e) => setForm({ ...form, price: Number(e.target.value) }) }), _jsx(Input, { label: "Special price (\u20B9)", type: "number", value: form.specialPrice, onChange: (e) => setForm({ ...form, specialPrice: Number(e.target.value) }) }), _jsx(Input, { label: "Short description", value: form.shortDescription, onChange: (e) => setForm({ ...form, shortDescription: e.target.value }), className: "sm:col-span-2" })] }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx(Button, { size: "sm", className: "rounded-xl", onClick: () => save.mutate(), children: "Save" }), _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", onClick: () => { setEditing(null); setCreating(false); }, children: "Cancel" })] })] })) : null, _jsx(AdminTable, { children: _jsxs("table", { className: "w-full min-w-[900px] text-left text-sm", children: [_jsxs(AdminTHead, { children: [_jsx(AdminTh, { children: "Test" }), _jsx(AdminTh, { children: "Category" }), _jsx(AdminTh, { className: "text-right", children: "MRP" }), _jsx(AdminTh, { className: "text-right", children: "Special" }), _jsx(AdminTh, { children: "Flags" }), _jsx(AdminTh, { className: "text-right", children: "Actions" })] }), _jsx("tbody", { children: !filtered.length ? (_jsx(EmptyRow, { colSpan: 6, message: "No tests found" })) : (filtered.map((t) => {
                                const sp = specialPrice(Number(t.price), Number(t.discountPercent));
                                return (_jsxs(AdminTr, { children: [_jsx(AdminTd, { className: "font-semibold", children: t.name }), _jsx(AdminTd, { className: "text-ink-soft", children: t.category.name }), _jsx(AdminTd, { className: "text-right text-ink-soft line-through", children: formatMoney(Number(t.price)) }), _jsx(AdminTd, { className: "text-right font-bold text-teal", children: formatMoney(sp) }), _jsxs(AdminTd, { children: [t.isPopular ? _jsx(Badge, { tone: "warn", children: "Popular" }) : null, ' ', _jsx(Badge, { tone: t.isActive ? 'success' : 'danger', children: t.isActive ? 'Active' : 'Off' })] }), _jsxs(AdminTd, { className: "text-right", children: [_jsx(Button, { size: "sm", variant: "secondary", className: "mr-2 rounded-xl", onClick: () => openEdit(t), children: "Edit" }), _jsx(Button, { size: "sm", variant: "secondary", className: "rounded-xl", onClick: () => toggleActive.mutate({ id: t.id, isActive: !t.isActive }), children: t.isActive ? 'Disable' : 'Enable' })] })] }, t.id));
                            })) })] }) })] }));
}
