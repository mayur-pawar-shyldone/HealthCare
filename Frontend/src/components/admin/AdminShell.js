import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Activity, BadgePercent, CalendarDays, ClipboardList, CreditCard, ExternalLink, FileText, Home, LayoutDashboard, LogOut, MessageCircle, Receipt, Shield, TestTube2, UserRound, Users, } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { clearSession } from '@/store/authSlice';
import api from '@/services/api';
import { Logo } from '@/components/brand/Logo';
/** Primary ops flow — mirrors user app order: home → people → bookings → money → reports → catalog */
const primaryNav = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/appointments', label: 'Bookings', icon: CalendarDays },
    { to: '/admin/payments', label: 'Payments', icon: Receipt },
    { to: '/admin/reports', label: 'Reports', icon: FileText },
    { to: '/admin/tests', label: 'Tests & rates', icon: TestTube2 },
    { to: '/admin/categories', label: 'Categories', icon: ClipboardList },
    { to: '/admin/memberships', label: 'Memberships', icon: CreditCard },
];
/** Super-admin & system tools */
const systemNav = [
    { to: '/admin/settings/pricing', label: 'Payment promo', icon: BadgePercent, superOnly: true },
    { to: '/admin/audit', label: 'Audit log', icon: Activity },
    { to: '/admin/whatsapp', label: 'WhatsApp', icon: MessageCircle },
];
const mobileNav = [
    { to: '/admin', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/admin/customers', label: 'Users', icon: Users },
    { to: '/home', label: 'App', icon: ExternalLink, external: true },
    { to: '/admin/appointments', label: 'Bookings', icon: CalendarDays },
    { to: '/admin/payments', label: 'Payments', icon: Receipt },
];
function SidebarLink({ item, onNavigate }) {
    const Icon = item.icon;
    return (_jsxs(NavLink, { to: item.to, end: item.end, onClick: onNavigate, className: ({ isActive }) => cn('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors', isActive ? 'bg-teal-light text-teal' : 'text-ink-soft hover:bg-slate-50 hover:text-ink'), children: [_jsx(Icon, { className: "h-[17px] w-[17px] shrink-0", strokeWidth: 2 }), item.label] }));
}
function SidebarNav({ isSuper, onNavigate }) {
    const system = systemNav.filter((item) => !item.superOnly || isSuper);
    return (_jsxs("nav", { "aria-label": "Admin navigation", className: "space-y-4", children: [_jsx("div", { className: "space-y-0.5", children: primaryNav.map((item) => (_jsx(SidebarLink, { item: item, onNavigate: onNavigate }, item.to))) }), system.length > 0 ? (_jsxs("div", { children: [_jsx("p", { className: "mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft/70", children: isSuper ? 'Super admin' : 'System' }), _jsx("div", { className: "space-y-0.5", children: system.map((item) => (_jsx(SidebarLink, { item: item, onNavigate: onNavigate }, item.to))) })] })) : null] }));
}
export function AdminShell() {
    const user = useSelector((s) => s.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSuper = user?.role === 'SUPER_ADMIN';
    async function logout() {
        try {
            await api.post('/auth/logout', { refreshToken: localStorage.getItem('hc_refresh') });
        }
        finally {
            dispatch(clearSession());
            navigate('/login', { replace: true });
        }
    }
    return (_jsxs("div", { className: "flex h-screen w-screen overflow-hidden app-mesh", children: [_jsx("aside", { className: "hidden h-full w-[220px] shrink-0 flex-col border-r border-line/80 bg-white lg:flex xl:w-[232px]", children: _jsxs("div", { className: "flex h-full flex-col px-3 py-4", children: [_jsx(Logo, { variant: "compact", className: "px-1" }), _jsxs("p", { className: "mt-2 flex items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft", children: [_jsx(Shield, { className: "h-3 w-3 text-teal" }), isSuper ? 'Super admin' : 'Admin console'] }), _jsxs(NavLink, { to: "/home", className: "mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-line/80 bg-white py-2.5 text-xs font-bold text-teal transition hover:border-teal/30 hover:bg-teal-light/40", children: [_jsx(ExternalLink, { className: "h-4 w-4", strokeWidth: 2.5 }), "Customer app"] }), _jsx("div", { className: "mt-4 min-h-0 flex-1 overflow-y-auto pr-0.5", children: _jsx(SidebarNav, { isSuper: isSuper }) }), _jsxs("div", { className: "mt-auto space-y-2 border-t border-line/70 pt-3", children: [_jsx("span", { className: cn('mx-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', isSuper ? 'bg-brand-red-light text-brand-red' : 'bg-teal-light text-teal-dark'), children: user?.role?.replace('_', ' ') }), _jsxs("div", { className: "flex items-center gap-2 px-1", children: [_jsx("span", { className: "min-w-0 flex-1 truncate text-xs font-medium text-ink-soft", children: user?.fullName }), _jsx("button", { type: "button", onClick: logout, title: "Sign out", className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-soft transition hover:bg-red-50 hover:text-brand-red", children: _jsx(LogOut, { className: "h-4 w-4" }) })] })] })] }) }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("header", { className: "flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line/70 bg-white px-4 lg:h-[52px] lg:px-6", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2 lg:gap-3", children: [_jsx("div", { className: "flex items-center gap-2 lg:hidden", children: _jsx(Logo, { variant: "icon" }) }), _jsxs("span", { className: "hidden items-center gap-1.5 rounded-full bg-teal-light px-2.5 py-1 text-[11px] font-semibold text-teal lg:inline-flex", children: [_jsx(Shield, { className: "h-3 w-3" }), isSuper ? 'Super admin console' : 'Admin console'] }), _jsxs("span", { className: "hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 xl:inline-flex", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }), "Platform live"] })] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx(NavLink, { to: "/home", className: "hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition hover:text-teal sm:inline-flex", children: "Customer app" }), _jsx("span", { className: cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', isSuper ? 'bg-brand-red-light text-brand-red' : 'bg-teal-light text-teal-dark'), children: user?.role?.replace('_', ' ') }), _jsxs("span", { title: "Profile", className: "inline-flex items-center gap-2 rounded-lg border border-line/80 bg-white py-1 pl-1 pr-2.5", children: [_jsx("span", { className: "grid h-7 w-7 place-items-center rounded-md bg-teal text-xs font-bold text-white", children: user?.fullName?.[0] }), _jsx("span", { className: "hidden max-w-[100px] truncate text-xs font-semibold text-ink md:inline", children: user?.fullName?.split(' ')[0] }), _jsx(UserRound, { className: "h-3.5 w-3.5 text-ink-soft md:hidden" })] }), _jsx("button", { type: "button", onClick: logout, title: "Sign out", className: "hidden h-8 w-8 place-items-center rounded-lg text-ink-soft transition hover:bg-red-50 hover:text-brand-red lg:grid", children: _jsx(LogOut, { className: "h-4 w-4" }) })] })] }), _jsx("main", { className: "min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-3 lg:px-6 lg:pb-6", children: _jsx(Outlet, {}) })] }), _jsx("nav", { className: "fixed inset-x-2 bottom-2 z-30 lg:hidden", children: _jsx("div", { className: "flex items-end justify-around rounded-xl border border-line/80 bg-white px-0.5 py-1.5 shadow-[0_4px_20px_rgba(12,25,41,0.1)]", children: mobileNav.map((item) => {
                        const Icon = item.icon;
                        if ('external' in item && item.external) {
                            return (_jsx(NavLink, { to: item.to, className: "-mt-4 grid h-11 w-11 place-items-center rounded-xl bg-teal text-white shadow-md transition active:scale-95", children: _jsx(Icon, { className: "h-5 w-5", strokeWidth: 2.5 }) }, item.to));
                        }
                        return (_jsx(NavLink, { to: item.to, end: 'end' in item ? item.end : false, className: ({ isActive }) => cn('flex min-w-[48px] flex-col items-center gap-0.5 px-1 py-1 text-[9px] font-semibold', isActive ? 'text-teal' : 'text-ink-soft'), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: isActive ? 2.25 : 2 }), item.label] })) }, item.to));
                    }) }) })] }));
}
