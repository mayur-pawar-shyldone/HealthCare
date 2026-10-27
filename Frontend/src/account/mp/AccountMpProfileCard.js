import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldCheck } from 'lucide-react';
import { MAX_FAMILY_MEMBERS } from '@/account/account-data';
import { PLATFORM } from '@/data/platform-content';
import { useAccount } from '@/account/AccountContext';
import { formatValidTill, memberInitials } from '@/account/dashboard/mp-utils';
export function AccountMpProfileCard() {
    const acc = useAccount();
    const rows = [
        { label: 'Member ID', value: acc.memberId(), accent: false },
        { label: 'Valid till', value: formatValidTill(), accent: false },
        { label: 'Plan', value: `Family · ${PLATFORM.membership.flatDiscount}% off`, accent: true },
    ];
    const pct = (acc.family.length / MAX_FAMILY_MEMBERS) * 100;
    const mobileDisplay = acc.mobile.startsWith('+') ? acc.mobile : `+91 ${acc.mobile}`;
    return (_jsxs("section", { className: "overflow-hidden rounded-[20px] bg-white", children: [_jsxs("div", { className: "bg-navy px-4 pb-12 pt-5 text-white sm:px-5", children: [_jsx("p", { className: "text-[13px] text-white/75", children: "My Account" }), _jsx("p", { className: "mt-1 text-2xl font-extrabold tracking-tight", children: acc.name }), _jsx("p", { className: "mt-0.5 text-[13px] text-white/75", children: "Member since Oct 2026" })] }), _jsxs("div", { className: "px-4 pb-4 sm:px-5 sm:pb-5", children: [_jsx("span", { className: "-mt-9 grid h-[72px] w-[72px] place-items-center rounded-xl bg-mp-coral text-xl font-bold text-white ring-4 ring-white", children: memberInitials(acc.name) }), _jsx("dl", { className: "mt-5 space-y-3 text-sm", children: rows.map((r) => (_jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-[13px] text-muted", children: r.label }), _jsx("dd", { className: `text-sm font-bold ${r.accent ? 'text-mp-teal-700' : 'text-navy'}`, children: r.value })] }, r.label))) }), _jsxs("div", { className: "mt-5 border-t border-line pt-5", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-semibold text-navy", children: "Family slots" }), _jsxs("span", { className: "text-muted", children: [acc.family.length, " of ", MAX_FAMILY_MEMBERS] })] }), _jsx("p", { className: "mt-1 text-[12px] text-muted", children: "1 primary + up to 4 additional members" }), _jsx("div", { className: "mt-3 h-2 rounded-full bg-mp-teal-50", role: "progressbar", "aria-valuenow": acc.family.length, "aria-valuemin": 0, "aria-valuemax": MAX_FAMILY_MEMBERS, children: _jsx("div", { className: "h-2 rounded-full bg-mp-teal", style: { width: `${pct}%` } }) })] }), _jsxs("p", { className: "mt-5 flex items-center gap-2 rounded-lg bg-mp-teal-50 px-3 py-2.5 text-[13px] text-mp-teal-700", children: [_jsx(ShieldCheck, { className: "h-4 w-4 shrink-0", "aria-hidden": true }), mobileDisplay, " is verified for OTP login"] })] })] }));
}
