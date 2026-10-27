import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api, { unwrap } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { UserPanel } from '@/components/user/UserUi';
export function MembershipEditPanel({ onClose }) {
    const qc = useQueryClient();
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('SPOUSE');
    const [age, setAge] = useState('');
    const membership = useQuery({
        queryKey: ['membership'],
        queryFn: async () => unwrap((await api.get('/membership')).data),
    });
    const plans = useQuery({
        queryKey: ['plans'],
        queryFn: async () => unwrap((await api.get('/membership/plans')).data),
    });
    const family = useQuery({
        queryKey: ['family'],
        queryFn: async () => unwrap((await api.get('/family')).data),
    });
    const subscribe = useMutation({
        mutationFn: async (planId) => api.post('/membership', { planId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['membership'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
            qc.invalidateQueries({ queryKey: ['card'] });
        },
    });
    const addFamily = useMutation({
        mutationFn: async (payload) => api.post('/family', payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['family'] });
            qc.invalidateQueries({ queryKey: ['membership'] });
            qc.invalidateQueries({ queryKey: ['card'] });
            setName('');
            setAge('');
        },
    });
    if (membership.isLoading || plans.isLoading)
        return _jsx(Loading, { label: "Loading card settings" });
    const m = membership.data;
    const plan = plans.data?.[0];
    if (!m) {
        return (_jsxs(UserPanel, { title: "Activate HealthID Card", subtitle: "Free 1-year membership", children: [_jsx("p", { className: "text-sm text-ink-soft", children: plan?.description }), plan ? (_jsx(Button, { className: "mt-4 rounded-xl", disabled: subscribe.isPending, onClick: () => subscribe.mutate(plan.id), children: "Activate free card" })) : null, _jsx(Button, { variant: "ghost", className: "mt-3 rounded-xl", onClick: onClose, children: "Cancel" })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-teal", children: "Edit card" }), _jsx("h2", { className: "font-display text-xl", children: "Family & membership" })] }), _jsx(Button, { variant: "secondary", size: "sm", className: "rounded-xl", onClick: onClose, children: "Done" })] }), _jsxs(UserPanel, { title: "Membership details", children: [_jsx(Badge, { tone: "success", children: "Active" }), _jsx("p", { className: "mt-2 font-semibold", children: m.plan.name }), _jsx("p", { className: "text-sm text-ink-soft", children: m.number }), _jsxs("p", { className: "mt-2 text-sm text-ink-soft", children: ["Valid until ", formatDate(m.expiresAt), " \u00B7 ", Number(m.plan.flatDiscountPercent ?? 30), "% off on tests"] })] }), _jsxs(UserPanel, { title: "Family on your card", subtitle: `Up to ${m.plan.maxFamilyMembers ?? 5} members`, children: [_jsx("div", { className: "space-y-2", children: (m.members ?? []).map((member) => (_jsxs("div", { className: "rounded-xl border border-line/60 bg-white/60 px-4 py-3", children: [_jsx("p", { className: "font-medium", children: member.name }), _jsxs("p", { className: "text-sm text-ink-soft", children: [member.relation, member.isPrimary ? ' · Primary' : ''] })] }, member.id))) }), _jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-4", children: [_jsx(Input, { label: "Name", value: name, onChange: (e) => setName(e.target.value) }), _jsxs("label", { className: "block space-y-2 text-sm", children: [_jsx("span", { className: "font-semibold text-ink/80", children: "Relation" }), _jsxs("select", { className: "w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3.5 outline-none focus:border-teal", value: relation, onChange: (e) => setRelation(e.target.value), children: [_jsx("option", { value: "SPOUSE", children: "Spouse" }), _jsx("option", { value: "PARENT", children: "Parent" }), _jsx("option", { value: "CHILD", children: "Child" }), _jsx("option", { value: "SIBLING", children: "Sibling" }), _jsx("option", { value: "OTHER", children: "Other" })] })] }), _jsx(Input, { label: "Age", value: age, onChange: (e) => setAge(e.target.value) }), _jsx("div", { className: "flex items-end", children: _jsx(Button, { className: "w-full rounded-xl", disabled: !name || addFamily.isPending, onClick: () => addFamily.mutate({ name, relation, age: age ? Number(age) : undefined }), children: "Add member" }) })] }), (family.data ?? []).length > (m.members?.length ?? 0) ? (_jsx("p", { className: "mt-3 text-xs text-ink-soft", children: "Saved family members sync to your card automatically." })) : null, _jsx(Link, { to: "/profile", className: "mt-3 inline-block text-sm font-semibold text-teal hover:underline", children: "Update profile & address \u2192" })] })] }));
}
