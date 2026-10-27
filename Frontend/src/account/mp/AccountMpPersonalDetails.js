import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
const fields = [
    { key: 'fullName', label: 'Full name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'city', label: 'City' },
];
function loadEmail() {
    return localStorage.getItem('hid_email') || sessionStorage.getItem('hid_email') || '';
}
function loadCity() {
    return localStorage.getItem('hid_city') || sessionStorage.getItem('hid_city') || '';
}
export function AccountMpPersonalDetails() {
    const acc = useAccount();
    const mobileDisplay = acc.mobile.startsWith('+') ? acc.mobile : `+91 ${acc.mobile}`;
    const initial = {
        fullName: acc.name,
        mobile: mobileDisplay,
        email: loadEmail(),
        city: loadCity(),
    };
    const [details, setDetails] = useState(initial);
    const [draft, setDraft] = useState(initial);
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const save = () => {
        setDetails(draft);
        acc.saveProfile(draft.fullName);
        localStorage.setItem('hid_email', draft.email);
        localStorage.setItem('hid_city', draft.city);
        setEditing(false);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
    };
    const action = editing ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                    setDraft(details);
                    setEditing(false);
                }, className: "rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-navy hover:bg-canvas", children: "Cancel" }), _jsx("button", { type: "button", onClick: save, className: "rounded-full bg-navy px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-navy-600", children: "Save" })] })) : (_jsxs("button", { type: "button", onClick: () => {
            setDraft({ ...details, fullName: acc.name, mobile: mobileDisplay });
            setEditing(true);
        }, className: "inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-navy transition-colors duration-150 hover:bg-canvas", children: [saved ? _jsx(Check, { className: "h-4 w-4 text-mp-teal-700" }) : _jsx(Pencil, { className: "h-4 w-4" }), saved ? 'Saved' : 'Edit'] }));
    return (_jsx(AccountDashboardPanel, { title: "Personal details", action: action, children: _jsx("dl", { className: "grid gap-x-8 gap-y-4 sm:grid-cols-2", children: fields.map((f) => (_jsxs("div", { children: [_jsx("dt", { className: "text-sm text-muted", children: _jsx("label", { htmlFor: `pd-${f.key}`, children: f.label }) }), _jsx("dd", { className: "mt-1", children: editing && f.key !== 'mobile' ? (_jsx("input", { id: `pd-${f.key}`, value: draft[f.key], onChange: (e) => setDraft({ ...draft, [f.key]: e.target.value }), className: "w-full rounded-xl border border-line px-3 py-2 text-sm text-navy focus:border-mp-teal focus:outline-none focus:ring-2 focus:ring-mp-teal-50" })) : (_jsx("span", { className: "text-sm font-medium text-navy", children: f.key === 'fullName' ? acc.name : details[f.key] })) })] }, f.key))) }) }));
}
