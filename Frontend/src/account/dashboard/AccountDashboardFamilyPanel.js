import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { navigateToPopularPlans } from '@/lib/landing-nav-scroll';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
import { ageFromDob, memberInitials, memberShortName } from '@/account/dashboard/mp-utils';
export function AccountDashboardFamilyPanel({ onManageFamily, onAddMember }) {
    const acc = useAccount();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(acc.family[0]?.id ?? 'self');
    const selected = acc.family.find((f) => f.id === selectedId) ?? acc.family[0];
    const lastTestFor = useMemo(() => {
        const map = new Map();
        for (const b of acc.bookings) {
            if (b.status !== 'Completed')
                continue;
            const existing = map.get(b.memberId);
            const label = `${acc.pkg(b.packageId).name} · ${b.date}`;
            if (!existing)
                map.set(b.memberId, label);
        }
        return (memberId) => map.get(memberId) ?? 'No tests yet';
    }, [acc.bookings, acc.pkg]);
    if (!selected)
        return null;
    const age = ageFromDob(selected.dob);
    const facts = [
        { label: 'Relation', value: selected.relation },
        { label: 'Age', value: age != null ? `${age} yrs` : '—' },
        { label: 'Card ID', value: acc.memberId() },
        { label: 'Last test', value: lastTestFor(selected.id) },
    ];
    return (_jsx("div", { id: "card-family", className: "h-full min-h-0", children: _jsxs(AccountDashboardPanel, { title: "Family on this card", className: "flex h-full flex-col", action: _jsxs("button", { type: "button", onClick: onManageFamily, className: "inline-flex shrink-0 items-center gap-1.5 pt-0.5 text-[13px] font-semibold text-mp-teal-700 transition hover:text-mp-teal-800 hover:underline", children: [_jsx(Pencil, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Manage family"] }), children: [_jsxs("div", { role: "tablist", "aria-label": "Family members", className: "flex gap-3", children: [acc.family.map((f) => {
                            const active = f.id === selectedId;
                            return (_jsxs("button", { type: "button", role: "tab", "aria-selected": active, onClick: () => setSelectedId(f.id), className: "flex w-14 flex-col items-center gap-1.5 text-xs focus:outline-none", children: [_jsx("span", { className: `grid h-12 w-12 place-items-center rounded-full text-[13px] font-bold transition-colors duration-150 ${active ? 'bg-navy text-white ring-2 ring-mp-teal-50' : 'bg-mp-teal-50 text-muted hover:bg-[#d3ecea]'}`, children: memberInitials(f.name) }), _jsx("span", { className: active ? 'font-medium text-navy' : 'text-muted', children: memberShortName(f.name) })] }, f.id));
                        }), _jsxs("button", { type: "button", onClick: onAddMember ?? onManageFamily, className: "flex w-14 flex-col items-center gap-1.5 text-xs text-muted", children: [_jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-line transition-colors duration-150 hover:border-mp-teal hover:text-mp-teal-700", children: _jsx(Plus, { className: "h-4 w-4", "aria-hidden": true }) }), "Add"] })] }), _jsx("dl", { className: "mt-4 grid grid-cols-2 gap-2", children: facts.map((fact) => (_jsxs("div", { className: "rounded-lg bg-mp-coral-50 px-3 py-2", children: [_jsx("dt", { className: "text-xs text-brick", children: fact.label }), _jsx("dd", { className: "mt-0.5 truncate text-[13px] font-medium text-navy", children: fact.value })] }, fact.label))) }), _jsxs("div", { className: "mt-auto grid grid-cols-2 gap-2 pt-4", children: [_jsxs("button", { type: "button", onClick: () => {
                                acc.setDraftPartial({ memberId: selected.id });
                                navigateToPopularPlans(navigate);
                            }, className: "rounded-full bg-navy py-2.5 text-center text-[13px] font-semibold text-white transition-colors hover:bg-navy-600", children: ["Book for ", memberShortName(selected.name)] }), _jsx(Link, { to: "/account/bookings", className: "rounded-full border border-line py-2.5 text-center text-[13px] font-semibold text-navy transition-colors hover:bg-canvas", children: "View reports" })] })] }) }));
}
