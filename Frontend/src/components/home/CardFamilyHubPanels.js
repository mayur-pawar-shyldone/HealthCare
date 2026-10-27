import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { PLATFORM } from '@/data/platform-content';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
const RELATIONS = [
    { value: 'SPOUSE', label: 'Spouse' },
    { value: 'PARENT', label: 'Parent' },
    { value: 'CHILD', label: 'Child' },
    { value: 'SIBLING', label: 'Sibling' },
    { value: 'OTHER', label: 'Other' },
];
function formatRelation(relation) {
    if (!relation)
        return '';
    const lower = relation.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}
export function CardBenefitsList({ active, familyCount, maxFamily, memberDiscount, }) {
    const pct = memberDiscount ?? PLATFORM.membership.flatDiscount;
    const rows = active
        ? [
            { title: 'Status', desc: 'Active membership · free to keep', badge: 'Active' },
            { title: 'Member pricing', desc: `Flat ${pct}% off on eligible tests and packages at checkout.` },
            { title: 'Home collection', desc: 'Free home sample collection on eligible panels in partner cities.' },
            { title: 'Family on this card', desc: `${familyCount} of ${maxFamily} seats used.` },
        ]
        : [
            { title: 'Activate once', desc: 'Free 1-year card · member rates on every test.' },
            { title: 'Family coverage', desc: `Add up to ${maxFamily} people and book for anyone on the card.` },
            { title: 'Member pricing', desc: 'Flat discount on eligible tests once your card is active.' },
        ];
    return (_jsx("div", { className: "space-y-2", children: rows.map((row) => (_jsxs("div", { className: "flex items-start justify-between gap-3 rounded-2xl border border-line/60 bg-white/80 px-4 py-3.5", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-semibold text-ink", children: row.title }), _jsx("p", { className: "mt-0.5 text-sm text-ink-soft", children: row.desc })] }), 'badge' in row && row.badge ? (_jsx(Badge, { tone: "success", children: row.badge })) : null] }, row.title))) }));
}
export function FamilyOnCardPanel({ hasMembership, maxFamily }) {
    const qc = useQueryClient();
    const [showAdd, setShowAdd] = useState(false);
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('SPOUSE');
    const [age, setAge] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const family = useQuery({
        queryKey: ['family'],
        queryFn: async () => unwrap((await api.get('/family')).data),
        enabled: hasMembership,
    });
    const membership = useQuery({
        queryKey: ['membership'],
        queryFn: async () => unwrap((await api.get('/membership')).data),
        enabled: hasMembership,
    });
    const addFamily = useMutation({
        mutationFn: async (payload) => api.post('/family', payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['family'] });
            qc.invalidateQueries({ queryKey: ['membership'] });
            qc.invalidateQueries({ queryKey: ['card'] });
            setName('');
            setAge('');
            setMobile('');
            setShowAdd(false);
            setError('');
        },
        onError: () => setError('Could not add member. Check details and try again.'),
    });
    const removeFamily = useMutation({
        mutationFn: async (id) => api.delete(`/family/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['family'] });
            qc.invalidateQueries({ queryKey: ['membership'] });
            qc.invalidateQueries({ queryKey: ['card'] });
        },
    });
    if (!hasMembership) {
        return (_jsxs("div", { className: "rounded-2xl border border-dashed border-teal/25 bg-teal-light/20 px-4 py-8 text-center", children: [_jsx(Users, { className: "mx-auto h-8 w-8 text-teal" }), _jsx("p", { className: "mt-3 font-display text-lg text-ink", children: "Family members live on your card" }), _jsx("p", { className: "mt-1 text-sm text-ink-soft", children: "Activate your HealthID Card to add spouse, parents, or children." })] }));
    }
    const members = family.data ?? [];
    const atLimit = members.length >= maxFamily;
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-ink-soft", children: "Family members" }), _jsx("p", { className: "text-sm text-ink-soft", children: "People you can book tests for on this card." })] }), _jsxs(Button, { type: "button", size: "sm", variant: showAdd ? 'secondary' : 'primary', className: "rounded-xl", disabled: atLimit && !showAdd, onClick: () => {
                            setShowAdd((v) => !v);
                            setError('');
                        }, children: [_jsx(UserPlus, { className: "h-4 w-4" }), showAdd ? 'Close' : 'Add member'] })] }), _jsxs("p", { className: "text-xs font-semibold text-teal", children: [members.length, " of ", maxFamily, " members"] }), showAdd ? (_jsxs("div", { className: "rounded-2xl border border-line/70 bg-white p-4 shadow-sm", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsx(Input, { label: "Full name", value: name, onChange: (e) => setName(e.target.value), placeholder: "As per ID" }), _jsxs("label", { className: "block space-y-2 text-sm", children: [_jsx("span", { className: "font-semibold text-ink/80", children: "Relationship" }), _jsx("select", { className: "w-full rounded-2xl border border-line/80 bg-white px-4 py-3.5 outline-none focus:border-teal", value: relation, onChange: (e) => setRelation(e.target.value), children: RELATIONS.map((r) => (_jsx("option", { value: r.value, children: r.label }, r.value))) })] }), _jsx(Input, { label: "Age (optional)", value: age, onChange: (e) => setAge(e.target.value), inputMode: "numeric" }), _jsx(Input, { label: "Mobile (optional)", value: mobile, onChange: (e) => setMobile(e.target.value), inputMode: "numeric", maxLength: 10 })] }), error ? _jsx("p", { className: "mt-2 text-sm font-semibold text-[#c22f1b]", children: error }) : null, _jsx(Button, { className: "mt-4 rounded-xl", disabled: !name.trim() || addFamily.isPending, onClick: () => addFamily.mutate({
                            name: name.trim(),
                            relation,
                            age: age ? Number(age) : undefined,
                            mobile: mobile.trim() || undefined,
                        }), children: "Save member" })] })) : null, _jsxs("ul", { className: "space-y-2", children: [members.map((m) => {
                        const onCard = membership.data?.members?.some((cm) => cm.familyMember?.id === m.id || cm.name === m.name);
                        return (_jsxs("li", { className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line/60 bg-white px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-ink", children: m.name }), _jsxs("p", { className: "text-sm text-ink-soft", children: [formatRelation(m.relation), m.age != null ? ` · ${m.age} yrs` : '', m.mobile ? ` · ${m.mobile}` : ''] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [onCard ? (_jsx(Badge, { tone: "success", children: "On card" })) : (_jsx(Badge, { tone: "ink", children: "Saved" })), _jsx("button", { type: "button", className: "rounded-xl border border-line/70 p-2 text-ink-soft transition hover:border-red-200 hover:bg-red-50 hover:text-red-600", "aria-label": `Remove ${m.name}`, disabled: removeFamily.isPending, onClick: () => {
                                                if (confirm(`Remove ${m.name} from your family list?`))
                                                    removeFamily.mutate(m.id);
                                            }, children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, m.id));
                    }), !members.length && !family.isLoading ? (_jsx("li", { className: "rounded-2xl border border-dashed border-line/80 px-4 py-6 text-center text-sm text-ink-soft", children: "No family members yet. Add someone to book tests for them." })) : null] }), _jsxs(Link, { to: "/profile", className: "inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline", children: [_jsx(ShieldCheck, { className: "h-3.5 w-3.5" }), "Help with family on your card"] })] }));
}
export function hubSectionClassName() {
    return cn('overflow-hidden rounded-[28px] border border-line/80 bg-white shadow-[0_16px_48px_rgba(12,25,41,0.08)]');
}
