import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, TestTube2 } from 'lucide-react';
import { navigateToPopularPlans } from '@/lib/landing-nav-scroll';
import { useAccount } from '@/account/AccountContext';
import { AccountMpLogo } from '@/account/mp/AccountMpLogo';
import { ACCOUNT_MP_NAV } from '@/account/mp/account-mp-nav';
import { formatValidTill } from '@/account/dashboard/mp-utils';
export function AccountMpSidebar({ onNavigate }) {
    const acc = useAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (_jsxs("div", { className: "flex h-full flex-col bg-white px-2 pb-4 pt-5", children: [_jsx("div", { className: "px-2", children: _jsx(AccountMpLogo, {}) }), _jsxs("nav", { "aria-label": "Main", className: "mt-6 flex flex-col gap-1.5", children: [_jsxs("button", { type: "button", onClick: () => {
                            navigateToPopularPlans(navigate, onNavigate);
                        }, className: "group mx-1 mb-2 flex w-[calc(100%-0.5rem)] flex-col overflow-hidden rounded-2xl border border-mp-teal/25 bg-gradient-to-br from-mp-teal-50 via-white to-mp-coral-50 p-4 text-left shadow-sm transition hover:border-mp-teal hover:shadow-md", children: [_jsxs("span", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white shadow-sm", children: _jsx(TestTube2, { className: "h-5 w-5", "aria-hidden": true }) }), _jsx(ArrowUpRight, { className: "h-4 w-4 shrink-0 text-mp-teal-700 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100", "aria-hidden": true })] }), _jsx("span", { className: "mt-3 font-display text-[15px] font-bold leading-snug text-navy", children: "Continue browsing tests" }), _jsx("span", { className: "mt-1 text-[12.5px] leading-snug text-muted", children: "Popular packages on the home page \u00B7 member rates" })] }), ACCOUNT_MP_NAV.map(({ to, label, icon: Icon, end }) => (_jsxs(NavLink, { to: to, end: end, onClick: onNavigate, className: ({ isActive }) => {
                            const active = isActive ||
                                (to === '/account/bookings' && pathname.startsWith('/account/bookings')) ||
                                (to === '/account/profile' && pathname.startsWith('/account/profile'));
                            return `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-mp-teal ${active ? 'bg-navy font-semibold text-white' : 'text-navy hover:bg-canvas'}`;
                        }, children: [_jsx(Icon, { className: "h-5 w-5 shrink-0", "aria-hidden": true }), _jsx("span", { className: "whitespace-nowrap", children: label })] }, to)))] }), _jsxs("div", { className: "mt-auto", children: [_jsxs("div", { className: "rounded-2xl bg-mp-teal-50 px-5 py-4", children: [_jsx("p", { className: "text-sm font-medium text-mp-teal-700", children: "Card active" }), _jsx("p", { className: "mt-0.5 text-lg font-bold text-navy", children: acc.memberId() }), _jsxs("p", { className: "text-sm text-muted", children: ["Valid till ", formatValidTill()] })] }), _jsxs("button", { type: "button", onClick: () => {
                            acc.logout();
                            navigate('/login');
                            onNavigate?.();
                        }, className: "mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-medium text-brick transition-colors duration-150 hover:bg-mp-coral-50", children: [_jsx(LogOut, { className: "h-5 w-5", "aria-hidden": true }), "Log out"] })] })] }));
}
