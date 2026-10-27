import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { CalendarClock, Home, MapPin } from 'lucide-react';
import { useAccount } from '@/account/AccountContext';
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel';
import { navigateToPopularPlans } from '@/lib/landing-nav-scroll';
const rowIcon = 'grid h-10 w-10 shrink-0 place-items-center rounded-full text-white';
export function AccountDashboardNextVisitPanel() {
    const acc = useAccount();
    const navigate = useNavigate();
    const next = acc.bookings.find((b) => b.status === 'Upcoming');
    const member = next ? acc.member(next.memberId) : undefined;
    const address = next ? acc.address(next.addressId) : undefined;
    const pkg = next ? acc.pkg(next.packageId) : undefined;
    if (!next || !pkg) {
        return (_jsxs(AccountDashboardPanel, { title: "Next home visit", className: "flex min-h-full flex-col", children: [_jsx("p", { className: "text-[13px] leading-relaxed text-muted", children: "No visit scheduled yet." }), _jsx("p", { className: "mt-1 text-[13px] leading-relaxed text-muted", children: "Pick a package from popular tests and book collection." }), _jsx("button", { type: "button", onClick: () => navigateToPopularPlans(navigate), className: "mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-mp-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mp-teal-700", children: "Browse popular tests" })] }));
    }
    return (_jsxs(AccountDashboardPanel, { title: "Next home visit", className: "flex min-h-full flex-col overflow-hidden", children: [_jsxs("ul", { className: "space-y-4", children: [_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: `${rowIcon} bg-mp-coral`, children: _jsx(CalendarClock, { className: "h-5 w-5", "aria-hidden": true }) }), _jsxs("div", { className: "min-w-0 pt-0.5", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wide text-muted", children: "Date & time" }), _jsx("p", { className: "mt-0.5 text-[15px] font-semibold text-navy", children: next.date }), _jsx("p", { className: "mt-0.5 text-[13px] text-muted", children: next.slot })] })] }), _jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: `${rowIcon} bg-mp-teal`, children: _jsx(MapPin, { className: "h-5 w-5", "aria-hidden": true }) }), _jsxs("div", { className: "min-w-0 pt-0.5", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wide text-muted", children: "Collection address" }), _jsx("p", { className: "mt-0.5 text-[15px] font-semibold text-navy", children: address?.label ?? 'Home' }), _jsx("p", { className: "mt-0.5 text-[13px] leading-snug text-muted", children: next.addressLine ?? address?.line ?? '—' })] })] })] }), _jsxs("div", { className: "-mx-3.5 -mb-3.5 mt-4 bg-mp-teal px-3.5 py-4 sm:-mx-4 sm:-mb-4 sm:px-4", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wide text-white/75", children: "Scheduled test" }), _jsx("p", { className: "mt-1 text-lg font-bold leading-tight text-white", children: pkg.name }), _jsxs("p", { className: "mt-1 text-[13px] text-white/90", children: ["for ", member?.name ?? 'Member'] }), _jsxs(Link, { to: `/account/bookings/${next.id}`, className: "mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors duration-150 hover:bg-mp-teal-50", children: [_jsx(Home, { className: "h-4 w-4", "aria-hidden": true }), "Manage visit"] })] })] }));
}
