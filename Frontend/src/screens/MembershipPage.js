import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck, Truck, Users } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { cn, formatDate, formatMoney } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { UserPage, UserPageHeader, UserPanel } from '@/components/user/UserUi';
import { HealthIdCard } from '@/components/brand/HealthIdCard';
import { PLATFORM } from '@/data/platform-content';
const perks = [
    { icon: ShieldCheck, title: 'Special rates on 63+ tests', body: 'Official partner pricing from the HealthID Card rate list — up to 77% off MRP.' },
    { icon: Truck, title: '29 diagnostic packages', body: 'Full Body, Diabetic, Cardiac, PCOD, Cancer panels & more at official brochure rates.' },
    { icon: Users, title: 'Family on one card', body: `Add spouse, parents, and children — up to ${PLATFORM.familyMembers} members.` },
    { icon: MessageCircle, title: 'WhatsApp updates', body: 'Bookings, reminders, and reports on WhatsApp.' },
];
export function MembershipPage() {
    const qc = useQueryClient();
    const current = useQuery({
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
        },
    });
    const addFamily = useMutation({
        mutationFn: async (payload) => api.post('/family', payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['family'] });
            qc.invalidateQueries({ queryKey: ['membership'] });
        },
    });
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('SPOUSE');
    const [age, setAge] = useState('');
    if (current.isLoading || plans.isLoading)
        return _jsx(Loading, {});
    const m = current.data;
    const plan = plans.data?.[0];
    return (_jsxs(UserPage, { children: [_jsx(UserPageHeader, { title: "HealthID Card", subtitle: "One-year family membership \u2014 free to start" }), !m && (_jsxs(UserPanel, { title: "Get your free card", subtitle: plan?.description, children: [_jsx(Badge, { tone: "success", children: "Free for 1 year" }), _jsx("p", { className: "mt-4 font-display text-3xl text-teal", children: "FREE" }), _jsxs("p", { className: "text-sm text-ink-soft line-through", children: [formatMoney(999), " launch value"] }), _jsx("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: perks.map((p) => (_jsxs("div", { className: "rounded-2xl border border-line/60 bg-white/60 p-4", children: [_jsx(p.icon, { className: "mb-2 h-5 w-5 text-teal" }), _jsx("p", { className: "font-semibold", children: p.title }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: p.body })] }, p.title))) }), plan ? (_jsx(Button, { className: "mt-6 rounded-xl", disabled: subscribe.isPending, onClick: () => subscribe.mutate(plan.id), children: "Activate free HealthID Card" })) : null] })), m ? (_jsxs(_Fragment, { children: [_jsxs(UserPanel, { title: "Active membership", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx(Badge, { tone: "success", children: "Active \u00B7 1 year" }), _jsx("p", { className: "mt-2 font-display text-2xl", children: m.plan.name }), _jsx("p", { className: "text-sm text-ink-soft", children: m.number })] }), _jsx(Link, { to: "/membership/card", children: _jsx(Button, { className: "rounded-xl", children: "View digital card" }) })] }), _jsxs("p", { className: "mt-4 text-sm text-ink-soft", children: ["Started ", formatDate(m.startsAt), " \u00B7 Valid until ", formatDate(m.expiresAt)] }), _jsxs("p", { className: "mt-2 text-sm font-medium text-teal", children: ["Flat ", Number(m.plan.flatDiscountPercent ?? 30), "% off applied on all bookings"] }), _jsx("ul", { className: "mt-5 grid gap-2 sm:grid-cols-2", children: m.plan.benefits.map((b) => _jsxs("li", { className: "text-sm", children: ["\u2713 ", b.title] }, b.id)) })] }), _jsxs(UserPanel, { title: "Family on your card", subtitle: `Up to ${m.plan.maxFamilyMembers ?? 5} members on one card`, children: [_jsx("div", { className: "mt-4 space-y-2", children: (m.members ?? []).map((member) => (_jsx("div", { className: "flex items-center justify-between rounded-2xl border border-line px-4 py-3", children: _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: member.name }), _jsxs("p", { className: "text-sm text-ink-soft", children: [member.relation, member.isPrimary ? ' · Primary' : ''] })] }) }, member.id))) }), _jsxs("div", { className: "mt-6 grid gap-3 md:grid-cols-4", children: [_jsx(Input, { label: "Name", value: name, onChange: (e) => setName(e.target.value) }), _jsxs("label", { className: "block text-sm", children: ["Relation", _jsxs("select", { className: "mt-1 w-full rounded-2xl border border-line px-4 py-3", value: relation, onChange: (e) => setRelation(e.target.value), children: [_jsx("option", { value: "SPOUSE", children: "Spouse" }), _jsx("option", { value: "PARENT", children: "Parent" }), _jsx("option", { value: "CHILD", children: "Child" }), _jsx("option", { value: "SIBLING", children: "Sibling" }), _jsx("option", { value: "OTHER", children: "Other" })] })] }), _jsx(Input, { label: "Age", value: age, onChange: (e) => setAge(e.target.value) }), _jsx("div", { className: "flex items-end", children: _jsx(Button, { className: "w-full", disabled: !name || addFamily.isPending, onClick: () => addFamily.mutate({ name, relation, age: age ? Number(age) : undefined }), children: "Add member" }) })] }), (family.data ?? []).length > (m.members?.length ?? 0) ? (_jsx("p", { className: "mt-3 text-xs text-ink-soft", children: "Saved family members are automatically linked to your card." })) : null] })] })) : null] }));
}
export function MembershipCardPage() {
    const q = useQuery({
        queryKey: ['card'],
        queryFn: async () => unwrap((await api.get('/membership/card')).data),
    });
    if (q.isLoading || !q.data)
        return _jsx(Loading, {});
    const c = q.data;
    return (_jsxs(UserPage, { className: "max-w-lg", children: [_jsx("div", { "data-print-hide": true, children: _jsx(UserPageHeader, { title: "Your HealthID Card", subtitle: "Tap to flip \u00B7 Show QR at home collection" }) }), _jsx("div", { id: "health-id-card-print", className: "print:flex print:justify-center", children: _jsx(HealthIdCard, { data: c }) }), _jsxs(UserPanel, { title: "Card details", className: "print:hidden", children: [_jsxs("dl", { className: "mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm", children: [_jsx(DetailItem, { label: "Card holder", value: c.memberName }), _jsx(DetailItem, { label: "Date of birth", value: c.dateOfBirth ? formatDate(c.dateOfBirth) : '—' }), _jsx(DetailItem, { label: "Valid from", value: formatDate(c.validFrom) }), _jsx(DetailItem, { label: "Valid until", value: formatDate(c.validUntil), highlight: true }), _jsx(DetailItem, { label: "Card number", value: c.membershipId, className: "col-span-2 font-mono tracking-wide" })] }), _jsxs("div", { className: "mt-5 border-t border-line pt-5", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-ink-soft", children: "Covered members" }), _jsx("ul", { className: "mt-3 space-y-2", children: c.familyMembers.map((m) => (_jsxs("li", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-medium", children: m.name }), _jsxs("span", { className: "text-ink-soft", children: [m.relation, m.isPrimary ? ' · Primary' : ''] })] }, m.name))) })] })] }), _jsxs("div", { "data-print-hide": true, className: "flex flex-wrap gap-3", children: [_jsx(Button, { className: "rounded-xl", onClick: () => navigator.share?.({ title: 'HealthID Card', text: `${c.memberName} · ${c.membershipId}` }).catch(() => navigator.clipboard.writeText(c.membershipId)), children: "Share card" }), _jsx(Button, { variant: "secondary", className: "rounded-xl", onClick: () => window.print(), children: "Save / Print" })] })] }));
}
function DetailItem({ label, value, highlight, className }) {
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("dt", { className: "text-xs uppercase tracking-wider text-ink-soft", children: label }), _jsx("dd", { className: cn('font-medium', highlight && 'text-brand-red', className), children: value })] }));
}
